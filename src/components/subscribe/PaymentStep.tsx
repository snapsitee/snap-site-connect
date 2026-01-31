import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Smartphone, Copy, Check, Upload, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import instapayQRDefault from '@/assets/instapay-qr.jpeg';
import vodafoneQRDefault from '@/assets/vodafone-qr.jpeg';

interface PaymentSettings {
  instapay_account_number: string;
  instapay_username: string;
  instapay_link: string;
  instapay_qr_url: string | null;
  vodafone_number: string;
  vodafone_link: string;
  vodafone_qr_url: string | null;
}

interface PaymentStepProps {
  paymentSettings: PaymentSettings | null;
  totalAmount: number;
  selectedPayment: string;
  setSelectedPayment: (method: string) => void;
  receiptFile: File | null;
  setReceiptFile: (file: File | null) => void;
  onNext: () => void;
  onBack: () => void;
  isRenewal: boolean;
}

const PaymentStep = ({
  paymentSettings,
  totalAmount,
  selectedPayment,
  setSelectedPayment,
  receiptFile,
  setReceiptFile,
  onNext,
  onBack,
  isRenewal,
}: PaymentStepProps) => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [copiedField, setCopiedField] = useState('');

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: isRTL ? 'تم النسخ!' : 'Copied!',
    });
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

  const handleNext = () => {
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

    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Amount Display */}
      <div className="text-center p-4 rounded-xl bg-primary/10 border border-primary/30">
        <p className="text-sm text-muted-foreground mb-1">
          {isRTL ? 'المبلغ المطلوب' : 'Amount Due'}
        </p>
        <p className="text-3xl font-bold text-primary">
          {totalAmount.toLocaleString()} {isRTL ? 'جنيه' : 'EGP'}
        </p>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-3">
        <Label className={isRTL ? 'text-right block' : ''}>
          {isRTL ? 'طريقة الدفع' : 'Payment Method'} *
        </Label>
        
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

      {/* Receipt Upload */}
      <div className="space-y-2">
        <Label className={isRTL ? 'text-right block' : ''}>
          {isRTL ? 'إيصال الدفع' : 'Payment Receipt'} *
        </Label>
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
            className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
              receiptFile 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            } ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {receiptFile ? (
              <>
                <Check className="w-5 h-5 text-primary" />
                <span className="text-primary font-medium truncate max-w-[200px]">{receiptFile.name}</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {isRTL ? 'اختر صورة الإيصال' : 'Choose receipt image'}
                </span>
              </>
            )}
          </label>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {!isRenewal && (
          <Button onClick={onBack} variant="outline" className="flex-1">
            <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
              {isRTL ? 'السابق' : 'Back'}
            </span>
          </Button>
        )}
        <Button onClick={handleNext} className={`gradient-bg ${isRenewal ? 'w-full' : 'flex-1'}`}>
          <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {isRTL ? 'التالي' : 'Next'}
            {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </span>
        </Button>
      </div>
    </motion.div>
  );
};

export default PaymentStep;
