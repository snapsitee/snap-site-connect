import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { z } from 'zod';

type AuthView = 'login' | 'signup' | 'forgot-password';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const Auth = () => {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [view, setView] = useState<AuthView>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: isRTL ? 'خطأ في تسجيل الدخول' : 'Login error',
          description: error.message,
        });
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast({
        variant: 'destructive',
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ أثناء تسجيل الدخول بجوجل' : 'An error occurred during Google sign-in',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validation = forgotPasswordSchema.safeParse({ email: formData.email });
      if (!validation.success) {
        toast({
          variant: 'destructive',
          title: isRTL ? 'خطأ في البيانات' : 'Invalid data',
          description: isRTL ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address',
        });
        setIsLoading(false);
        return;
      }

      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: isRTL ? 'خطأ' : 'Error',
          description: error.message,
        });
      } else {
        setResetEmailSent(true);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (view === 'login') {
        const validation = loginSchema.safeParse(formData);
        if (!validation.success) {
          toast({
            variant: 'destructive',
            title: isRTL ? 'خطأ في البيانات' : 'Invalid data',
            description: isRTL ? 'يرجى التحقق من البريد الإلكتروني وكلمة المرور' : 'Please check your email and password',
          });
          setIsLoading(false);
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          toast({
            variant: 'destructive',
            title: isRTL ? 'خطأ في تسجيل الدخول' : 'Login error',
            description: error.message === 'Invalid login credentials' 
              ? (isRTL ? 'بيانات الدخول غير صحيحة' : 'Invalid email or password')
              : error.message,
          });
        }
      } else if (view === 'signup') {
        const validation = signupSchema.safeParse(formData);
        if (!validation.success) {
          toast({
            variant: 'destructive',
            title: isRTL ? 'خطأ في البيانات' : 'Invalid data',
            description: isRTL ? 'يرجى ملء جميع الحقول بشكل صحيح' : 'Please fill all fields correctly',
          });
          setIsLoading(false);
          return;
        }

        const redirectUrl = `${window.location.origin}/dashboard`;
        
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: formData.fullName,
              phone: formData.phone,
            },
          },
        });

        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              variant: 'destructive',
              title: isRTL ? 'البريد مسجل مسبقاً' : 'Email already registered',
              description: isRTL ? 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول' : 'This email is already registered. Please log in instead.',
            });
          } else {
            toast({
              variant: 'destructive',
              title: isRTL ? 'خطأ في إنشاء الحساب' : 'Signup error',
              description: error.message,
            });
          }
        } else if (data.user) {
          // Create profile
          await supabase.from('profiles').insert({
            id: data.user.id,
            full_name: formData.fullName,
            phone: formData.phone,
          });

          toast({
            title: isRTL ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully',
            description: isRTL ? 'جاري تحويلك...' : 'Redirecting...',
          });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Forgot Password Success View
  if (view === 'forgot-password' && resetEmailSent) {
    return (
      <div className={`min-h-screen bg-background ${isRTL ? 'font-cairo' : 'font-sans'}`}>
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
                {isRTL ? 'تم إرسال الرابط!' : 'Reset Link Sent!'}
              </h1>
              <p className="text-muted-foreground mb-6">
                {isRTL 
                  ? 'تحقق من بريدك الإلكتروني للحصول على رابط إعادة تعيين كلمة المرور.'
                  : 'Check your email for a password reset link.'
                }
              </p>
              <Button
                onClick={() => {
                  setView('login');
                  setResetEmailSent(false);
                }}
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

  // Forgot Password Form View
  if (view === 'forgot-password') {
    return (
      <div className={`min-h-screen bg-background ${isRTL ? 'font-cairo' : 'font-sans'}`}>
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
                  {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                </h1>
                <p className="text-muted-foreground">
                  {isRTL 
                    ? 'أدخل بريدك الإلكتروني لاستلام رابط إعادة التعيين'
                    : 'Enter your email to receive a reset link'
                  }
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className={isRTL ? 'text-right block' : ''}>
                    {isRTL ? 'البريد الإلكتروني' : 'Email'}
                  </Label>
                  <div className="relative">
                    <Mail className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
                      placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-bg hover:opacity-90 transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-pulse">{isRTL ? 'جاري الإرسال...' : 'Sending...'}</span>
                  ) : (
                    <span className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {isRTL ? 'إرسال رابط إعادة التعيين' : 'Send Reset Link'}
                      <ArrowIcon className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setView('login')}
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
  }

  // Login / Signup View
  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'font-cairo' : 'font-sans'}`}>
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
                {view === 'login' 
                  ? (isRTL ? 'تسجيل الدخول' : 'Login')
                  : (isRTL ? 'إنشاء حساب' : 'Create Account')
                }
              </h1>
              <p className="text-muted-foreground">
                {view === 'login'
                  ? (isRTL ? 'أدخل بياناتك للوصول لحسابك' : 'Enter your credentials to access your account')
                  : (isRTL ? 'أنشئ حساباً جديداً للبدء' : 'Create a new account to get started')
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {view === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className={isRTL ? 'text-right block' : ''}>
                    {isRTL ? 'الاسم الكامل' : 'Full Name'}
                  </Label>
                  <div className="relative">
                    <User className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className={`${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
                      placeholder={isRTL ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                      required={view === 'signup'}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className={isRTL ? 'text-right block' : ''}>
                  {isRTL ? 'البريد الإلكتروني' : 'Email'}
                </Label>
                <div className="relative">
                  <Mail className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={`${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
                    placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                    required
                  />
                </div>
              </div>

              {view === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="phone" className={isRTL ? 'text-right block' : ''}>
                    {isRTL ? 'رقم الهاتف' : 'Phone Number'}
                  </Label>
                  <div className="relative">
                    <Phone className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className={`${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
                      placeholder={isRTL ? 'أدخل رقم هاتفك' : 'Enter your phone number'}
                      required={view === 'signup'}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className={isRTL ? 'text-right block' : ''}>
                  {isRTL ? 'كلمة المرور' : 'Password'}
                </Label>
                <div className="relative">
                  <Lock className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={`${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
                    placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter your password'}
                    required
                  />
                </div>
              </div>

              {view === 'login' && (
                <div className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                  <button
                    type="button"
                    onClick={() => setView('forgot-password')}
                    className="text-primary hover:underline transition-colors"
                  >
                    {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot your password?'}
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full gradient-bg hover:opacity-90 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-pulse">{isRTL ? 'جاري التحميل...' : 'Loading...'}</span>
                ) : (
                  <span className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {view === 'login' ? (isRTL ? 'تسجيل الدخول' : 'Login') : (isRTL ? 'إنشاء الحساب' : 'Create Account')}
                    <ArrowIcon className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {isRTL ? 'أو' : 'or'}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <span className="animate-pulse">{isRTL ? 'جاري التحميل...' : 'Loading...'}</span>
              ) : (
                <span className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {view === 'login' 
                    ? (isRTL ? 'تسجيل الدخول بجوجل' : 'Sign in with Google')
                    : (isRTL ? 'التسجيل بجوجل' : 'Sign up with Google')
                  }
                </span>
              )}
            </Button>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {view === 'login'
                  ? (isRTL ? 'ليس لديك حساب؟ أنشئ حساباً' : "Don't have an account? Sign up")
                  : (isRTL ? 'لديك حساب بالفعل؟ سجل دخول' : 'Already have an account? Log in')
                }
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
