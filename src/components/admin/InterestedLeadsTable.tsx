import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Download, Search, Phone, Trash2, CheckCircle, Archive } from 'lucide-react';
import { downloadCSV } from '@/lib/csv-export';

interface InterestedLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  business_type: string;
  status: string;
  created_at: string;
}

const InterestedLeadsTable = () => {
  const { t, isRTL, language } = useLanguage();
  const { toast } = useToast();
  const [leads, setLeads] = useState<InterestedLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('interested_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch interested leads',
        variant: 'destructive',
      });
    } else {
      setLeads(data || []);
    }
    setIsLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('interested_leads')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    } else {
      setLeads(leads.map(lead => 
        lead.id === id ? { ...lead, status } : lead
      ));
      toast({
        title: 'Success',
        description: 'Status updated successfully',
      });
    }
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase
      .from('interested_leads')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete lead',
        variant: 'destructive',
      });
    } else {
      setLeads(leads.filter(lead => lead.id !== id));
      toast({
        title: 'Success',
        description: 'Lead deleted successfully',
      });
    }
  };

  const exportToCSV = () => {
    const exportData = leads.map(lead => ({
      [t('admin.name')]: lead.name,
      [t('admin.email')]: lead.email,
      [t('admin.phone')]: lead.phone,
      [t('admin.whatsapp')]: lead.whatsapp,
      [t('admin.businessType')]: lead.business_type,
      [t('admin.status')]: lead.status,
      [t('admin.date')]: new Date(lead.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US'),
    }));

    downloadCSV(exportData, `interested_leads_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phone.includes(searchQuery) ||
    lead.business_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      new: 'default',
      contacted: 'secondary',
      archived: 'outline',
    };
    const labels: Record<string, string> = {
      new: t('admin.new'),
      contacted: t('admin.contacted'),
      archived: t('admin.archived'),
    };
    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'ar' ? 'ar-EG' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric' }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`flex flex-col sm:flex-row gap-4 justify-between ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <h1 className={`text-2xl font-bold ${isRTL ? 'font-cairo' : 'font-sans'}`}>
          {t('admin.interestedLeads')}
        </h1>
        <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="relative">
            <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-64 bg-muted border-border ${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
            />
          </div>
          <Button onClick={exportToCSV} className="gradient-bg hover:opacity-90">
            <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('admin.exportExcel')}
          </Button>
        </div>
      </div>

      <div className="glass rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={isRTL ? 'text-right' : ''}>{t('admin.name')}</TableHead>
              <TableHead className={isRTL ? 'text-right' : ''}>{t('admin.email')}</TableHead>
              <TableHead className={isRTL ? 'text-right' : ''}>{t('admin.phone')}</TableHead>
              <TableHead className={isRTL ? 'text-right' : ''}>{t('admin.whatsapp')}</TableHead>
              <TableHead className={isRTL ? 'text-right' : ''}>{t('admin.businessType')}</TableHead>
              <TableHead className={isRTL ? 'text-right' : ''}>{t('admin.status')}</TableHead>
              <TableHead className={isRTL ? 'text-right' : ''}>{t('admin.date')}</TableHead>
              <TableHead className={isRTL ? 'text-right' : ''}>{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No interested leads found
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>
                    <a
                      href={`https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-green-500 hover:underline"
                    >
                      <Phone className="h-3 w-3" />
                      {lead.whatsapp}
                    </a>
                  </TableCell>
                  <TableCell>{lead.business_type}</TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell>{formatDate(lead.created_at)}</TableCell>
                  <TableCell>
                    <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {lead.status !== 'contacted' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateStatus(lead.id, 'contacted')}
                          title={t('admin.markContacted')}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      {lead.status !== 'archived' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateStatus(lead.id, 'archived')}
                          title={t('admin.archive')}
                        >
                          <Archive className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteLead(lead.id)}
                        title={t('admin.delete')}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InterestedLeadsTable;
