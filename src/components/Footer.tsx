import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Mail, Phone } from 'lucide-react';
import logoWhite from '@/assets/core-studio-logo-white.png';
import { motion, useInView } from 'framer-motion';
import { useRef, forwardRef } from 'react';

const Footer = forwardRef<HTMLElement>((_, ref) => {
  const { t, isRTL } = useLanguage();
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: '-50px' });

  return (
    <footer ref={footerRef} className="py-16 border-t border-border relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-t from-gradient-purple/5 to-transparent blur-2xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={`flex flex-col md:flex-row justify-between items-center gap-8 ${isRTL ? 'md:flex-row-reverse' : ''}`}
        >
          {/* Logo and slogan */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`flex flex-col items-center md:items-start ${isRTL ? 'md:items-end' : ''}`}
          >
            <img src={logoWhite} alt="Core Studio" className="h-6 w-auto mb-4" width={1066} height={165} loading="lazy" />
            <p className={`text-muted-foreground text-sm ${isRTL ? 'font-cairo text-right' : 'font-sans text-left'}`}>
              {t('footer.slogan')}
            </p>
          </motion.div>

          {/* Contact info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Mail className="w-4 h-4 text-gradient-purple" />
              </div>
              <a href="mailto:contact@snapsitee.com" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                contact@snapsitee.com
              </a>
            </div>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Phone className="w-4 h-4 text-gradient-blue" />
              </div>
              <a href="tel:+201033865141" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                +20-1033865141
              </a>
            </div>
          </motion.div>

          {/* Links and language */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <a
              href="https://drive.google.com/file/d/1Cl1YDolJvo05SCPnqVP1NhDNqNVFijRq/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-muted-foreground hover:text-foreground transition-colors text-sm hover:underline ${isRTL ? 'font-cairo' : 'font-sans'}`}
            >
              {t('footer.terms')}
            </a>
            <LanguageSwitcher />
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 pt-6 border-t border-border text-center"
        >
          <p className={`text-muted-foreground text-sm ${isRTL ? 'font-cairo' : 'font-sans'}`}>
            © {new Date().getFullYear()} Core Studio. {t('footer.rights')}.
          </p>
        </motion.div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
