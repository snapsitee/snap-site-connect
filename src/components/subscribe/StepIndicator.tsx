import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  isRTL: boolean;
}

const StepIndicator = ({ currentStep, totalSteps, stepLabels, isRTL }: StepIndicatorProps) => {
  return (
    <div className={`flex items-center justify-center gap-0 mb-6 sm:mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        
        return (
          <div key={stepNumber} className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent ? 1.1 : 1 }}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : isCurrent 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-muted-foreground/30 text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <span className="text-xs sm:text-sm font-semibold">{stepNumber}</span>
                )}
              </motion.div>
              <span className={`text-[10px] sm:text-xs mt-1.5 sm:mt-2 font-medium transition-colors ${
                isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {stepLabels[index]}
              </span>
            </div>
            
            {/* Connector Line */}
            {stepNumber < totalSteps && (
              <div className={`w-8 sm:w-12 h-0.5 mx-1 sm:mx-2 transition-colors duration-300 ${
                isCompleted ? 'bg-primary' : 'bg-muted-foreground/30'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
