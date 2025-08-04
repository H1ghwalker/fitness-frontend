import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./styles/globals.css";
import "./styles/animations.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/providers/AuthProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "TrainerHub - Transform Your Training Business",
  description: "The all-in-one platform for personal trainers to manage clients, schedule sessions, and track progress with ease.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}