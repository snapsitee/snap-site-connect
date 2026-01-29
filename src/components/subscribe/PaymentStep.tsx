import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, ArrowRight, ArrowLeft, Copy, Check, Upload, Smartphone } from 'lucide-react';
import type { OrderData } from '@/pages/Subscribe';
import instapayQR from '@/assets/instapay-qr.jpeg';
import vodafoneQR from '@/assets/vodafone-qr.jpeg';

interface PaymentStepProps {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface PaymentSettings {
  instapay_account_number: string;
  instapay_username: string;
  instapay_link: string;
  vodafone_number: string;
  vodafone_link: string;
}

const PaymentStep = ({ orderData, updateOrderData, onNext, onBack }: PaymentStepProps) => {
  const { isRTL, language } = useLanguage();
  const { toast } = useToast();
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchPaymentSettings = async () => {
      const { data } = await supabase
        .from('payment_settings')
        .select('*')
        .single();
      
      if (data) {
        setPaymentSettings(data);
      }
    };

    fetchPaymentSettings();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-EG').format(price);
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
    toast({
      title: isRTL ? 'تم النسخ' : 'Copied!',
      description: isRTL ? 'تم نسخ النص للحافظة' : 'Text copied to clipboard',
    });
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

  const handleContinue = async () => {
    if (!selectedMethod) {
      toast({
        variant: 'destructive',
        title: isRTL ? 'اختر طريقة الدفع' : 'Select payment method',
        description: isRTL ? 'يرجى اختيار طريقة الدفع' : 'Please select a payment method',
      });
      return;
    }

    if (!receiptFile) {
      toast({
        variant: 'destructive',
        title: isRTL ? 'ارفع إيصال الدفع' : 'Upload receipt',
        description: isRTL ? 'يرجى رفع صورة إيصال الدفع' : 'Please upload the payment receipt',
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileName = `${Date.now()}-${receiptFile.name}`;
      const { data, error } = await supabase.storage
        .from('receipts')
        .upload(fileName, receiptFile);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(fileName);

      updateOrderData({ 
        paymentMethod: selectedMethod,
        receiptUrl: publicUrl,
      });
      
      onNext();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: isRTL ? 'خطأ في الرفع' : 'Upload error',
        description: isRTL ? 'حدث خطأ أثناء رفع الإيصال' : 'Error uploading receipt',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const BackArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="glass rounded-3xl p-8 gradient-border">
      <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className={`text-xl font-bold ${isRTL ? 'text-right' : ''}`}>
            {isRTL ? 'طريقة الدفع' : 'Payment Method'}
          </h2>
          <p className={`text-muted-foreground text-sm ${isRTL ? 'text-right' : ''}`}>
            {isRTL ? 'المبلغ المطلوب:' : 'Amount due:'} {formatPrice(orderData.total)} EGP
          </p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4 mb-6">
        {/* Instapay */}
        <div 
          className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
            selectedMethod === 'instapay' 
              ? 'border-gradient-purple bg-gradient-purple/5' 
              : 'border-border hover:border-gradient-purple/50'
          }`}
          onClick={() => setSelectedMethod('instapay')}
        >
          <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Smartphone className="w-6 h-6 text-gradient-purple" />
            <span className="font-semibold">Instapay</span>
          </div>
          
          {selectedMethod === 'instapay' && paymentSettings && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img 
                  src={instapayQR} 
                  alt="Instapay QR Code" 
                  className="w-48 h-48 rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <div className={`flex items-center justify-between p-3 bg-muted rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-xs text-muted-foreground">{isRTL ? 'رقم الحساب' : 'Account Number'}</p>
                    <p className="font-mono font-medium">{paymentSettings.instapay_account_number}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(paymentSettings.instapay_account_number, 'instapay_number');
                    }}
                  >
                    {copiedField === 'instapay_number' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                
                <div className={`flex items-center justify-between p-3 bg-muted rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-xs text-muted-foreground">{isRTL ? 'اسم المستخدم' : 'Username'}</p>
                    <p className="font-mono font-medium text-sm">{paymentSettings.instapay_username}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(paymentSettings.instapay_username, 'instapay_username');
                    }}
                  >
                    {copiedField === 'instapay_username' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(paymentSettings.instapay_link, '_blank');
                  }}
                >
                  {isRTL ? 'فتح رابط الدفع' : 'Open Payment Link'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Vodafone Cash */}
        <div 
          className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
            selectedMethod === 'vodafone' 
              ? 'border-gradient-purple bg-gradient-purple/5' 
              : 'border-border hover:border-gradient-purple/50'
          }`}
          onClick={() => setSelectedMethod('vodafone')}
        >
          <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Smartphone className="w-6 h-6 text-red-500" />
            <span className="font-semibold">Vodafone Cash</span>
          </div>
          
          {selectedMethod === 'vodafone' && paymentSettings && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img 
                  src={vodafoneQR} 
                  alt="Vodafone Cash QR Code" 
                  className="w-48 h-48 rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <div className={`flex items-center justify-between p-3 bg-muted rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-xs text-muted-foreground">{isRTL ? 'الرقم' : 'Number'}</p>
                    <p className="font-mono font-medium">{paymentSettings.vodafone_number}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(paymentSettings.vodafone_number, 'vodafone_number');
                    }}
                  >
                    {copiedField === 'vodafone_number' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(paymentSettings.vodafone_link, '_blank');
                  }}
                >
                  {isRTL ? 'فتح رابط الدفع' : 'Open Payment Link'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Receipt Upload */}
      <div className="mb-6">
        <Label className={`mb-2 block ${isRTL ? 'text-right' : ''}`}>
          {isRTL ? 'ارفع إيصال الدفع' : 'Upload Payment Receipt'}
        </Label>
        <div className="relative">
          <Input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="hidden"
            id="receipt-upload"
          />
          <label
            htmlFor="receipt-upload"
            className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-gradient-purple/50 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Upload className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {receiptFile 
                ? receiptFile.name 
                : (isRTL ? 'اختر صورة الإيصال' : 'Choose receipt image')
              }
            </span>
          </label>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {isRTL ? 'الحد الأقصى: 5 ميجابايت - صور أو PDF' : 'Max 5MB - Images or PDF'}
        </p>
      </div>

      {/* Buttons */}
      <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button
          variant="outline"
          onClick={onBack}
          className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <BackArrowIcon className="w-4 h-4" />
          {isRTL ? 'السابق' : 'Back'}
        </Button>
        <Button
          onClick={handleContinue}
          disabled={isUploading}
          className={`flex-1 gradient-bg hover:opacity-90 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {isUploading 
              ? (isRTL ? 'جاري الرفع...' : 'Uploading...')
              : (isRTL ? 'متابعة' : 'Continue')
            }
            {!isUploading && <ArrowIcon className="w-4 h-4" />}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;
