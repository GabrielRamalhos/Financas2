import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';

interface ImportExportProps {
  onExport: () => void;
  onImport: (file: File) => void;
}

export function ImportExport({ onExport, onImport }: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={onExport}
        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        <Download className="w-5 h-5 mr-2" />
        Export Transactions
      </button>
      
      <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
        <Upload className="w-5 h-5 mr-2" />
        Import Transactions
        <input
          type="file"
          accept=".txt"
          onChange={handleImport}
          ref={fileInputRef}
          className="hidden"
        />
      </label>
    </div>
  );
}