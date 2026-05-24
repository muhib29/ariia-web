// components/careers/FileUpload.tsx
'use client';

import { useRef, useState } from 'react';

interface FileUploadProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  error?: string;
}

export function FileUpload({ file, onFileSelect, error }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPdfFile = (candidate: File | null | undefined): candidate is File => {
    if (!candidate) return false;
    return (
      candidate.type === 'application/pdf' ||
      candidate.name.toLowerCase().endsWith('.pdf')
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (isPdfFile(droppedFile)) {
      onFileSelect(droppedFile);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (isPdfFile(selectedFile)) {
      onFileSelect(selectedFile);
    } else {
      alert('Please upload a PDF file');
      onFileSelect(null);
    }

    // Allow selecting the same file again after validation errors.
    e.target.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-900 mb-2">Resume</label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-[1px] rounded-2xl px-6 py-4 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-[#F0F0F0] bg-white hover:border-gray-300'
          }
          ${error ? 'border-red-300' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-[linear-gradient(90deg,_rgba(103,121,255,0.5)_0%,_rgba(78,151,250,0.5)_25%,_rgba(53,181,245,0.5)_50%,_rgba(46,255,234,0.5)_100%)]">
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.5516 11.125C25.0516 11.5125 26.8891 13.825 26.8891 18.8875V19.05C26.8891 24.6375 24.6516 26.875 19.0641 26.875H10.9266C5.33906 26.875 3.10156 24.6375 3.10156 19.05V18.8875C3.10156 13.8625 4.91406 11.55 9.33906 11.1375"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 18.7499V4.5249"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.1875 7.3125L15 3.125L10.8125 7.3125"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <p className="text-[#333A48] mb-2 flex justify-center">
          <span className="font-medium text-lg max-w-[280px] line-clamp-2">
            Drag & drop your file here, or upload it manually
          </span>
        </p>

        <button
          type="button"
          className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:cursor-pointer hover:shadow-lg"
        >
          Upload File
        </button>
      </div>

      {file && (
        <div className="mt-4 flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl">
          <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">PDF</span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            aria-label="Remove file"
          >
            <svg
              className="w-4 h-4 text-gray-400 hover:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
