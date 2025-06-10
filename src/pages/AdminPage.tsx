
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminDocuments from '@/components/admin/AdminDocuments';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminService } from '@/services/adminService';

const AdminPage = () => {
  const { user, refreshUserData } = useFirebaseAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [webhooks, setWebhooks] = useState({
    resumeWebhook: '',
    paymentWebhook: '',
    linkedinWebhook: ''
  });
  const [saving, setSaving] = useState(false);
  // Call refreshUserData on page load to ensure the latest user data is loaded
  
  useEffect(() => {
    // If user is not logged in or not admin, redirect
    if (user && !user.isAdmin) {
      toast.error("You don't have permission to access the admin panel");
      navigate('/');
    } else if (user && user.isAdmin) {
      // Call refreshUserData when admin page is displayed
      refreshUserData();
    }
  }, [user, navigate, refreshUserData]);


  // Handle webhook updates
  const handleUpdateWebhook = async (type: string) => {
    setSaving(true);
    try {
      const webhookUrl = webhooks[type as keyof typeof webhooks];
      const result = await adminService.updateWebhook(type, webhookUrl);
      
      if (result.success) {
        toast.success(`${type} webhook updated successfully`);
      } else {
        toast.error(`Failed to update ${type} webhook`);
      }
    } catch (error) {
      console.error(`Error updating ${type} webhook:`, error);
      toast.error(`An error occurred while updating the ${type} webhook`);
    } finally {
      setSaving(false);
    }
  };

  // If user isn't loaded yet or is logged out
  if (!user) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>
          
          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>
          
          <TabsContent value="documents">
            <AdminDocuments />
          </TabsContent>
          
          <TabsContent value="webhooks">
            <Card>
              <CardHeader>
                <CardTitle>Make.com Webhook Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="resumeWebhook">Resume Generated Webhook URL</Label>
                  <Input
                    id="resumeWebhook"
                    type="text"
                    placeholder="Paste your Make.com webhook URL for resume notifications"
                    value={webhooks.resumeWebhook}
                    onChange={(e) => setWebhooks({...webhooks, resumeWebhook: e.target.value})}
                  />
                  <div className="flex justify-end">
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateWebhook('resumeWebhook')}
                      disabled={saving}
                    >
                      Save
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This webhook is triggered when a user generates a new resume
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentWebhook">Payment Confirmation Webhook URL</Label>
                  <Input
                    id="paymentWebhook"
                    type="text"
                    placeholder="Paste your Make.com webhook URL for payment confirmations"
                    value={webhooks.paymentWebhook}
                    onChange={(e) => setWebhooks({...webhooks, paymentWebhook: e.target.value})}
                  />
                  <div className="flex justify-end">
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateWebhook('paymentWebhook')}
                      disabled={saving}
                    >
                      Save
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This webhook is triggered when a payment is successfully processed
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linkedinWebhook">LinkedIn Optimization Webhook URL</Label>
                  <Input
                    id="linkedinWebhook"
                    type="text"
                    placeholder="Paste your Make.com webhook URL for LinkedIn optimization"
                    value={webhooks.linkedinWebhook}
                    onChange={(e) => setWebhooks({...webhooks, linkedinWebhook: e.target.value})}
                  />
                  <div className="flex justify-end">
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateWebhook('linkedinWebhook')}
                      disabled={saving}
                    >
                      Save
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This webhook sends resume data and receives LinkedIn optimization tips
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
