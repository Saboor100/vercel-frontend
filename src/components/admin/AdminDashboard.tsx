
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, FileCheck } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResumes: 0,
    totalCoverLetters: 0,
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const statsData = await adminService.getStats();
        console.log('Fetched admin stats:', statsData);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
        toast.error('Failed to load admin statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <p>Loading statistics...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-gray-500 mt-1">Registered accounts</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Resumes</CardTitle>
                <FileText className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalResumes}</div>
                <p className="text-xs text-gray-500 mt-1">Created resumes</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Cover Letters</CardTitle>
                <FileCheck className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCoverLetters}</div>
                <p className="text-xs text-gray-500 mt-1">Created cover letters</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentUsers && stats.recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentUsers.map((user: any, index: number) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{user.email}</p>
                        <p className="text-sm text-gray-500">
                          Subscription: {user.subscription || 'free'}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recent user registrations found.</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
