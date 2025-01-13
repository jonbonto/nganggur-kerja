'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const BulkJobUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 2;

  const fetchHistory = async (page: number) => {
    const res = await fetch(`/api/jobs/bulk/history?page=${page}&limit=${rowsPerPage}`);
    const data = await res.json();
    setHistory(data.history);
    setTotalPages(data.totalPages);
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
    } catch (error) {
      toast.error(error.message || 'Error uploading file');
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800">Bulk Job Uploads</h1>

      <div className="flex justify-center items-center">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border border-gray-300 p-3 rounded-md shadow-md hover:shadow-lg transition duration-300"
        />
        <button
          onClick={handleUpload}
          className="ml-4 bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Upload
        </button>
      </div>

      <div className="overflow-x-auto shadow-xl rounded-lg bg-white">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 px-6 pt-6">Upload History</h2>

        <table className="min-w-full text-sm text-left text-gray-700 border-separate border-spacing-0">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="px-6 py-3 border-b font-semibold text-left">Filename</th>
              <th className="px-6 py-3 border-b font-semibold text-left">Status</th>
              <th className="px-6 py-3 border-b font-semibold text-left">Total</th>
              <th className="px-6 py-3 border-b font-semibold text-left">Success</th>
              <th className="px-6 py-3 border-b font-semibold text-left">Errors</th>
              <th className="px-6 py-3 border-b font-semibold text-left">Progress</th>
              <th className="px-6 py-3 border-b font-semibold text-left">Error File</th>
              <th className="px-6 py-3 border-b font-semibold text-left">Uploaded At</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record) => (
              <tr key={record.id} className="border-b hover:bg-gray-50 transition duration-300">
                <td className="px-6 py-4">{record.filename}</td>
                <td className="px-6 py-4">{record.status}</td>
                <td className="px-6 py-4">{record.total}</td>
                <td className="px-6 py-4">{record.success}</td>
                <td className="px-6 py-4">{record.errors}</td>
                <td className="px-6 py-4">
                  {Math.floor(((record.success + record.errors) / record.total) * 100)}%
                </td>
                <td className="px-6 py-4">
                  {record.errorFile && (
                    <a
                      href={record.errorFile}
                      download
                      className="text-blue-600 hover:underline"
                    >
                      Download
                    </a>
                  )}
                </td>
                <td className="px-6 py-4">
                  {new Date(record.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-300 transition duration-300"
        >
          Previous
        </button>
        <span className="text-lg text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-300 transition duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BulkJobUpload;
