'use client';

import { HistoryRecord } from '@/types';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const BetaBulkJobUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 5;

  const fetchHistory = async (page: number) => {
    const res = await fetch(`/api/jobs/bulk/history?page=${page}&limit=${rowsPerPage}`);
    const data = await res.json();
    setHistory(data.history || []);
    setTotalPages(data.totalPages || 1);
  };

  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage]);

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/jobs/bulk', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success(data.message);
      fetchHistory(currentPage);
      setFile(null);
    } catch (error) {
      toast.error((error as Error).message || 'Error uploading file');
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8">Bulk Job Uploads</h1>

      {/* Upload Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
          <CardDescription>Upload a CSV file containing multiple job postings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <Input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="flex-1"
            />
            <Button onClick={handleUpload} disabled={!file}>
              Upload
            </Button>
          </div>
          {file && (
            <p className="mt-2 text-sm text-muted-foreground">
              Selected file: {file.name}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Upload History */}
      <Card>
        <CardHeader>
          <CardTitle>Upload History</CardTitle>
          <CardDescription>View your previous bulk upload records</CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No upload history available</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Filename</th>
                      <th className="pb-3 font-medium">Jobs</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record) => (
                      <tr key={record.id} className="border-b">
                        <td className="py-3">{new Date(record.uploadedAt).toLocaleDateString()}</td>
                        <td className="py-3">{record.fileName}</td>
                        <td className="py-3">{record.recordsProcessed}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            record.status === 'success' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BetaBulkJobUpload;
