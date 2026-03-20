import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/ui/scroll-reveal';
import StaggerContainer, { StaggerItem } from '@/components/ui/stagger-container';
import { supabase } from '@/integrations/supabase/client';

// Default snaps from assets
import snap1 from '@/assets/snaps/Snap_1.jpg';
import snap2 from '@/assets/snaps/Snap_2.jpg';
import snap3 from '@/assets/snaps/Snap_3.jpg';
import snap4 from '@/assets/snaps/Snap_4.jpg';
import snap5 from '@/assets/snaps/Snap_5.jpg';
import snap6 from '@/assets/snaps/Snap_6.jpg';
import snap7 from '@/assets/snaps/Snap_7.jpg';
import snap8 from '@/assets/snaps/Snap_8.jpg';
import snap9 from '@/assets/snaps/Snap_9.jpg';

const defaultSnaps = [snap1, snap2, snap3, snap4, snap5, snap6, snap7, snap8, snap9];

interface Snap {
  id: string;
  title: string;
  image_url: string;
  display_order: number;
}

const OurSnapsSection = () => {
  const { isRTL } = useLanguage();
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSnaps = async () => {
      const { data } = await supabase
        .from('snaps')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (data && data.length > 0) {
        setSnaps(data);
      } else {
        // Use default snaps if none in DB
        setSnaps(defaultSnaps.map((url, i) => ({
          id: `default-${i}`,
          title: '',
          image_url: url,
          display_order: i,
        })));
      }
    };
    fetchSnaps();
  }, []);

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Camera className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {isRTL ? 'أعمالنا' : 'Our Work'}
              </span>
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {isRTL ? 'أحدث أعمالنا' : 'Our Snaps'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isRTL
                ? 'شوف بعض من أحدث المواقع اللي بنيناها لعملائنا'
                : 'Check out some of the latest websites we built for our clients'}
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {snaps.map((snap) => (
            <StaggerItem key={snap.id}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer aspect-[4/5]"
                onClick={() => setSelectedImage(snap.image_url)}
              >
                <img
                  src={snap.image_url}
                  alt={snap.title || 'SnapSite project'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {snap.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-semibold text-sm">{snap.title}</p>
                  </div>
                )}
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={selectedImage}
              alt="Snap preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default OurSnapsSection;
