import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Quizzes | Agentic Learning",
  description:
    "Интерактивные викторины и объяснения на русском и украинском языках о том, что такое искусственный интеллект."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
