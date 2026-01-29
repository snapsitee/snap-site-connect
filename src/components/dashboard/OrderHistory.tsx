import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History, Package } from 'lucide-react';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface OrderHistoryItem {
  id: string;
  order_id: string;
  business_name: string;
  setup_fee: number;
  monthly_fee: number;
  addon_total: number;
  payment_method: string | null;
  created_at: string;
  subscription_status: string;
}

interface OrderHistoryProps {
  userId: string;
}

const OrderHistory = ({ userId }: OrderHistoryProps) => {
  const { isRTL, language } = useLanguage();
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dateLocale = language === 'ar' ? ar : enUS;

  useEffect(() => {
    fetchOrderHistory();
  }, [userId]);

  const fetchOrderHistory = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('id, order_id, business_name, setup_fee, monthly_fee, addon_total, payment_method, created_at, subscription_status')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (data) {
      setOrders(data);
    }
    setIsLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      renewed: 'default',
      pending: 'secondary',
      expired: 'destructive',
      suspended: 'destructive',
    };

    const labels: Record<string, { en: string; ar: string }> = {
      pending: { en: 'Pending', ar: 'قيد الانتظار' },
      active: { en: 'Active', ar: 'نشط' },
      renewed: { en: 'Renewed', ar: 'مجدد' },
      expired: { en: 'Expired', ar: 'منتهي' },
      suspended: { en: 'Suspended', ar: 'معلق' },
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] ? (language === 'ar' ? labels[status].ar : labels[status].en) : status}
      </Badge>
    );
  };

  const getPaymentMethodLabel = (method: string | null) => {
    if (!method) return '-';
    const labels: Record<string, { en: string; ar: string }> = {
      instapay: { en: 'InstaPay', ar: 'إنستاباي' },
      vodafone: { en: 'Vodafone Cash', ar: 'فودافون كاش' },
    };
    return labels[method] ? (language === 'ar' ? labels[method].ar : labels[method].en) : method;
  };

  if (isLoading) {
    return (
      <Card className="glass border-border">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3" />
            <div className="h-20 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="glass border-border">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <History className="w-5 h-5" />
            {isRTL ? 'سجل الطلبات والمدفوعات' : 'Order & Payment History'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {isRTL ? 'لا توجد طلبات سابقة' : 'No order history'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={isRTL ? 'text-right' : ''}>
                      {isRTL ? 'رقم الطلب' : 'Order ID'}
                    </TableHead>
                    <TableHead className={isRTL ? 'text-right' : ''}>
                      {isRTL ? 'المشروع' : 'Project'}
                    </TableHead>
                    <TableHead className={isRTL ? 'text-right' : ''}>
                      {isRTL ? 'المبلغ' : 'Amount'}
                    </TableHead>
                    <TableHead className={isRTL ? 'text-right' : ''}>
                      {isRTL ? 'طريقة الدفع' : 'Payment Method'}
                    </TableHead>
                    <TableHead className={isRTL ? 'text-right' : ''}>
                      {isRTL ? 'التاريخ' : 'Date'}
                    </TableHead>
                    <TableHead className={isRTL ? 'text-right' : ''}>
                      {isRTL ? 'الحالة' : 'Status'}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">
                        {order.order_id}
                      </TableCell>
                      <TableCell>{order.business_name}</TableCell>
                      <TableCell>
                        <div className={isRTL ? 'text-right' : ''}>
                          <p className="font-medium">
                            {(order.setup_fee + order.monthly_fee + order.addon_total).toLocaleString()} EGP
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {isRTL ? 'رسوم الإعداد + شهري' : 'Setup + Monthly'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPaymentMethodLabel(order.payment_method)}
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.created_at), 'PP', { locale: dateLocale })}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.subscription_status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderHistory;
