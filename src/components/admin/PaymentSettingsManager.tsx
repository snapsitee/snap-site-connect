import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, Smartphone, CreditCard } from 'lucide-react';

interface PaymentSettings {
  id: string;
  instapay_account_number: string;
  instapay_username: string;
  instapay_link: string;
  vodafone_number: string;
  vodafone_link: string;
}

const PaymentSettingsManager = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('payment_settings')
      .select('*')
      .single();

    if (!error && data) {
      setSettings(data);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);

    const { error } = await supabase
      .from('payment_settings')
      .update({
        instapay_account_number: settings.instapay_account_number,
        instapay_username: settings.instapay_username,
        instapay_link: settings.instapay_link,
        vodafone_number: settings.vodafone_number,
        vodafone_link: settings.vodafone_link,
      })
      .eq('id', settings.id);

    if (error) {
      toast({
        variant: 'destructive',
        title: isRTL ? 'خطأ' : 'Error',
        description: error.message,
      });
    } else {
      toast({
        title: isRTL ? 'تم الحفظ' : 'Saved',
        description: isRTL ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully',
      });
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-1/3" />
        <div className="h-64 bg-muted rounded" />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div>
          <h2 className={`text-2xl font-bold ${isRTL ? 'text-right' : ''}`}>
            {isRTL ? 'إعدادات الدفع' : 'Payment Settings'}
          </h2>
          <p className={`text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
            {isRTL ? 'إدارة حسابات الدفع' : 'Manage payment accounts'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Instapay */}
        <div className="glass rounded-xl p-6 gradient-border">
          <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Smartphone className="w-6 h-6 text-gradient-purple" />
            <h3 className="font-semibold text-lg">Instapay</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className={isRTL ? 'text-right block' : ''}>
                {isRTL ? 'رقم الحساب' : 'Account Number'}
              </Label>
              <Input
                value={settings.instapay_account_number}
                onChange={(e) => 
                  setSettings(prev => prev ? { ...prev, instapay_account_number: e.target.value } : null)
                }
                className={isRTL ? 'text-right' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label className={isRTL ? 'text-right block' : ''}>
                {isRTL ? 'اسم المستخدم' : 'Username'}
              </Label>
              <Input
                value={settings.instapay_username}
                onChange={(e) => 
                  setSettings(prev => prev ? { ...prev, instapay_username: e.target.value } : null)
                }
                className={isRTL ? 'text-right' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label className={isRTL ? 'text-right block' : ''}>
                {isRTL ? 'رابط الدفع' : 'Payment Link'}
              </Label>
              <Input
                value={settings.instapay_link}
                onChange={(e) => 
                  setSettings(prev => prev ? { ...prev, instapay_link: e.target.value } : null)
                }
                className={isRTL ? 'text-right' : ''}
              />
            </div>
          </div>
        </div>

        {/* Vodafone Cash */}
        <div className="glass rounded-xl p-6 gradient-border">
          <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CreditCard className="w-6 h-6 text-destructive" />
            <h3 className="font-semibold text-lg">Vodafone Cash</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className={isRTL ? 'text-right block' : ''}>
                {isRTL ? 'الرقم' : 'Number'}
              </Label>
              <Input
                value={settings.vodafone_number}
                onChange={(e) => 
                  setSettings(prev => prev ? { ...prev, vodafone_number: e.target.value } : null)
                }
                className={isRTL ? 'text-right' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label className={isRTL ? 'text-right block' : ''}>
                {isRTL ? 'رابط الدفع' : 'Payment Link'}
              </Label>
              <Input
                value={settings.vodafone_link}
                onChange={(e) => 
                  setSettings(prev => prev ? { ...prev, vodafone_link: e.target.value } : null)
                }
                className={isRTL ? 'text-right' : ''}
              />
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={isSaving}
        className={`gradient-bg hover:opacity-90 ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <Save className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
        {isSaving ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ التغييرات' : 'Save Changes')}
      </Button>
    </div>
  );
};

export default PaymentSettingsManager;
