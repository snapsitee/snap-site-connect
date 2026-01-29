import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Search, Download, MessageCircle, Eye, AlertTriangle, RefreshCw } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { downloadCSV } from '@/lib/csv-export';

interface Order {
  id: string;
  order_id: string;
  full_name: string;
  business_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  subscription_status: string;
  project_status: string;
  website_status: string;
  start_date: string | null;
  renewal_date: string | null;
  receipt_url: string | null;
  created_at: string;
  payment_method: string | null;
  setup_fee: number;
  monthly_fee: number;
  custom_domain_addon: boolean;
  business_email_addon: boolean;
  addon_total: number;
}

const SubscribersTable = () => {
  const { isRTL, language } = useLanguage();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [websiteFilter, setWebsiteFilter] = useState<string>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const dateLocale = language === 'ar' ? ar : enUS;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data as Order[]);
    }
    setIsLoading(false);
  };

  const updateOrderStatus = async (orderId: string, field: string, value: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ [field]: value })
      .eq('id', orderId);

    if (error) {
      toast({
        variant: 'destructive',
        title: isRTL ? 'خطأ' : 'Error',
        description: error.message,
      });
    } else {
      toast({
        title: isRTL ? 'تم التحديث' : 'Updated',
      });
      fetchOrders();
    }
  };

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
      case 'fake_order':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, { en: string; ar: string }> = {
      pending: { en: 'Pending', ar: 'قيد الانتظار' },
      active: { en: 'Active', ar: 'نشط' },
      suspended: { en: 'Suspended', ar: 'معلق' },
      expired: { en: 'Expired', ar: 'منتهي' },
      renewed: { en: 'Renewed', ar: 'مجدد' },
      didnt_renew: { en: "Didn't Renew", ar: 'لم يجدد' },
      fake_order: { en: 'Fake Order', ar: 'طلب وهمي' },
      received: { en: 'Received', ar: 'مستلم' },
      in_progress: { en: 'In Progress', ar: 'قيد التنفيذ' },
      delivered: { en: 'Delivered', ar: 'تم التسليم' },
      live: { en: 'Live', ar: 'مباشر' },
      disabled: { en: 'Disabled', ar: 'معطل' },
      maintenance: { en: 'Maintenance', ar: 'صيانة' },
      paused: { en: 'Paused', ar: 'متوقف' },
    };
    return labels[status] ? (language === 'ar' ? labels[status].ar : labels[status].en) : status;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.business_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubscription = subscriptionFilter === 'all' || order.subscription_status === subscriptionFilter;
    const matchesProject = projectFilter === 'all' || order.project_status === projectFilter;
    const matchesWebsite = websiteFilter === 'all' || order.website_status === websiteFilter;
    return matchesSearch && matchesSubscription && matchesProject && matchesWebsite;
  });

  const handleExport = () => {
    const exportData = filteredOrders.map(order => ({
      'Order ID': order.order_id,
      'Full Name': order.full_name,
      'Business Name': order.business_name,
      'Email': order.email,
      'Phone': order.phone,
      'WhatsApp': order.whatsapp,
      'Subscription Status': order.subscription_status,
      'Project Status': order.project_status,
      'Website Status': order.website_status,
      'Start Date': order.start_date ? format(new Date(order.start_date), 'PP') : '',
      'Renewal Date': order.renewal_date ? format(new Date(order.renewal_date), 'PP') : '',
      'Payment Method': order.payment_method || '',
      'Setup Fee': order.setup_fee,
      'Monthly Fee': order.monthly_fee,
      'Add-ons Total': order.addon_total,
    }));
    downloadCSV(exportData, 'subscribers');
  };

  const isRenewalSoon = (renewalDate: string | null): boolean => {
    if (!renewalDate) return false;
    const days = differenceInDays(new Date(renewalDate), new Date());
    return days <= 7 && days >= 0;
  };

  const isExpired = (renewalDate: string | null): boolean => {
    if (!renewalDate) return false;
    return differenceInDays(new Date(renewalDate), new Date()) < 0;
  };

  return (
    <div className="space-y-6">
      <div className={`flex items-center justify-between flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div>
          <h2 className={`text-2xl font-bold ${isRTL ? 'text-right' : ''}`}>
            {isRTL ? 'المشتركين' : 'Subscribers'}
          </h2>
          <p className={`text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
            {isRTL ? 'إدارة جميع الاشتراكات' : 'Manage all subscriptions'}
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Download className="w-4 h-4" />
          {isRTL ? 'تصدير Excel' : 'Export Excel'}
        </Button>
      </div>

      {/* Filters */}
      <div className={`flex flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="relative flex-1 min-w-[200px]">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
          <Input
            placeholder={isRTL ? 'بحث بالاسم أو رقم الطلب...' : 'Search by name or order ID...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={isRTL ? 'pr-10 text-right' : 'pl-10'}
          />
        </div>
        
        <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={isRTL ? 'حالة الاشتراك' : 'Subscription'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL ? 'الكل' : 'All'}</SelectItem>
            <SelectItem value="pending">{getStatusLabel('pending')}</SelectItem>
            <SelectItem value="active">{getStatusLabel('active')}</SelectItem>
            <SelectItem value="renewed">{getStatusLabel('renewed')}</SelectItem>
            <SelectItem value="expired">{getStatusLabel('expired')}</SelectItem>
            <SelectItem value="didnt_renew">{getStatusLabel('didnt_renew')}</SelectItem>
            <SelectItem value="suspended">{getStatusLabel('suspended')}</SelectItem>
            <SelectItem value="fake_order">{getStatusLabel('fake_order')}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={isRTL ? 'حالة المشروع' : 'Project'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL ? 'الكل' : 'All'}</SelectItem>
            <SelectItem value="received">{getStatusLabel('received')}</SelectItem>
            <SelectItem value="in_progress">{getStatusLabel('in_progress')}</SelectItem>
            <SelectItem value="delivered">{getStatusLabel('delivered')}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={websiteFilter} onValueChange={setWebsiteFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={isRTL ? 'حالة الموقع' : 'Website'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL ? 'الكل' : 'All'}</SelectItem>
            <SelectItem value="live">{getStatusLabel('live')}</SelectItem>
            <SelectItem value="disabled">{getStatusLabel('disabled')}</SelectItem>
            <SelectItem value="maintenance">{getStatusLabel('maintenance')}</SelectItem>
            <SelectItem value="paused">{getStatusLabel('paused')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={isRTL ? 'text-right' : ''}>{isRTL ? 'رقم الطلب' : 'Order ID'}</TableHead>
              <TableHead className={isRTL ? 'text-right' : ''}>{isRTL ? 'العميل' : 'Client'}</TableHead>
              <TableHead className={isRTL ? 'text-right' : ''}>{isRTL ? 'النشاط' : 'Business'}</TableHead>
              <TableHead className={isRTL ? 'text-right' : ''}>{isRTL ? 'تاريخ الطلب' : 'Order Date'}</TableHead>
              <TableHead className={isRTL ? 'text-right' : ''}>{isRTL ? 'الاشتراك' : 'Subscription'}</TableHead>
              <TableHead className={isRTL ? 'text-right' : ''}>{isRTL ? 'المشروع' : 'Project'}</TableHead>
              <TableHead className={isRTL ? 'text-right' : ''}>{isRTL ? 'الموقع' : 'Website'}</TableHead>
              <TableHead className={isRTL ? 'text-right' : ''}>{isRTL ? 'تاريخ البدء' : 'Start Date'}</TableHead>
              <TableHead className={isRTL ? 'text-right' : ''}>{isRTL ? 'التجديد' : 'Renewal'}</TableHead>
              <TableHead className={isRTL ? 'text-right' : ''}>{isRTL ? 'إجراءات' : 'Actions'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  <div className="animate-pulse">{isRTL ? 'جاري التحميل...' : 'Loading...'}</div>
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  {isRTL ? 'لا توجد نتائج' : 'No results found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow 
                  key={order.id}
                  className={`${isRenewalSoon(order.renewal_date) ? 'bg-yellow-500/10' : ''} ${isExpired(order.renewal_date) ? 'bg-destructive/10' : ''}`}
                >
                  <TableCell className="font-mono text-sm">{order.order_id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.full_name}</p>
                      <p className="text-sm text-muted-foreground">{order.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>{order.business_name}</TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(order.created_at), 'PP', { locale: dateLocale })}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.subscription_status}
                      onValueChange={(value) => updateOrderStatus(order.id, 'subscription_status', value)}
                    >
                      <SelectTrigger className="w-[130px] h-8">
                        <Badge variant={getStatusVariant(order.subscription_status)} className="text-xs">
                          {getStatusLabel(order.subscription_status)}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">{getStatusLabel('pending')}</SelectItem>
                        <SelectItem value="active">{getStatusLabel('active')}</SelectItem>
                        <SelectItem value="renewed">{getStatusLabel('renewed')}</SelectItem>
                        <SelectItem value="expired">{getStatusLabel('expired')}</SelectItem>
                        <SelectItem value="didnt_renew">{getStatusLabel('didnt_renew')}</SelectItem>
                        <SelectItem value="suspended">{getStatusLabel('suspended')}</SelectItem>
                        <SelectItem value="fake_order">{getStatusLabel('fake_order')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.project_status}
                      onValueChange={(value) => updateOrderStatus(order.id, 'project_status', value)}
                    >
                      <SelectTrigger className="w-[130px] h-8">
                        <Badge variant={getStatusVariant(order.project_status)} className="text-xs">
                          {getStatusLabel(order.project_status)}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="received">{getStatusLabel('received')}</SelectItem>
                        <SelectItem value="in_progress">{getStatusLabel('in_progress')}</SelectItem>
                        <SelectItem value="delivered">{getStatusLabel('delivered')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.website_status}
                      onValueChange={(value) => updateOrderStatus(order.id, 'website_status', value)}
                    >
                      <SelectTrigger className="w-[130px] h-8">
                        <Badge variant={getStatusVariant(order.website_status)} className="text-xs">
                          {getStatusLabel(order.website_status)}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="live">{getStatusLabel('live')}</SelectItem>
                        <SelectItem value="disabled">{getStatusLabel('disabled')}</SelectItem>
                        <SelectItem value="maintenance">{getStatusLabel('maintenance')}</SelectItem>
                        <SelectItem value="paused">{getStatusLabel('paused')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm">
                    {order.start_date ? format(new Date(order.start_date), 'PP', { locale: dateLocale }) : '-'}
                  </TableCell>
                  <TableCell>
                    {order.renewal_date ? (
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {isRenewalSoon(order.renewal_date) && <RefreshCw className="w-4 h-4 text-yellow-500" />}
                        {isExpired(order.renewal_date) && <AlertTriangle className="w-4 h-4 text-destructive" />}
                        <span className="text-sm">
                          {format(new Date(order.renewal_date), 'PP', { locale: dateLocale })}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {order.receipt_url && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedReceipt(order.receipt_url)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(`https://wa.me/${order.whatsapp.replace(/\D/g, '')}`, '_blank')}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Receipt Preview Modal */}
      <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isRTL ? 'إيصال الدفع' : 'Payment Receipt'}</DialogTitle>
          </DialogHeader>
          {selectedReceipt && (
            <img src={selectedReceipt} alt="Receipt" className="w-full rounded-lg" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscribersTable;
