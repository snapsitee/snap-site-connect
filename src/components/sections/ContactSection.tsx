import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const contactSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  phone: z.string().trim().min(1, 'Phone is required').max(20),
  whatsapp: z.string().trim().min(1, 'WhatsApp is required').max(20),
  message: z.string().trim().min(1, 'Message is required').max(1000),
});

const ContactSection = () => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      toast({
        title: 'Validation Error',
        description: result.error.errors[0]?.message || 'Please check your inputs',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.from('leads').insert({
      full_name: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      whatsapp: formData.whatsapp.trim(),
      message: formData.message.trim(),
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: 'Error',
        description: t('contact.error'),
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success!',
        description: t('contact.success'),
      });
      setFormData({ fullName: '', email: '', phone: '', whatsapp: '', message: '' });
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      {/* Background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-purple/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-blue/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isRTL ? 'font-cairo' : 'font-sans'}`}>
              <span className="gradient-text">{t('contact.title')}</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="glass rounded-3xl p-8 gradient-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className={isRTL ? 'block text-right' : ''}>
                    {t('contact.fullName')} *
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className={`bg-muted border-border ${isRTL ? 'text-right' : ''}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className={isRTL ? 'block text-right' : ''}>
                    {t('contact.email')} *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`bg-muted border-border ${isRTL ? 'text-right' : ''}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className={isRTL ? 'block text-right' : ''}>
                    {t('contact.phone')} *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={`bg-muted border-border ${isRTL ? 'text-right' : ''}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className={isRTL ? 'block text-right' : ''}>
                    {t('contact.whatsapp')} *
                  </Label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    required
                    className={`bg-muted border-border ${isRTL ? 'text-right' : ''}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className={isRTL ? 'block text-right' : ''}>
                  {t('contact.businessDesc')} *
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={`bg-muted border-border resize-none ${isRTL ? 'text-right' : ''}`}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gradient-bg hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? '...' : t('contact.submit')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
