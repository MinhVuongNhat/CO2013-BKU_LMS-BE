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
import { Search, Plus, Lock, Trash2, Edit, Loader2, Eye, Calendar, MapPin, User as UserIcon, Mail, Phone } from 'lucide-react';

// Import Types và Service
import { User } from '../../types';
import { userService } from '../../services/userService';

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // State quản lý dữ liệu và loading
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State cho các Dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false); // State cho dialog xem chi tiết

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Student' as 'Admin' | 'Instructor' | 'Student',
    password: '',
    phone: '',
    studentId: '',
    teacherId: ''
  });

  // 1. Hàm gọi API lấy danh sách User
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

  // Gọi API lần đầu khi vào trang
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter ở Client
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.studentId?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.teacherId?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getRoleBadge = (role: string) => {
    const variants: { [key: string]: { variant: any; label: string } } = {
      admin: { variant: 'destructive', label: 'Quản trị viên' },
      teacher: { variant: 'default', label: 'Giảng viên' },
      student: { variant: 'secondary', label: 'Sinh viên' }
    };
    return variants[role] || variants.student;
  };

  // Helper format ngày tháng
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  // Helper reset form
  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'student', password: '', phone: '', studentId: '', teacherId: '' });
  };

  // --- HANDLERS MỞ DIALOG ---

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
      studentId: user.studentId || '',
      teacherId: user.teacherId || ''
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  // --- HANDLERS GỌI API ---

  // 2. Tạo User mới
  const handleCreateUser = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone || undefined,
        studentId: formData.role === 'student' ? formData.studentId : undefined,
        teacherId: formData.role === 'teacher' ? formData.teacherId : undefined
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

  // 3. Cập nhật User
  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
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

  // 4. Xóa User
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

  // Render Loading
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
              <div className="font-bold">Tạo người dùng mới</div>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo người dùng mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin để tạo tài khoản mới vào cơ sở dữ liệu
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
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
                  placeholder="example@bkedu.vn"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Vai trò *</Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Sinh viên</SelectItem>
                    <SelectItem value="Instructor">Giảng viên</SelectItem>
                    <SelectItem value="Admin">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.role === 'Instructor' && (
                <div className="space-y-2">
                  <Label>Mã sinh viên</Label>
                  <Input
                    placeholder="SV2024001"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  />
                </div>
              )}
              {formData.role === 'Instructor' && (
                <div className="space-y-2">
                  <Label>Mã giảng viên</Label>
                  <Input
                    placeholder="GV001"
                    value={formData.teacherId}
                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
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
                <Label>Mật khẩu *</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary font-bold">Chỉnh sửa thông tin</DialogTitle>
            <DialogDescription>
              <div className="text-muted-foreground mt-1 italic">Cập nhật thông tin tài khoản ID: {selectedUser?.id}</div>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
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

      {/* View User Detail Dialog (Mới thêm) */}
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
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                  {selectedUser.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary">{selectedUser.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={selectedUser.role === 'admin' ? 'destructive' : 'default'}>
                      {selectedUser.role === 'admin' ? 'Quản trị viên' : selectedUser.role === 'teacher' ? 'Giảng viên' : 'Sinh viên'}
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
                  <div className="font-medium text-sm">{formatDate(selectedUser.dob)}</div>
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
                <TableHead className="text-white font-bold">Mã SV/GV</TableHead>
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
                      onClick={() => openViewDialog(user)} // Click hàng để xem chi tiết
                    >
                      <TableCell className="text-destructive font-bold">{user.name}</TableCell>
                      <TableCell className="font-semibold italic">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={roleInfo.variant as any}>{roleInfo.label}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{user.studentId || user.teacherId || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={(e) => {
                              e.stopPropagation(); // Ngăn click row
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
                              e.stopPropagation(); // Ngăn click row
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