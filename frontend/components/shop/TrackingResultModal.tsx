'use client';

import { useState, useEffect } from 'react';
import { X, Package, MapPin, Clock, CheckCircle2, Truck, Plane, ClipboardList, Shield, User, Phone, DollarSign, Scale, FileText } from 'lucide-react';
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
      
      <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
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
            <div className="space-y-10">
              
              {/* Route Summary (Minimal) */}
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-between px-4 sm:px-8">
                <div className="text-center sm:text-left">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Origin</p>
                  <p className="text-xl font-black text-stone-900">{shipment.origin}</p>
                </div>
                
                <div className="flex-1 flex items-center w-full px-4">
                  <div className="h-0.5 w-full bg-stone-200 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-stone-400 p-2 rounded-full border-2 border-stone-100">
                      <Plane className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Destination</p>
                  <p className="text-xl font-black text-stone-900">{shipment.destination}</p>
                </div>
              </div>

              {/* Dynamic Stepper */}
              <div className="py-2 px-2">
                <div className="relative flex justify-between items-center w-full">
                  {/* Background Line */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-stone-200 rounded-full" />
                  
                  {/* Progress Line */}
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#e62c26] rounded-full transition-all duration-500"
                    style={{ width: `${(Math.max(0, ['Pending', 'In Transit', 'Customs Clearance', 'Arrived', 'Delivered'].indexOf(shipment.status)) / 4) * 100}%` }}
                  />

                  {/* Steps */}
                  {[
                    { status: 'Pending', label: 'Chờ xử lý', Icon: ClipboardList },
                    { status: 'In Transit', label: 'Vận chuyển', Icon: Truck },
                    { status: 'Customs Clearance', label: 'Hải quan', Icon: Shield },
                    { status: 'Arrived', label: 'Đã đến', Icon: MapPin },
                    { status: 'Delivered', label: 'Đã giao', Icon: CheckCircle2 }
                  ].map((step, index) => {
                    const currentIndex = ['Pending', 'In Transit', 'Customs Clearance', 'Arrived', 'Delivered'].indexOf(shipment.status);
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    const Icon = step.Icon;

                    return (
                      <div key={step.status} className="relative flex flex-col items-center group z-10">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ring-4 ring-white ${
                          isCompleted ? 'bg-[#e62c26] text-white shadow-lg shadow-[#ff3f39]/40' : 'bg-stone-200 text-stone-400'
                        } ${isCurrent ? 'scale-110' : ''}`}>
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="absolute top-14 text-center w-24">
                          <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-stone-900' : 'text-stone-400'}`}>
                            {step.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bill of Lading Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-8">
                {/* Shipper */}
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                  <h4 className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
                    <User className="h-4 w-4" /> Người Gửi
                  </h4>
                  <p className="font-bold text-stone-900 mb-1">{shipment.shipper?.name || shipment.shipper || 'N/A'}</p>
                  {shipment.shipper?.phone && <p className="text-sm text-stone-500 flex items-center gap-2 mt-2"><Phone className="h-3 w-3" /> {shipment.shipper.phone}</p>}
                  {shipment.shipper?.address && <p className="text-sm text-stone-500 flex items-start gap-2 mt-1"><MapPin className="h-3 w-3 mt-0.5 shrink-0" /> {shipment.shipper.address}</p>}
                </div>
                
                {/* Consignee */}
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                  <h4 className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
                    <User className="h-4 w-4" /> Người Nhận
                  </h4>
                  <p className="font-bold text-stone-900 mb-1">{shipment.consignee?.name || shipment.consignee || 'N/A'}</p>
                  {shipment.consignee?.phone && <p className="text-sm text-stone-500 flex items-center gap-2 mt-2"><Phone className="h-3 w-3" /> {shipment.consignee.phone}</p>}
                  {shipment.consignee?.address && <p className="text-sm text-stone-500 flex items-start gap-2 mt-1"><MapPin className="h-3 w-3 mt-0.5 shrink-0" /> {shipment.consignee.address}</p>}
                </div>

                {/* Cargo Details */}
                <div className="bg-[#fff0ef] p-5 rounded-2xl border border-[#ffc9c6] md:col-span-2 lg:col-span-1">
                  <h4 className="flex items-center gap-2 text-xs font-bold text-[#e62c26] uppercase tracking-widest mb-3">
                    <Package className="h-4 w-4" /> Thông tin Hàng hóa
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center border-b border-[#ffc9c6]/50 pb-2">
                      <span className="text-sm text-brand-800 flex items-center gap-2"><FileText className="h-3 w-3"/> Loại hàng:</span>
                      <span className="font-bold text-stone-900">{shipment.goodsDescription || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#ffc9c6]/50 pb-2">
                      <span className="text-sm text-brand-800 flex items-center gap-2"><Package className="h-3 w-3"/> Số kiện:</span>
                      <span className="font-bold text-stone-900">{shipment.packages || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#ffc9c6]/50 pb-2">
                      <span className="text-sm text-brand-800 flex items-center gap-2"><Scale className="h-3 w-3"/> Trọng lượng:</span>
                      <span className="font-bold text-stone-900">{shipment.weight || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-sm text-brand-800 flex items-center gap-2"><DollarSign className="h-3 w-3"/> Cước phí:</span>
                      <span className="font-black text-[#e62c26] text-lg">{shipment.totalAmount || 'Đã thanh toán'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-4 border-b border-stone-100 pb-2">Lịch sử Hành trình</h4>
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
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
