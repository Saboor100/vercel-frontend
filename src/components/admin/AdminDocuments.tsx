
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, RefreshCcw, Eye, Trash2 } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';

interface Document {
  id: string;
  userId: string;
  userEmail?: string;
  title: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

const AdminDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const docsData = await adminService.getDocuments();
      console.log('Fetched documents data:', docsData);
      setDocuments(docsData || []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      doc.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && doc.type === activeTab;
  });

  const deleteDocument = async (docId: string, type: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      const result = await adminService.deleteDocument(docId, type);
      if (result.success) {
        toast.success('Document deleted successfully');
        // Update the local state to remove the deleted document
        setDocuments(documents.filter(doc => doc.id !== docId));
      } else {
        toast.error('Failed to delete document');
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
      toast.error('Failed to delete document');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Documents Management</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchDocuments} 
          disabled={loading}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="resume">Resumes</TabsTrigger>
          <TabsTrigger value="coverLetter">Cover Letters</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mb-4 flex">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search by title or user email..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center p-4">Loading documents...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.title || 'Untitled'}</TableCell>
                    <TableCell>
                      {doc.type === 'resume' ? 'Resume' : 'Cover Letter'}
                    </TableCell>
                    <TableCell>{doc.userEmail || doc.userId}</TableCell>
                    <TableCell>
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          onClick={() => deleteDocument(doc.id, doc.type)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No documents found
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

export default AdminDocuments;
