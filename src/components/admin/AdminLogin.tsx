import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import logoWhite from '@/assets/logo-white.png';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required').max(50),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

const AdminLogin = () => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      toast({
        title: 'Validation Error',
        description: result.error.errors[0]?.message || 'Please check your inputs',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // Map username to email format for Supabase Auth
    const email = `${formData.username.trim().toLowerCase()}@admin.snapsite.local`;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: formData.password,
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: 'Login Failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md">
        <div className="glass rounded-3xl p-8 gradient-border">
          <div className="text-center mb-8">
            <img src={logoWhite} alt="SnapSite" className="h-10 w-auto mx-auto mb-4" />
            <h1 className={`text-2xl font-bold gradient-text ${isRTL ? 'font-cairo' : 'font-sans'}`}>
              {t('admin.login')}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className={isRTL ? 'block text-right' : ''}>
                {isRTL ? 'اسم المستخدم' : 'Username'}
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
                className={`bg-muted border-border ${isRTL ? 'text-right' : ''}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={isRTL ? 'block text-right' : ''}>
                {t('admin.password')}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className={`bg-muted border-border ${isRTL ? 'text-right' : ''}`}
              />
            </div>

            <Button
              type="submit"
              className="w-full gradient-bg hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? '...' : t('admin.signIn')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
