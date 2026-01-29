import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Calendar, RefreshCw, Globe } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

interface Order {
  id: string;
  order_id: string;
  business_name: string;
  subscription_status: string;
  project_status: string;
  website_status: string;
  start_date: string | null;
  renewal_date: string | null;
  created_at: string;
}

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const { isRTL, language } = useLanguage();
  const navigate = useNavigate();

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'active':
      case 'renewed':
      case 'live':
      case 'delivered':
        return 'default';
      case 'pending':
      case 'received':
      case 'in_progress':
      case 'maintenance':
        return 'secondary';
      case 'expired':
      case 'suspended':
      case 'didnt_renew':
      case 'disabled':
      case 'paused':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string, type: 'subscription' | 'project' | 'website'): string => {
    const labels: Record<string, Record<string, { en: string; ar: string }>> = {
      subscription: {
        pending: { en: 'Pending', ar: 'قيد الانتظار' },
        active: { en: 'Active', ar: 'نشط' },
        suspended: { en: 'Suspended', ar: 'معلق' },
        expired: { en: 'Expired', ar: 'منتهي' },
        renewed: { en: 'Renewed', ar: 'مجدد' },
        didnt_renew: { en: "Didn't Renew", ar: 'لم يجدد' },
        fake_order: { en: 'Fake Order', ar: 'طلب وهمي' },
      },
      project: {
        received: { en: 'Received', ar: 'مستلم' },
        in_progress: { en: 'In Progress', ar: 'قيد التنفيذ' },
        delivered: { en: 'Delivered', ar: 'تم التسليم' },
      },
      website: {
        live: { en: 'Live', ar: 'مباشر' },
        disabled: { en: 'Disabled', ar: 'معطل' },
        maintenance: { en: 'Maintenance', ar: 'صيانة' },
        paused: { en: 'Paused', ar: 'متوقف' },
      },
    };

    const statusLabels = labels[type]?.[status];
    return statusLabels ? (language === 'ar' ? statusLabels.ar : statusLabels.en) : status;
  };

  const getDaysUntilRenewal = (): number | null => {
    if (!order.renewal_date) return null;
    return differenceInDays(new Date(order.renewal_date), new Date());
  };

  const daysLeft = getDaysUntilRenewal();
  const dateLocale = language === 'ar' ? ar : enUS;

  const handleRenew = () => {
    navigate(`/subscribe?renewal=true&orderId=${order.order_id}`);
  };

  return (
    <div className="glass rounded-2xl p-6 gradient-border hover:shadow-lg transition-shadow">
      <div className={`flex items-start justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
          <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
            <Building className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-bold">{order.business_name}</h3>
          </div>
          
          <p className="text-sm text-muted-foreground font-mono mb-4">
            {isRTL ? 'رقم الطلب:' : 'Order ID:'} {order.order_id}
          </p>

          {/* Status Badges */}
          <div className={`flex flex-wrap gap-2 mb-4 ${isRTL ? 'justify-end' : ''}`}>
            <Badge variant={getStatusVariant(order.subscription_status)}>
              {getStatusLabel(order.subscription_status, 'subscription')}
            </Badge>
            <Badge variant={getStatusVariant(order.project_status)}>
              {getStatusLabel(order.project_status, 'project')}
            </Badge>
            <Badge variant={getStatusVariant(order.website_status)}>
              <Globe className="w-3 h-3 mr-1" />
              {getStatusLabel(order.website_status, 'website')}
            </Badge>
          </div>

          {/* Dates */}
          <div className={`flex flex-wrap gap-4 text-sm text-muted-foreground ${isRTL ? 'justify-end' : ''}`}>
            {order.start_date && (
              <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Calendar className="w-4 h-4" />
                <span>
                  {isRTL ? 'بدأ:' : 'Started:'} {format(new Date(order.start_date), 'PP', { locale: dateLocale })}
                </span>
              </div>
            )}
            {order.renewal_date && (
              <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <RefreshCw className="w-4 h-4" />
                <span>
                  {isRTL ? 'التجديد:' : 'Renewal:'} {format(new Date(order.renewal_date), 'PP', { locale: dateLocale })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Days left and Renew button */}
        <div className={`flex flex-col items-center gap-3 ${isRTL ? 'items-start' : 'items-end'}`}>
          {daysLeft !== null && (
            <div className={`text-center p-3 rounded-xl ${daysLeft <= 7 ? 'bg-destructive/10' : 'bg-muted'}`}>
              <p className={`text-2xl font-bold ${daysLeft <= 7 ? 'text-destructive' : 'gradient-text'}`}>
                {daysLeft}
              </p>
              <p className="text-xs text-muted-foreground">
                {isRTL ? 'أيام متبقية' : 'days left'}
              </p>
            </div>
          )}
          
          {(order.subscription_status === 'active' || 
            order.subscription_status === 'expired' || 
            order.subscription_status === 'didnt_renew') && (
            <Button
              onClick={handleRenew}
              size="sm"
              className={`gradient-bg hover:opacity-90 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              {isRTL ? 'تجديد' : 'Renew'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
