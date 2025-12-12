// src/components/admin/UserManagement.tsx

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Search, Plus, Trash2, Edit, Loader2, Eye, Calendar, MapPin, User as UserIcon, Mail, Phone } from 'lucide-react';
import { User } from '../../types';
import { userService } from '../../services/userService';

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false); 
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Student' as 'Admin' | 'Instructor' | 'Student',
    password: '',
    phone: '',
    address: '',
    dob: '',
    id: ''
  });

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
      toast.error('Không thể kết nối đến server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.id?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.phone?.includes(searchQuery))
  );

  const getRoleBadge = (role: string) => {
    const roleLower = role?.toLowerCase() || '';
    const variants: { [key: string]: { variant: any; label: string } } = {
      admin: { variant: 'destructive', label: 'Quản trị viên' },
      instructor: { variant: 'default', label: 'Giảng viên' },
      teacher: { variant: 'default', label: 'Giảng viên' },
      student: { variant: 'secondary', label: 'Sinh viên' }
    };
    return variants[roleLower] || variants.student;
  };

  const formatDateDisplay = (dateString?: string) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      email: '', 
      role: 'Student', 
      password: '', 
      phone: '', 
      address: '', 
      dob: '',
      id: ''
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const openViewDialog = (user: User) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
      phone: user.phone || '',
      address: user.address || '',
      dob: formatDateForInput(user.dob),
      id: user.studentId || user.teacherId || ''
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleCreateUser = async () => {
    if (!formData.name || !formData.email) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        dob: formData.dob || undefined,
        studentId: formData.role === 'Student' ? formData.id : undefined,
      };

      await userService.createUser(payload);

      toast.success('Tạo người dùng thành công!');
      setCreateDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      toast.error('Lỗi khi tạo: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        dob: formData.dob,
        role: formData.role
      };

      await userService.updateUser(selectedUser.id, payload);

      toast.success('Cập nhật thông tin thành công!');
      setEditDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      toast.error('Lỗi khi cập nhật: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await userService.deleteUser(selectedUser.id);

      toast.success('Xóa người dùng thành công!');
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      setUsers(users.filter(u => u.id !== selectedUser.id));
    } catch (error: any) {
      toast.error('Lỗi khi xóa: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="uppercase text-primary text-3xl font-bold">Quản lý người dùng</h1>
          <p className="text-muted-foreground mt-1 italic">Quản lý tất cả tài khoản trong hệ thống</p>
        </div>

        {/* Create User Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" onClick={openCreateDialog}>
              <Plus className="w-5 h-5 mr-2" />
              <div className="font-bold ">Tạo người dùng mới</div>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-bold text-primary text-2xl">Tạo người dùng mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin để tạo tài khoản mới vào cơ sở dữ liệu
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2 col-span-2">
                <Label>Họ và tên *</Label>
                <Input
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  placeholder="example@hcmut.edu.vn"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* ID riêng cho Student/Instructor */}
              {(formData.role === 'Student' || formData.role === 'Instructor') && (
                <div className="space-y-2">
                  <Label>{formData.role === 'Student' ? 'Mã sinh viên' : 'Mã giảng viên'}</Label>
                  <Input
                    placeholder={formData.role === 'Student' ? 'SV2024...' : 'GV...'}
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Số điện thoại</Label>
                <Input
                  placeholder="0901234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                 <Label>Ngày sinh</Label>
                 <Input 
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                 />
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Địa chỉ</Label>
                <Input
                  placeholder="Số nhà, đường, quận/huyện..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Hủy
              </Button>
              <Button className="bg-primary" onClick={handleCreateUser}>
                Tạo tài khoản
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary" />
        <Input
          placeholder="Tìm kiếm người dùng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-primary font-bold">Chỉnh sửa thông tin</DialogTitle>
            <DialogDescription>
              <span className="block text-muted-foreground mt-1 italic">
                Cập nhật thông tin tài khoản ID: {selectedUser?.id}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2 col-span-2">
              <Label className="font-semibold">Họ và tên</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Số điện thoại</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
               <Label className="font-semibold">Ngày sinh</Label>
               <Input 
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
               />
            </div>

            <div className="space-y-2 col-span-2">
               <Label className="font-semibold">Địa chỉ</Label>
               <Input 
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
               />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button className="bg-primary" onClick={handleEditUser}>
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Detail Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-primary font-bold text-xl flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Chi tiết người dùng
            </DialogTitle>
            <DialogDescription>
              Thông tin đầy đủ của tài khoản {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="grid gap-6 py-4">
              {/* Avatar & Basic Info */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-3xl">
                  {selectedUser.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary">{selectedUser.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={getRoleBadge(selectedUser.role).variant as any}>
                      {getRoleBadge(selectedUser.role).label}
                    </Badge>
                    <Badge variant="outline">{selectedUser.id}</Badge>
                  </div>
                </div>
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email
                  </Label>
                  <div className="font-medium text-sm">{selectedUser.email}</div>
                </div>

                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Số điện thoại
                  </Label>
                  <div className="font-medium text-sm">{selectedUser.phone || '---'}</div>
                </div>

                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Ngày sinh
                  </Label>
                  <div className="font-medium text-sm">{formatDateDisplay(selectedUser.dob)}</div>
                </div>

                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase flex items-center gap-1">
                    <UserIcon className="w-3 h-3" /> Tuổi
                  </Label>
                  <div className="font-medium text-sm">{selectedUser.age || '---'}</div>
                </div>

                <div className="space-y-1 col-span-2">
                  <Label className="text-muted-foreground text-xs uppercase flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Địa chỉ
                  </Label>
                  <div className="font-medium text-sm border p-2 rounded-md bg-muted/20">
                    {selectedUser.address || 'Chưa cập nhật địa chỉ'}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng "{selectedUser?.name}" khỏi cơ sở dữ liệu?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">
              Xóa vĩnh viễn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Users Table */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-primary font-bold text-lg">Danh sách người dùng (Số lượng: {filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-primary">
                <TableHead className="text-white font-bold ">Tên</TableHead>
                <TableHead className="text-white font-bold">Email</TableHead>
                <TableHead className="text-white font-bold">Vai trò</TableHead>
                <TableHead className="text-white font-bold">Mã người dùng</TableHead>
                <TableHead className="text-right text-white font-bold">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Chưa có người dùng nào hoặc không tìm thấy kết quả.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map(user => {
                  const roleInfo = getRoleBadge(user.role);
                  return (
                    <TableRow 
                      key={user.id} 
                      className="even:bg-blue-50 hover:bg-blue-100 transition-colors duration-200 cursor-pointer"
                      onClick={() => openViewDialog(user)}
                    >
                      <TableCell className="text-destructive font-bold">{user.name}</TableCell>
                      <TableCell className="font-semibold italic">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={roleInfo.variant as any}>{roleInfo.label}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{user.id || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={(e) => {
                              e.stopPropagation();
                              openViewDialog(user);
                            }}
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog(user);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteDialog(user);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}