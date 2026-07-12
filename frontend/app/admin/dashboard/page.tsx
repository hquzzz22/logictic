'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, FileText, Mail, TrendingUp, Anchor } from 'lucide-react';
import api from '@/lib/api';

interface DashboardStats {
  totalPosts: number;
  totalUsers: number;
  totalContacts: number;
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalUsers: 0,
    totalContacts: 0,
  });
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, usersRes, contactsRes] = await Promise.all([
          api.get('/posts').catch(() => ({ data: [] })),
          api.get('/users').catch(() => ({ data: [] })),
          api.get('/contacts').catch(() => ({ data: [] })),
        ]);

        setStats({
          totalPosts: Array.isArray(postsRes.data) ? postsRes.data.length : 0,
          totalUsers: Array.isArray(usersRes.data) ? usersRes.data.length : 0,
          totalContacts: Array.isArray(contactsRes.data) ? contactsRes.data.length : 0,
        });

        // Assuming contacts are ordered by latest or we just sort them here
        const contacts = Array.isArray(contactsRes.data) ? contactsRes.data : [];
        const sortedContacts = contacts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRecentContacts(sortedContacts.slice(0, 5));
      } catch (err) {
        console.error('Lỗi tải dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      name: 'Yêu cầu liên hệ / Báo giá',
      value: stats.totalContacts.toString(),
      icon: Mail,
      color: 'text-[#e62c26]',
      bg: 'bg-[#ffe4e2]',
      href: '/admin/contacts',
    },
    {
      name: 'Bài viết / Tin tức',
      value: stats.totalPosts.toString(),
      icon: FileText,
      color: 'text-green-600',
      bg: 'bg-green-100',
      href: '/admin/posts',
    },
    {
      name: 'Người dùng',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      href: '/admin/users',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#e62c26] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-stone-900 rounded-lg p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Anchor className="w-32 h-32" />
        </div>
        <h1 className="text-2xl font-black mb-2 tracking-wide uppercase">Chào mừng trở lại!</h1>
        <p className="text-stone-300 font-light max-w-2xl">
          Tổng quan tình hình hoạt động của Superman Transport. Quản lý yêu cầu vận chuyển, tin tức và người dùng từ bảng điều khiển này.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {statCards.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="bg-white overflow-hidden shadow-sm rounded-lg border border-stone-200 hover:border-[#ff9b96] hover:shadow-md transition-all group"
            >
              <div className="p-5 flex items-center">
                <div className={`flex-shrink-0 rounded-xl p-3 ${item.bg} group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-7 w-7 ${item.color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-stone-500 truncate uppercase tracking-wider">{item.name}</dt>
                  <dd className="text-2xl font-black text-stone-900 mt-1">{item.value}</dd>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Contacts */}
      <div className="bg-white shadow-sm rounded-lg border border-stone-200">
        <div className="p-6 flex items-center justify-between border-b border-stone-100">
          <h2 className="text-lg font-bold text-stone-900 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-[#e62c26]" />
            Yêu cầu liên hệ mới nhất
          </h2>
          <Link href="/admin/contacts" className="text-sm text-[#e62c26] hover:text-brand-800 font-bold uppercase tracking-wider">
            Xem tất cả
          </Link>
        </div>

        {recentContacts.length === 0 ? (
          <div className="text-center py-16 text-stone-400 font-medium">
            Chưa có yêu cầu liên hệ nào
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-100">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Chủ đề</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Ngày gửi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-stone-100">
                {recentContacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-[#fff0ef]/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-stone-900">{contact.name}</td>
                    <td className="px-6 py-4 text-sm text-stone-600">{contact.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-[#ffe4e2] text-brand-700">
                        {contact.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-500 font-medium">
                      {new Date(contact.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
