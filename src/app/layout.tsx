import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: {
    default: "Ifuku Store ⚡",
    template: "%s | Ifuku Store ⚡",
  },
  description: "Top up MLBB murah & cepat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <Toaster position="top-right" />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}