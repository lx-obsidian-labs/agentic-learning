'use client';

import { ThemeProvider } from 'next-themes';
import { TutorProvider } from './TutorContext';
import { NotificationProvider } from './NotificationContext';
import AITutorWidget from './AITutorWidget';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <NotificationProvider>
        <TutorProvider>
          {children}
          <AITutorWidget />
        </TutorProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
