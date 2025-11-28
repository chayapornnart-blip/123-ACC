import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle, Landmark, BookOpen } from 'lucide-react';

interface Props {
  label: string;
  onUpload: (content: string) => void;
  fileName?: string;
  color: 'blue' | 'indigo';
  icon?: 'bank' | 'book';
}

export const FileUpload: React.FC<Props> = ({ label, onUpload, fileName, color, icon }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const processFile = (file?: File) => {
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const theme = color === 'blue' ? {
    border: 'border-blue-200',
    bg: 'bg-blue-50/50',
    bgHover: 'hover:bg-blue-50',
    text: 'text-blue-700',
    ring: 'focus-within:ring-blue-500',
    iconColor: 'text-blue-500'
  } : {
    border: 'border-indigo-200',
    bg: 'bg-indigo-50/50',
    bgHover: 'hover:bg-indigo-50',
    text: 'text-indigo-700',
    ring: 'focus-within:ring-indigo-500',
    iconColor: 'text-indigo-500'
  };

  const Icon = icon === 'bank' ? Landmark : (icon === 'book' ? BookOpen : Upload);

  return (
    <div className="w-full group">
      <div 
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative overflow-hidden h-32
          border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer 
          transition-all duration-300 ease-in-out
          ${fileName ? 'border-emerald-300 bg-emerald-50/30' : `${theme.border} ${theme.bg} ${theme.bgHover}`}
          ${isDragging ? 'scale-[1.02] border-solid shadow-md' : ''}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange} 
          accept=".csv"
          className="hidden" 
        />
        
        {fileName ? (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
             <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
             </div>
             <p className="text-sm font-semibold text-emerald-800 truncate max-w-[200px]">{fileName}</p>
             <p className="text-[10px] text-emerald-600 uppercase tracking-wider font-bold mt-1">Ready</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center p-4">
            <div className={`p-2 rounded-full bg-white shadow-sm mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`w-5 h-5 ${theme.iconColor}`} />
            </div>
            <span className={`text-sm font-medium ${theme.text} mb-1`}>{label}</span>
            <span className="text-xs text-gray-400">Drag & drop or click</span>
          </div>
        )}
      </div>
    </div>
  );
};