
import React, { useRef } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Library, Database } from 'lucide-react';
import { UploadedFile, HealthStatus } from '../types';

interface SidebarProps {
  files: UploadedFile[];
  onFileUpload: (file: File) => void;
  isUploading: boolean;
  health: HealthStatus;
}

export const Sidebar: React.FC<SidebarProps> = ({ files, onFileUpload, isUploading, health }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <aside className="w-80 flex-shrink-0 bg-slate-900/50 border-r border-slate-800 flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Database className="w-6 h-6 text-blue-500" />
          <h2 className="text-lg font-semibold tracking-tight">Knowledge Base</h2>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all
            ${isUploading 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 active:scale-[0.98]'}`}
        >
          {isUploading ? (
            <div className="animate-spin h-5 w-5 border-2 border-slate-500 border-t-white rounded-full" />
          ) : (
            <Upload className="w-5 h-5" />
          )}
          {isUploading ? 'Uploading...' : 'Upload PDF'}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf"
          className="hidden"
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-2 space-y-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Files</p>
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-600 text-center">
            <Library className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-sm">No documents yet</p>
          </div>
        ) : (
          files.map((file, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition-colors group"
            >
              <FileText className="w-5 h-5 text-blue-400 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate text-slate-200">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 border-t border-slate-800 bg-slate-900/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${health.online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-sm font-medium text-slate-400">
              System: {health.online ? 'Online' : 'Offline'}
            </span>
          </div>
          {health.online ? (
            <CheckCircle className="w-4 h-4 text-emerald-500 opacity-50" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-500 opacity-50" />
          )}
        </div>
        <p className="text-[10px] text-slate-600 mt-2">
          Last checked: {health.checkedAt.toLocaleTimeString()}
        </p>
      </div>
    </aside>
  );
};
