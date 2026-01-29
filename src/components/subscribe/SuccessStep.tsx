import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

interface SuccessStepProps {
  orderId: string;
}

const SuccessStep = ({ orderId }: SuccessStepProps) => {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-3xl p-12 gradient-border text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle className="w-12 h-12 text-white" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-4">
          {isRTL ? 'مبروك 🎉!' : 'Congratulations 🎉!'}
        </h1>
        
        <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
          {isRTL 
            ? 'تم استلام طلبك بنجاح. هنبدأ الشغل فوراً، وفريقنا هيتواصل معاك خلال 24 ساعة علشان نكمّل باقي الإجراءات.'
            : 'Your request has been received successfully. Our team will contact you within 24 hours to complete the next steps.'
          }
        </p>

        <div className="inline-block p-4 rounded-xl bg-muted mb-8">
          <p className="text-sm text-muted-foreground mb-1">
            {isRTL ? 'رقم الطلب' : 'Order ID'}
          </p>
          <p className="text-2xl font-bold font-mono gradient-text">{orderId}</p>
        </div>

        <div className={`flex flex-col sm:flex-row gap-3 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Home className="w-4 h-4" />
            {isRTL ? 'الصفحة الرئيسية' : 'Go Home'}
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            className={`gradient-bg hover:opacity-90 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            {isRTL ? 'لوحة التحكم' : 'Go to Dashboard'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SuccessStep;
