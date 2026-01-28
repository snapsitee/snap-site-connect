import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Mail, Phone } from 'lucide-react';
import logoWhite from '@/assets/logo-white.png';

const Footer = () => {
  const { t, isRTL } = useLanguage();

  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className={`grid md:grid-cols-3 gap-8 items-start ${isRTL ? 'md:grid-flow-col-dense' : ''}`}>
          {/* Logo and slogan */}
          <div className={`${isRTL ? 'md:col-start-3' : ''}`}>
            <img src={logoWhite} alt="SnapSite" className="h-8 w-auto mb-3" />
            <p className={`text-muted-foreground ${isRTL ? 'font-cairo' : 'font-sans'}`}>
              {t('footer.slogan')}
            </p>
          </div>

          {/* Contact info */}
          <div className={`${isRTL ? 'md:col-start-2 text-right' : 'text-center'}`}>
            <h4 className={`font-semibold mb-4 ${isRTL ? 'font-cairo' : 'font-sans'}`}>
              {t('contact.title')}
            </h4>
            <div className="space-y-2">
              <div className={`flex items-center gap-2 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a href="mailto:contact@snapsitee.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  contact@snapsitee.com
                </a>
              </div>
              <div className={`flex items-center gap-2 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Phone className="w-4 h-4 text-muted-foreground" />
                <a href="tel:+201033865141" className="text-muted-foreground hover:text-foreground transition-colors">
                  +20-1033865141
                </a>
              </div>
            </div>
          </div>

          {/* Links and language */}
          <div className={`${isRTL ? 'md:col-start-1 text-left' : 'text-right'}`}>
            <div className={`flex flex-col items-end gap-4 ${isRTL ? 'items-start' : ''}`}>
              <LanguageSwitcher />
              <a
                href="https://drive.google.com/file/d/1Cl1YDolJvo05SCPnqVP1NhDNqNVFijRq/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-muted-foreground hover:text-foreground transition-colors text-sm ${isRTL ? 'font-cairo' : 'font-sans'}`}
              >
                {t('footer.terms')}
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className={`text-muted-foreground text-sm ${isRTL ? 'font-cairo' : 'font-sans'}`}>
            © {new Date().getFullYear()} SnapSite. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
