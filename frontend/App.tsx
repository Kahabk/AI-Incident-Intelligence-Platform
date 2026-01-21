
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { Message, UploadedFile, HealthStatus } from './types';
import { apiService } from './services/api';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [health, setHealth] = useState<HealthStatus>({ online: false, checkedAt: new Date() });
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    const isOnline = await apiService.checkHealth();
    setHealth({ online: isOnline, checkedAt: new Date() });
  }, []);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [checkStatus]);

  const handleFileUpload = async (file: File) => {
    setError(null);
    setIsUploading(true);
    const success = await apiService.uploadPdf(file);
    
    if (success) {
      setFiles(prev => [
        { name: file.name, size: file.size, uploadDate: new Date() },
        ...prev
      ]);
      // Small feedback message
      const feedback: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Successfully uploaded and indexed "${file.name}". You can now ask questions about its content.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, feedback]);
    } else {
      setError(`Failed to upload ${file.name}. Please check the server status.`);
    }
    setIsUploading(false);
  };

  const handleSendMessage = async (content: string) => {
    setError(null);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsAsking(true);

    try {
      const answer = await apiService.askQuestion(content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError("I'm having trouble connecting to the intelligence engine. Please try again later.");
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar 
        files={files} 
        onFileUpload={handleFileUpload} 
        isUploading={isUploading} 
        health={health}
      />
      <ChatWindow 
        messages={messages} 
        onSendMessage={handleSendMessage} 
        isAsking={isAsking} 
        error={error}
      />
    </div>
  );
};

export default App;
