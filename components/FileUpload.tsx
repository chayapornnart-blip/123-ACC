import React, { useRef } from 'react';
import { Upload, FileType } from 'lucide-react';

interface Props {
  label: string;
  onUpload: (content: string) => void;
  fileName?: string;
  color: 'blue' | 'indigo';
}

export const FileUpload: React.FC<Props> = ({ label, onUpload, fileName, color }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          onUpload(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const colorClasses = color === 'blue' 
    ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100' 
    : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100';

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${colorClasses} ${fileName ? 'border-solid' : ''}`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange} 
          accept=".csv"
          className="hidden" 
        />
        
        {fileName ? (
          <div className="flex items-center space-x-2">
            <FileType className="w-6 h-6" />
            <span className="font-semibold truncate max-w-[200px]">{fileName}</span>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-sm font-medium">Click to upload CSV</span>
          </>
        )}
      </div>
    </div>
  );
};