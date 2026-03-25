import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WelcomePopup = () => {
  const { isRTL } = useLanguage();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState<{
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
    include_coupon: boolean;
    coupon_code: string | null;
  } | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('popup_dismissed')) return;

    const fetchSettings = async () => {
      const { data } = await supabase
        .from('popup_settings')
        .select('*')
        .limit(1)
        .single();

      if (data && data.is_active) {
        setSettings(data);
        setOpen(true);
      }
    };

    fetchSettings();
  }, []);

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      sessionStorage.setItem('popup_dismissed', 'true');
      setOpen(false);
    }
  };

  const handleCopy = async () => {
    if (settings?.coupon_code) {
      await navigator.clipboard.writeText(settings.coupon_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!settings) return null;

  const title = isRTL ? settings.title_ar : settings.title_en;
  const description = isRTL ? settings.description_ar : settings.description_en;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`sm:max-w-md ${isRTL ? 'font-cairo text-right' : ''}`}>
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="text-base pt-2">{description}</DialogDescription>
        </DialogHeader>

        {settings.include_coupon && settings.coupon_code && (
          <div className="flex items-center justify-between gap-3 mt-2 p-3 rounded-lg bg-muted border border-border">
            <code className="text-lg font-bold text-primary tracking-wider">
              {settings.coupon_code}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="shrink-0 gap-2"
            >
              {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
              {copied
                ? (isRTL ? 'تم النسخ' : 'Copied')
                : (isRTL ? 'نسخ' : 'Copy')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WelcomePopup;
