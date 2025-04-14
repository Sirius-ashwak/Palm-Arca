import 'express-session';

declare module 'express-session' {
  interface SessionData {
    walletAddress?: string;
    authenticated?: boolean;
  }
}