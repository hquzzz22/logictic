'use client';

import { useState, useEffect } from 'react';
import { X, Package, MapPin, Clock, CheckCircle2, Truck, Ship, Plane } from 'lucide-react';
import api from '@/lib/api';

interface TrackingResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackingNumber: string;
}

export default function TrackingResultModal({ isOpen, onClose, trackingNumber }: TrackingResultModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shipment, setShipment] = useState<any>(null);

  useEffect(() => {
    if (isOpen && trackingNumber) {
      setLoading(true);
      setError(null);
      api.get(`/shipments/track/${trackingNumber}`)
        .then(({ data }) => {
          setShipment(data);
        })
        .catch((err) => {
          setError(err.response?.data?.message || 'Không tìm thấy vận đơn hoặc có lỗi xảy ra.');
          setShipment(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, trackingNumber]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#e62c26] p-6 sm:p-8 flex items-start justify-between text-white shrink-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">TRA CỨU VẬN ĐƠN</h2>
            <p className="text-[#ffc9c6] font-medium">Tracking Number: <span className="text-white font-bold tracking-widest">{trackingNumber.toUpperCase()}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#ffc9c6] border-t-[#e62c26] rounded-full animate-spin mb-4" />
              <p className="text-stone-500 font-medium">Đang tìm kiếm thông tin vận đơn...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-stone-900 mb-2">Rất tiếc!</h3>
              <p className="text-stone-500">{error}</p>
              <p className="text-sm text-stone-400 mt-4">Vui lòng kiểm tra lại mã vận đơn và thử lại.</p>
            </div>
          ) : shipment ? (
            <div className="space-y-8">
              {/* Route Summary */}
              <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100 flex flex-col sm:flex-row items-center gap-6 justify-between">
                <div className="text-center sm:text-left">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Origin</p>
                  <p className="text-lg font-black text-stone-900">{shipment.origin}</p>
                </div>
                
                <div className="flex-1 flex items-center w-full px-4">
                  <div className="h-0.5 w-full bg-[#ffc9c6] relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fff0ef] text-[#e62c26] p-2 rounded-full ring-4 ring-white">
                      <Plane className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Destination</p>
                  <p className="text-lg font-black text-stone-900">{shipment.destination}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <h3 className="font-bold text-stone-900 uppercase tracking-wider">Tình Trạng Hiện Tại</h3>
                <span className="px-4 py-1.5 bg-[#ffe4e2] text-brand-700 font-bold rounded-full text-sm">
                  {shipment.status}
                </span>
              </div>

              {/* Timeline */}
              <div className="relative border-l-2 border-[#ffe4e2] ml-4 space-y-8 mt-6">
                {[...shipment.timeline].reverse().map((event: any, index: number) => (
                  <div key={index} className="relative pl-8 group">
                    <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-white border-4 border-[#ff3f39] group-hover:scale-125 transition-transform" />
                    <div className="bg-white group-hover:bg-stone-50 transition-colors p-4 rounded-2xl border border-stone-100 shadow-sm">
                      <h4 className="font-bold text-stone-900 mb-2">{event.description}</h4>
                      <div className="flex flex-wrap gap-4 text-sm text-stone-500">
                        {event.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-[#ff3f39]" />
                            {event.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-[#ff3f39]" />
                          {new Date(event.timestamp).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
