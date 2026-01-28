import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import logoWhite from '@/assets/logo-white.png';

const Navbar = () => {
  const { t, isRTL } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img src={logoWhite} alt="SnapSite" className="h-8 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                {t(link.key)}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Button
              onClick={() => scrollToSection('contact')}
              className="gradient-bg hover:opacity-90 transition-opacity"
            >
              {t('nav.getStarted')}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-muted-foreground hover:text-foreground transition-colors py-2 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {t(link.key)}
                </button>
              ))}
              <Button
                onClick={() => scrollToSection('contact')}
                className="gradient-bg hover:opacity-90 transition-opacity mt-2"
              >
                {t('nav.getStarted')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
