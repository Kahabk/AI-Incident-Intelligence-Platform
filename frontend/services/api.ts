
import { AskResponse } from '../types';

const BASE_URL = 'https://62998d5a4fa3.ngrok-free.app';

export const apiService = {
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Health check failed', error);
      return false;
    }
  },

  async uploadPdf(file: File): Promise<boolean> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'ngrok-skip-browser-warning': 'true',
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Upload failed', error);
      return false;
    }
  },

  async askQuestion(question: string): Promise<string> {
    try {
      const response = await fetch(`${BASE_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      // Adjust according to actual backend response format
      // If backend returns { answer: "..." }
      return data.answer || data.response || "No response content received.";
    } catch (error) {
      console.error('Ask failed', error);
      throw error;
    }
  },
};
