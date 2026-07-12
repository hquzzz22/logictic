'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-muted/10 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-3">Đặt hàng thành công!</h1>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Cảm ơn bạn đã liên hệ Superman Transport. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
        </p>

        {orderId && (
          <div className="bg-muted/50 rounded-xl p-4 mb-8">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-1">
              <Package className="h-4 w-4" />
              <span>Mã đơn hàng của bạn</span>
            </div>
            <div className="font-mono font-bold text-foreground text-lg">
              #{orderId.slice(-8).toUpperCase()}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/san-pham"
            className="w-full flex items-center justify-center py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Tiếp tục mua sắm
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            href="/"
            className="w-full flex items-center justify-center py-3 border border-border text-foreground font-medium rounded-xl hover:bg-muted transition-colors"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
