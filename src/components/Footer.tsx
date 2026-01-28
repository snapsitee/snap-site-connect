import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Mail, Phone, Heart } from 'lucide-react';
import logoWhite from '@/assets/logo-white.png';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const Footer = () => {
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
          className={`grid md:grid-cols-3 gap-8 items-start ${isRTL ? 'md:grid-flow-col-dense' : ''}`}
        >
          {/* Logo and slogan */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`${isRTL ? 'md:col-start-3' : ''}`}
          >
            <img src={logoWhite} alt="SnapSite" className="h-10 w-auto mb-4" />
            <p className={`text-muted-foreground leading-relaxed ${isRTL ? 'font-cairo' : 'font-sans'}`}>
              {t('footer.slogan')}
            </p>
          </motion.div>

          {/* Contact info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${isRTL ? 'md:col-start-2 text-right' : 'text-center'}`}
          >
            <h4 className={`font-semibold mb-4 text-lg ${isRTL ? 'font-cairo' : 'font-sans'}`}>
              {t('contact.title')}
            </h4>
            <div className="space-y-3">
              <div className={`flex items-center gap-3 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Mail className="w-4 h-4 text-gradient-purple" />
                </div>
                <a href="mailto:contact@snapsitee.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  contact@snapsitee.com
                </a>
              </div>
              <div className={`flex items-center gap-3 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Phone className="w-4 h-4 text-gradient-blue" />
                </div>
                <a href="tel:+201033865141" className="text-muted-foreground hover:text-foreground transition-colors">
                  +20-1033865141
                </a>
              </div>
            </div>
          </motion.div>

          {/* Links and language */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`${isRTL ? 'md:col-start-1 text-left' : 'text-right'}`}
          >
            <div className={`flex flex-col items-end gap-4 ${isRTL ? 'items-start' : ''}`}>
              <LanguageSwitcher />
              <a
                href="https://drive.google.com/file/d/1Cl1YDolJvo05SCPnqVP1NhDNqNVFijRq/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-muted-foreground hover:text-foreground transition-colors text-sm hover:underline ${isRTL ? 'font-cairo' : 'font-sans'}`}
              >
                {t('footer.terms')}
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-border text-center"
        >
          <p className={`text-muted-foreground text-sm flex items-center justify-center gap-2 ${isRTL ? 'font-cairo' : 'font-sans'}`}>
            © {new Date().getFullYear()} SnapSite. {t('footer.rights')}.
            <span className="inline-flex items-center gap-1">
              <span>{isRTL ? 'صنع بـ' : 'Made with'}</span>
              <Heart className="w-4 h-4 text-destructive fill-destructive" />
            </span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
