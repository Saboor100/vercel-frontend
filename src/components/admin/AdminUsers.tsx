
import React, { useEffect, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, RefreshCcw, UserCog } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  displayName?: string;
  subscription: string;
  createdAt: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersData = await adminService.getUsers();
      console.log('Fetched users data:', usersData);
      setUsers(usersData || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateUserSubscription = async (userId: string, subscription: string) => {
    try {
      const result = await adminService.updateUser(userId, { subscription });
      if (result.success) {
        toast.success('User subscription updated');
        // Update the local state to reflect the change
        setUsers(users.map(user => 
          user.id === userId ? { ...user, subscription } : user
        ));
      } else {
        toast.error('Failed to update user');
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users Management</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchUsers} 
          disabled={loading}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="mb-4 flex">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search users by email or name..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center p-4">Loading users...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.displayName || '-'}</TableCell>
                    <TableCell>{user.subscription || 'free'}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          const newSubscription = 
                            user.subscription === 'premium' ? 'free' : 'premium';
                          updateUserSubscription(user.id, newSubscription);
                        }}
                      >
                        <UserCog className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
