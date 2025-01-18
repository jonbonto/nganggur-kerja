import { Session } from "next-auth";

export type AppSession = Session & { user: { role: string, id: number } };

export interface Application {
    id: number;
    user: {
      name: string;
    };
    coverLetter: string;
    resumeUrl: string;
    status: string;
  }

  export interface HistoryRecord {
    id: string;
    filename: string;
    status: string;
    total: number;
    success: number;
    errors: number;
    errorFile?: string;
    createdAt: string;
  }
  