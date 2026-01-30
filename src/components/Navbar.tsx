import { useState, useEffect, forwardRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import logoWhite from '@/assets/logo-white.png';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = forwardRef<HTMLElement>((_, ref) => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    
    if (!isHomePage) {
      navigate('/#' + id);
      return;
    }
    
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isHomePage && location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location, isHomePage]);

  const navLinks = [
    { key: 'nav.home', id: 'hero' },
    { key: 'nav.howItWorks', id: 'how-it-works' },
    { key: 'nav.whyUs', id: 'why-us' },
    { key: 'nav.pricing', id: 'pricing' },
    { key: 'nav.contact', id: 'contact' },
  ];

  return (
    <motion.nav
      ref={ref}
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
          {/* Logo - clickable to go home */}
          <motion.div 
            className="flex items-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
            onClick={() => navigate('/')}
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
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.35 }}
            >
              <Button
                variant="outline"
                onClick={() => navigate('/subscribe?renewal=true')}
                className="border-gradient-purple/50 hover:bg-gradient-purple/10 hover:border-gradient-purple transition-all hover:scale-105"
              >
                {isRTL ? 'تجديد' : 'Renew'}
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
                  
                  {/* Mobile CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 }}
                    className="mt-2 flex flex-col gap-2"
                  >
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/subscribe?renewal=true');
                      }}
                      className="border-gradient-purple/50 hover:bg-gradient-purple/10 w-full"
                    >
                      {isRTL ? 'تجديد' : 'Renew'}
                    </Button>
                    <Button
                      onClick={() => scrollToSection('contact')}
                      className="gradient-bg hover:opacity-90 transition-opacity w-full"
                    >
                      {t('nav.getStarted')}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
