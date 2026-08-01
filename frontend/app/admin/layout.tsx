import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/Header';
import { Toaster } from "sonner";
import DynamicFavicon from '@/components/DynamicFavicon';
import "../globals.css";

export const metadata = {
  title: 'Admin Dashboard | Superman Transport',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-muted/30 font-sans" suppressHydrationWarning>
        <DynamicFavicon />
        <AdminGuard>
          <div className="min-h-screen">
            <AdminSidebar />
            <div className="pl-64 flex flex-col min-h-screen">
              <AdminHeader />
              <main className="flex-1 p-6">
                {children}
              </main>
            </div>
          </div>
        </AdminGuard>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
