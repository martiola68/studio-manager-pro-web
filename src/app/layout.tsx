import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studio Manager Pro | Gestionale integrato per studi professionali",
  description:
    "Organizza clienti, scadenze, pratiche, revisione, controllo di gestione, antiriciclaggio e payroll in un unico ambiente.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
