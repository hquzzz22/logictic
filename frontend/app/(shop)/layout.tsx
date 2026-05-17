import ShopHeader from '@/components/shop/Header';
import ShopFooter from '@/components/shop/Footer';
import FloatingContact from '@/components/shop/FloatingContact';
import ScrollToTop from '@/components/shop/ScrollToTop';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollToTop />
      <ShopHeader />
      <main className="flex-grow">
        {children}
      </main>
      <ShopFooter />
      <FloatingContact />
    </>
  );
}
