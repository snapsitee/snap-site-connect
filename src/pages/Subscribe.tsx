import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Building, Mail, Phone, MessageSquare, Hash, Send, CheckCircle, Home, Upload, Copy, Check, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import instapayQRDefault from '@/assets/instapay-qr.jpeg';
import vodafoneQRDefault from '@/assets/vodafone-qr.jpeg';

const formSchema = z.object({
  fullName: z.string().trim().min(2, 'Name is required'),
  businessName: z.string().trim().min(2, 'Business name is required'),
  email: z.string().trim().email('Valid email is required'),
  phone: z.string().trim().min(10, 'Phone is required'),
  whatsapp: z.string().trim().min(10, 'WhatsApp is required'),
});

interface PaymentSettings {
  instapay_account_number: string;
  instapay_username: string;
  instapay_link: string;
  instapay_qr_url: string | null;
  vodafone_number: string;
  vodafone_link: string;
  vodafone_qr_url: string | null;
}

const Subscribe = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isRenewal = searchParams.get('renewal') === 'true';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [copiedField, setCopiedField] = useState('');
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [pricing, setPricing] = useState({ setupFee: 1500, monthlyFee: 500 });
  
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    whatsapp: '',
    websiteRequirements: '',
    originalOrderId: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const [{ data: paymentData }, { data: pricingData }] = await Promise.all([
        supabase.from('payment_settings').select('*').single(),
        supabase.from('pricing').select('*').single(),
      ]);
      
      if (paymentData) setPaymentSettings(paymentData);
      if (pricingData) {
        const applyDiscount = (price: number) => {
          if (pricingData.discount_enabled && pricingData.discount_percent > 0) {
            return Math.round(price - (price * pricingData.discount_percent / 100));
          }
          return price;
        };
        setPricing({
          setupFee: applyDiscount(isRenewal ? pricingData.monthly_fee : pricingData.setup_fee),
          monthlyFee: applyDiscount(pricingData.monthly_fee),
        });
      }
    };
    fetchSettings();
  }, [isRenewal]);

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: isRTL ? 'الملف كبير جداً' : 'File too large',
          description: isRTL ? 'الحد الأقصى 5 ميجابايت' : 'Maximum size is 5MB',
        });
        return;
      }
      setReceiptFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = formSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        variant: 'destructive',
        title: isRTL ? 'خطأ في البيانات' : 'Invalid data',
        description: validation.error.errors[0]?.message || (isRTL ? 'يرجى ملء جميع الحقول' : 'Please fill all fields'),
      });
      return;
    }

    if (!selectedPayment) {
      toast({
        variant: 'destructive',
        title: isRTL ? 'اختر طريقة الدفع' : 'Select payment method',
      });
      return;
    }

    if (!receiptFile) {
      toast({
        variant: 'destructive',
        title: isRTL ? 'ارفع إيصال الدفع' : 'Upload payment receipt',
      });
      return;
    }

    if (isRenewal && !formData.originalOrderId.trim()) {
      toast({
        variant: 'destructive',
        title: isRTL ? 'أدخل رقم الطلب الأصلي' : 'Enter original order ID',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload receipt
      const fileName = `${Date.now()}-${receiptFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, receiptFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(fileName);

      if (isRenewal) {
        // Validate order ID exists
        const { data: orderCheck } = await supabase
          .from('orders')
          .select('order_id')
          .eq('order_id', formData.originalOrderId.trim().toUpperCase())
          .maybeSingle();
        
        if (!orderCheck) {
          toast({
            variant: 'destructive',
            title: isRTL ? 'رقم الطلب غير موجود' : 'Order ID not found',
          });
          setIsSubmitting(false);
          return;
        }

        const { data, error } = await supabase
          .from('renewals')
          .insert([{
            renewal_id: '',
            original_order_id: formData.originalOrderId.trim().toUpperCase(),
            full_name: formData.fullName.trim(),
            business_name: formData.businessName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            whatsapp: formData.whatsapp.trim(),
            renewal_fee: pricing.monthlyFee,
            payment_method: selectedPayment,
            receipt_url: publicUrl,
            status: 'pending',
          }])
          .select('renewal_id')
          .single();

        if (error) throw error;
        setSubmittedId(data.renewal_id);
      } else {
        const { data, error } = await supabase
          .from('orders')
          .insert([{
            order_id: '',
            full_name: formData.fullName.trim(),
            business_name: formData.businessName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            whatsapp: formData.whatsapp.trim(),
            website_requirements: formData.websiteRequirements.trim(),
            setup_fee: pricing.setupFee,
            monthly_fee: pricing.monthlyFee,
            payment_method: selectedPayment,
            receipt_url: publicUrl,
          }])
          .select('order_id')
          .single();

        if (error) throw error;
        setSubmittedId(data.order_id);
      }

      setIsSuccess(true);
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        variant: 'destructive',
        title: isRTL ? 'حدث خطأ' : 'Error occurred',
        description: isRTL ? 'يرجى المحاولة مرة أخرى' : 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`min-h-screen bg-background ${isRTL ? 'font-cairo' : 'font-sans'}`}>
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-lg">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-3xl p-12 gradient-border text-center"
            >
              <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-4">
                {isRTL ? 'مبروك 🎉!' : 'Congratulations 🎉!'}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {isRTL 
                  ? 'تم استلام طلبك بنجاح. فريقنا هيتواصل معاك خلال 24 ساعة.'
                  : 'Your request has been received. Our team will contact you within 24 hours.'
                }
              </p>
              <div className="inline-block p-4 rounded-xl bg-muted mb-8">
                <p className="text-sm text-muted-foreground mb-1">
                  {isRTL ? 'رقم الطلب' : 'Order ID'}
                </p>
                <p className="text-2xl font-bold font-mono gradient-text">{submittedId}</p>
              </div>
              <Button variant="outline" onClick={() => navigate('/')} className="flex items-center gap-2 mx-auto">
                <Home className="w-4 h-4" />
                {isRTL ? 'الصفحة الرئيسية' : 'Go Home'}
              </Button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'font-cairo' : 'font-sans'}`}>
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-8 gradient-border"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold gradient-text mb-2">
                {isRenewal 
                  ? (isRTL ? 'تجديد الاشتراك' : 'Renew Subscription')
                  : (isRTL ? 'اشترك الآن' : 'Subscribe Now')
                }
              </h1>
              <p className="text-muted-foreground">
                {isRTL 
                  ? `المبلغ المطلوب: ${pricing.setupFee} جنيه`
                  : `Amount due: ${pricing.setupFee} EGP`
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={isRTL ? 'text-right block' : ''}>{isRTL ? 'الاسم الكامل' : 'Full Name'} *</Label>
                  <div className="relative">
                    <User className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                    <Input
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className={isRTL ? 'pr-10 text-right' : 'pl-10'}
                      placeholder={isRTL ? 'أدخل اسمك' : 'Enter your name'}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className={isRTL ? 'text-right block' : ''}>{isRTL ? 'اسم النشاط' : 'Business Name'} *</Label>
                  <div className="relative">
                    <Building className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                    <Input
                      value={formData.businessName}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      className={isRTL ? 'pr-10 text-right' : 'pl-10'}
                      placeholder={isRTL ? 'اسم النشاط التجاري' : 'Your business name'}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className={isRTL ? 'text-right block' : ''}>{isRTL ? 'البريد الإلكتروني' : 'Email'} *</Label>
                <div className="relative">
                  <Mail className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={isRTL ? 'pr-10 text-right' : 'pl-10'}
                    placeholder={isRTL ? 'بريدك الإلكتروني' : 'Your email'}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={isRTL ? 'text-right block' : ''}>{isRTL ? 'رقم الهاتف' : 'Phone'} *</Label>
                  <div className="relative">
                    <Phone className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className={isRTL ? 'pr-10 text-right' : 'pl-10'}
                      placeholder={isRTL ? 'رقم الهاتف' : 'Phone number'}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className={isRTL ? 'text-right block' : ''}>{isRTL ? 'واتساب' : 'WhatsApp'} *</Label>
                  <div className="relative">
                    <MessageSquare className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                    <Input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                      className={isRTL ? 'pr-10 text-right' : 'pl-10'}
                      placeholder={isRTL ? 'رقم الواتساب' : 'WhatsApp number'}
                      required
                    />
                  </div>
                </div>
              </div>

              {isRenewal ? (
                <div className="space-y-2">
                  <Label className={isRTL ? 'text-right block' : ''}>{isRTL ? 'رقم الطلب الأصلي' : 'Original Order ID'} *</Label>
                  <div className="relative">
                    <Hash className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                    <Input
                      value={formData.originalOrderId}
                      onChange={(e) => setFormData(prev => ({ ...prev, originalOrderId: e.target.value.toUpperCase() }))}
                      className={`uppercase font-mono ${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
                      placeholder="SNP-XXXXXX"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className={isRTL ? 'text-right block' : ''}>{isRTL ? 'متطلبات الموقع' : 'Website Requirements'}</Label>
                  <Textarea
                    value={formData.websiteRequirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, websiteRequirements: e.target.value }))}
                    className={isRTL ? 'text-right' : ''}
                    placeholder={isRTL ? 'أخبرنا عن متطلبات موقعك...' : 'Tell us about your website...'}
                    rows={3}
                  />
                </div>
              )}

              {/* Payment Methods */}
              <div className="space-y-3">
                <Label className={isRTL ? 'text-right block' : ''}>{isRTL ? 'طريقة الدفع' : 'Payment Method'} *</Label>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPayment('instapay')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedPayment === 'instapay' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Smartphone className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <span className="font-medium">Instapay</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setSelectedPayment('vodafone')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedPayment === 'vodafone' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Smartphone className="w-6 h-6 mx-auto mb-2 text-red-500" />
                    <span className="font-medium">Vodafone Cash</span>
                  </button>
                </div>

                {/* Payment Details */}
                {selectedPayment && paymentSettings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-xl bg-muted/50 border border-border space-y-4"
                  >
                    <div className="flex justify-center">
                      <img 
                        src={selectedPayment === 'instapay' 
                          ? (paymentSettings.instapay_qr_url || instapayQRDefault)
                          : (paymentSettings.vodafone_qr_url || vodafoneQRDefault)
                        } 
                        alt="QR Code" 
                        className="w-40 h-40 rounded-lg object-cover"
                      />
                    </div>
                    
                    <div className={`flex items-center justify-between p-3 bg-background rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={isRTL ? 'text-right' : ''}>
                        <p className="text-xs text-muted-foreground">
                          {selectedPayment === 'instapay' 
                            ? (isRTL ? 'رقم الحساب' : 'Account Number')
                            : (isRTL ? 'الرقم' : 'Number')
                          }
                        </p>
                        <p className="font-mono font-medium">
                          {selectedPayment === 'instapay' 
                            ? paymentSettings.instapay_account_number 
                            : paymentSettings.vodafone_number
                          }
                        </p>
                      </div>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon"
                        onClick={() => copyToClipboard(
                          selectedPayment === 'instapay' 
                            ? paymentSettings.instapay_account_number 
                            : paymentSettings.vodafone_number,
                          'number'
                        )}
                      >
                        {copiedField === 'number' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(
                        selectedPayment === 'instapay' 
                          ? paymentSettings.instapay_link 
                          : paymentSettings.vodafone_link, 
                        '_blank'
                      )}
                    >
                      {isRTL ? 'فتح رابط الدفع' : 'Open Payment Link'}
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Receipt Upload */}
              <div className="space-y-2">
                <Label className={isRTL ? 'text-right block' : ''}>{isRTL ? 'إيصال الدفع' : 'Payment Receipt'} *</Label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="receipt-upload"
                  />
                  <label
                    htmlFor="receipt-upload"
                    className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {receiptFile ? receiptFile.name : (isRTL ? 'اختر صورة الإيصال' : 'Choose receipt image')}
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full gradient-bg hover:opacity-90 text-lg py-6"
              >
                <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {isSubmitting 
                    ? (isRTL ? 'جاري الإرسال...' : 'Submitting...')
                    : (isRTL ? 'إرسال الطلب' : 'Submit Order')
                  }
                  {!isSubmitting && <Send className="w-5 h-5" />}
                </span>
              </Button>
            </form>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Subscribe;
