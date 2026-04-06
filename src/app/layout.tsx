
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";


export const metadata = {
  title: "TheNestory Real Estate",
  description: "Premium Real Estate Advisory Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
