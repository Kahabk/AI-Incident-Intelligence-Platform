
export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

export interface UploadedFile {
  name: string;
  size: number;
  uploadDate: Date;
}

export interface HealthStatus {
  online: boolean;
  checkedAt: Date;
}

export interface AskResponse {
  answer?: string;
  error?: string;
}
