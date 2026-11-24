'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Shield,
  User,
  KeyRound,
  X,
  Eye,
  EyeOff,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useUserStore } from '@/store/userStore';

interface UserData {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

interface UserFormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isAdmin: boolean;
}

const emptyForm: UserFormState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  isAdmin: false,
};

export default function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');

  // Add / Edit modal state
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<UserData | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  // Quick Change Password modal state
  const [passwordTarget, setPasswordTarget] = useState<UserData | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showQuickPassword, setShowQuickPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const currentUser = useUserStore((state) => state.userInfo);
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter === 'admin' && !u.isAdmin) return false;
      if (roleFilter === 'user' && u.isAdmin) return false;
      if (!q) return true;
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });
  }, [users, search, roleFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowPassword(false);
    setShowModal(true);
  };

  const openEdit = (user: UserData) => {
    setEditing(user);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      confirmPassword: '',
      isAdmin: user.isAdmin,
    });
    setShowPassword(false);
    setShowModal(true);
  };

  const openChangePassword = (user: UserData) => {
    setPasswordTarget(user);
    setNewPassword('');
    setConfirmNewPassword('');
    setShowQuickPassword(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editing && form.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (form.password && form.password.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        const payload: Record<string, unknown> = {
          name: form.name.trim(),
          email: form.email.trim(),
          isAdmin: form.isAdmin,
        };
        if (form.password) {
          payload.password = form.password;
        }
        const { data } = await api.put(`/users/${editing._id}`, payload);
        setUsers((prev) => prev.map((u) => (u._id === editing._id ? data : u)));
        if (currentUser && currentUser._id === editing._id) {
          setUserInfo({
            ...currentUser,
            name: data.name,
            email: data.email,
            isAdmin: data.isAdmin,
          });
        }
        toast.success('Đã cập nhật thông tin người dùng');
      } else {
        const { data } = await api.post('/users/admin', {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          isAdmin: form.isAdmin,
        });
        setUsers((prev) => [data, ...prev]);
        toast.success('Đã thêm người dùng mới');
      }
      setShowModal(false);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordTarget) return;

    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setSavingPassword(true);
    try {
      await api.put(`/users/${passwordTarget._id}`, { password: newPassword });
      toast.success(`Đã đổi mật khẩu cho "${passwordTarget.email}"`);
      setPasswordTarget(null);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Không thể đổi mật khẩu');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDelete = async (user: UserData) => {
    const roleLabel = user.isAdmin ? 'tài khoản Admin' : 'người dùng';
    if (!confirm(`Bạn có chắc muốn xóa ${roleLabel} "${user.name}" (${user.email})?`)) return;
    try {
      await api.delete(`/users/${user._id}`);
      toast.success('Đã xóa người dùng');
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Không thể xóa người dùng');
    }
  };

  const isEditingSelf = Boolean(editing && currentUser && editing._id === currentUser._id);

  return (
    <div className="space-y-6">
      {/* Header & Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Người dùng ({filteredUsers.length})</h1>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm người dùng
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc email..."
            className="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as 'all' | 'admin' | 'user')}
          className="px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">Tất cả vai trò</option>
          <option value="admin">Admin</option>
          <option value="user">Khách hàng</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Người dùng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Vai trò</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Ngày tạo</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isSelf = Boolean(currentUser && currentUser._id === user._id);
                    return (
                      <tr key={user._id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              {user.isAdmin ? (
                                <Shield className="h-4 w-4 text-primary" />
                              ) : (
                                <User className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">{user.name}</span>
                              {isSelf && (
                                <span className="inline-flex px-2 py-0.5 text-[11px] font-medium rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                                  Bạn
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${user.isAdmin
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-600'
                              }`}
                          >
                            {user.isAdmin ? 'Admin' : 'Khách hàng'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                          <button
                            onClick={() => openChangePassword(user)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 rounded-md hover:bg-amber-100 transition-colors"
                            title="Đổi mật khẩu"
                          >
                            <KeyRound className="h-3.5 w-3.5 mr-1" />
                            Đổi MK
                          </button>
                          <button
                            onClick={() => openEdit(user)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                            title="Chỉnh sửa thông tin"
                          >
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            disabled={isSelf}
                            title={isSelf ? 'Không thể tự xóa tài khoản đang đăng nhập' : 'Xóa người dùng'}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Xóa
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-foreground">
                {editing ? 'Sửa thông tin người dùng' : 'Thêm người dùng mới'}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Nhập họ và tên"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="example@domain.com"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Vai trò</label>
                <select
                  value={form.isAdmin ? 'admin' : 'user'}
                  disabled={isEditingSelf}
                  onChange={(e) => setForm((f) => ({ ...f, isAdmin: e.target.value === 'admin' }))}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-muted/50 disabled:text-muted-foreground"
                >
                  <option value="user">Khách hàng</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </select>
                {isEditingSelf && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Không thể tự gỡ quyền Admin của tài khoản đang đăng nhập.
                  </p>
                )}
              </div>

              <div className="pt-2 border-t space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {editing ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu *'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required={!editing}
                      minLength={6}
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      placeholder={editing ? 'Nhập mật khẩu mới (>= 6 ký tự)' : 'Tối thiểu 6 ký tự'}
                      className="w-full pl-3 pr-10 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {(!editing || form.password.length > 0) && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu *</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={form.confirmPassword}
                      onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                      placeholder="Nhập lại mật khẩu"
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
                >
                  {saving ? 'Đang lưu...' : editing ? 'Lưu thay đổi' : 'Thêm người dùng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Change Password Modal */}
      {passwordTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-foreground">Đổi mật khẩu</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tài khoản: <span className="font-medium text-foreground">{passwordTarget.email}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPasswordTarget(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mật khẩu mới *</label>
                <div className="relative">
                  <input
                    type={showQuickPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    className="w-full pl-3 pr-10 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowQuickPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showQuickPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu mới *</label>
                <input
                  type={showQuickPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setPasswordTarget(null)}
                  className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
                >
                  {savingPassword ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
