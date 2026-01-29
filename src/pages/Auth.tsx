import { useState, useEffect } from 'react';
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
import { Mail, Lock, User, Phone, ArrowRight, ArrowLeft } from 'lucide-react';
import { z } from 'zod';

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

const Auth = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
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
      } else {
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
                {isLogin 
                  ? (isRTL ? 'تسجيل الدخول' : 'Login')
                  : (isRTL ? 'إنشاء حساب' : 'Create Account')
                }
              </h1>
              <p className="text-muted-foreground">
                {isLogin
                  ? (isRTL ? 'أدخل بياناتك للوصول لحسابك' : 'Enter your credentials to access your account')
                  : (isRTL ? 'أنشئ حساباً جديداً للبدء' : 'Create a new account to get started')
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
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
                      required={!isLogin}
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

              {!isLogin && (
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
                      required={!isLogin}
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

              <Button
                type="submit"
                className="w-full gradient-bg hover:opacity-90 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-pulse">{isRTL ? 'جاري التحميل...' : 'Loading...'}</span>
                ) : (
                  <span className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {isLogin ? (isRTL ? 'تسجيل الدخول' : 'Login') : (isRTL ? 'إنشاء الحساب' : 'Create Account')}
                    <ArrowIcon className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isLogin
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
