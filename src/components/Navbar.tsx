import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LayoutDashboard } from 'lucide-react';
import logoWhite from '@/assets/logo-white.png';
import { motion, AnimatePresence } from 'framer-motion';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const Navbar = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { key: 'nav.home', id: 'hero' },
    { key: 'nav.howItWorks', id: 'how-it-works' },
    { key: 'nav.whyUs', id: 'why-us' },
    { key: 'nav.pricing', id: 'pricing' },
    { key: 'nav.contact', id: 'contact' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass shadow-lg shadow-black/5' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <img src={logoWhite} alt="SnapSite" className="h-8 w-auto" />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <motion.button
                key={link.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => scrollToSection(link.id)}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-muted/50"
              >
                {t(link.key)}
              </motion.button>
            ))}
          </div>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            {user ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {isRTL ? 'لوحة التحكم' : 'Dashboard'}
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Button
                    onClick={() => navigate('/auth')}
                    variant="ghost"
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    {isRTL ? 'تسجيل الدخول' : 'Login'}
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Button
                    onClick={() => scrollToSection('contact')}
                    className="gradient-bg hover:opacity-90 transition-all hover:scale-105 shadow-md shadow-gradient-purple/20"
                  >
                    {t('nav.getStarted')}
                  </Button>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-border">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link, index) => (
                    <motion.button
                      key={link.id}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => scrollToSection(link.id)}
                      className={`text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors py-3 px-4 text-sm font-medium rounded-lg ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      {t(link.key)}
                    </motion.button>
                  ))}
                  
                  {/* Mobile Auth Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 }}
                    className="mt-2 space-y-2"
                  >
                    {user ? (
                      <Button
                        onClick={() => {
                          navigate('/dashboard');
                          setIsMenuOpen(false);
                        }}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        {isRTL ? 'لوحة التحكم' : 'Dashboard'}
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => {
                            navigate('/auth');
                            setIsMenuOpen(false);
                          }}
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          {isRTL ? 'تسجيل الدخول' : 'Login'}
                        </Button>
                        <Button
                          onClick={() => scrollToSection('contact')}
                          className="gradient-bg hover:opacity-90 transition-opacity w-full"
                        >
                          {t('nav.getStarted')}
                        </Button>
                      </>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
