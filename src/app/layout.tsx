
'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { initializeFirebase } from "@/firebase";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [firebaseConfig, setFirebaseConfig] = useState<any>(null);

  useEffect(() => {
    const { app, db, auth } = initializeFirebase();
    setFirebaseConfig({ app, db, auth });
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} font-body antialiased bg-gray-50`}>
        {firebaseConfig ? (
          <FirebaseClientProvider
            firebaseApp={firebaseConfig.app}
            firestore={firebaseConfig.db}
            auth={firebaseConfig.auth}
          >
            {children}
            <Toaster />
          </FirebaseClientProvider>
        ) : (
          <div className="flex min-h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </body>
    </html>
  );
}
