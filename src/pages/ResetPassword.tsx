import { useState, useEffect, forwardRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPassword = forwardRef<HTMLDivElement>((_, ref) => {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true);
      } else if (session) {
        setIsValidSession(true);
      }
    });

    // Check if already in a valid session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsValidSession(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validation = resetPasswordSchema.safeParse(formData);
      if (!validation.success) {
        const error = validation.error.errors[0];
        toast({
          variant: 'destructive',
          title: isRTL ? 'خطأ في البيانات' : 'Invalid data',
          description: error.path[0] === 'confirmPassword' 
            ? (isRTL ? 'كلمات المرور غير متطابقة' : "Passwords don't match")
            : (isRTL ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters'),
        });
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: isRTL ? 'خطأ في تحديث كلمة المرور' : 'Password update error',
          description: error.message,
        });
      } else {
        setIsSuccess(true);
        toast({
          title: isRTL ? 'تم تحديث كلمة المرور بنجاح' : 'Password updated successfully',
          description: isRTL ? 'جاري تحويلك...' : 'Redirecting...',
        });
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  if (isSuccess) {
    return (
      <div ref={ref} className={`min-h-screen bg-background ${isRTL ? 'font-cairo' : 'font-sans'}`}>
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass rounded-3xl p-8 gradient-border text-center"
            >
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">
                {isRTL ? 'تم تحديث كلمة المرور' : 'Password Updated'}
              </h1>
              <p className="text-muted-foreground">
                {isRTL ? 'جاري تحويلك للوحة التحكم...' : 'Redirecting to dashboard...'}
              </p>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <div ref={ref} className={`min-h-screen bg-background ${isRTL ? 'font-cairo' : 'font-sans'}`}>
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass rounded-3xl p-8 gradient-border text-center"
            >
              <h1 className="text-2xl font-bold mb-2">
                {isRTL ? 'رابط غير صالح' : 'Invalid Link'}
              </h1>
              <p className="text-muted-foreground mb-6">
                {isRTL 
                  ? 'هذا الرابط غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد.'
                  : 'This link is invalid or has expired. Please request a new reset link.'
                }
              </p>
              <Button
                onClick={() => navigate('/auth')}
                className="gradient-bg hover:opacity-90 transition-all"
              >
                <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {isRTL ? 'العودة لتسجيل الدخول' : 'Back to Login'}
                  <ArrowIcon className="w-4 h-4" />
                </span>
              </Button>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div ref={ref} className={`min-h-screen bg-background ${isRTL ? 'font-cairo' : 'font-sans'}`}>
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-3xl p-8 gradient-border"
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">
                {isRTL ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
              </h1>
              <p className="text-muted-foreground">
                {isRTL ? 'أدخل كلمة المرور الجديدة' : 'Enter your new password'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className={isRTL ? 'text-right block' : ''}>
                  {isRTL ? 'كلمة المرور الجديدة' : 'New Password'}
                </Label>
                <div className="relative">
                  <Lock className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={`${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
                    placeholder={isRTL ? 'أدخل كلمة المرور الجديدة' : 'Enter new password'}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className={isRTL ? 'text-right block' : ''}>
                  {isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                </Label>
                <div className="relative">
                  <Lock className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={`${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
                    placeholder={isRTL ? 'أعد إدخال كلمة المرور' : 'Confirm new password'}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gradient-bg hover:opacity-90 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-pulse">{isRTL ? 'جاري التحديث...' : 'Updating...'}</span>
                ) : (
                  <span className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {isRTL ? 'تحديث كلمة المرور' : 'Update Password'}
                    <ArrowIcon className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate('/auth')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isRTL ? 'العودة لتسجيل الدخول' : 'Back to Login'}
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
});

ResetPassword.displayName = 'ResetPassword';

export default ResetPassword;
