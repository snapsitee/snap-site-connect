import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrderCard from '@/components/dashboard/OrderCard';
import ProfileSection from '@/components/dashboard/ProfileSection';
import OrderHistory from '@/components/dashboard/OrderHistory';
import { LogOut, Package, LayoutDashboard, User, History } from 'lucide-react';
import { motion } from 'framer-motion';
import type { User as SupabaseUser } from '@supabase/supabase-js';

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

const Dashboard = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('websites');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      fetchOrders(session.user.id);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
        fetchOrders(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchOrders = async (userId: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('id, order_id, business_name, subscription_status, project_status, website_status, start_date, renewal_date, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data as Order[]);
    }
    setIsLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'font-cairo' : 'font-sans'}`}>
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                {isRTL ? 'لوحة التحكم' : 'Dashboard'}
              </h1>
              <p className="text-muted-foreground">
                {isRTL ? 'إدارة مواقعك واشتراكاتك' : 'Manage your websites and subscriptions'}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <LogOut className="w-4 h-4" />
              {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
            </Button>
          </motion.div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className={`grid w-full grid-cols-3 ${isRTL ? 'direction-rtl' : ''}`}>
              <TabsTrigger value="websites" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">{isRTL ? 'مواقعي' : 'My Websites'}</span>
              </TabsTrigger>
              <TabsTrigger value="history" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">{isRTL ? 'السجل' : 'History'}</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{isRTL ? 'حسابي' : 'Profile'}</span>
              </TabsTrigger>
            </TabsList>

            {/* Websites Tab */}
            <TabsContent value="websites">
              {isLoading ? (
                <div className="grid gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                      <div className="h-6 bg-muted rounded w-1/3 mb-4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-3xl p-12 text-center"
                >
                  <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-xl font-bold mb-2">
                    {isRTL ? 'لا توجد مواقع بعد' : 'No websites yet'}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {isRTL 
                      ? 'اشترك الآن للحصول على موقعك الاحترافي'
                      : 'Subscribe now to get your professional website'
                    }
                  </p>
                  <Button 
                    onClick={() => navigate('/subscribe')}
                    className="gradient-bg hover:opacity-90"
                  >
                    {isRTL ? 'اشترك الآن' : 'Subscribe Now'}
                  </Button>
                </motion.div>
              ) : (
                <div className="grid gap-4">
                  {orders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <OrderCard order={order} />
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              {user && <OrderHistory userId={user.id} />}
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              {user && <ProfileSection userId={user.id} userEmail={user.email || ''} />}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
