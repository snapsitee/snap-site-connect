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
    <div className={`flex items-center justify-center gap-0 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : isCurrent 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-muted-foreground/30 text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{stepNumber}</span>
                )}
              </motion.div>
              <span className={`text-xs mt-2 font-medium transition-colors ${
                isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {stepLabels[index]}
              </span>
            </div>
            
            {/* Connector Line */}
            {stepNumber < totalSteps && (
              <div className={`w-12 h-0.5 mx-2 transition-colors duration-300 ${
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
