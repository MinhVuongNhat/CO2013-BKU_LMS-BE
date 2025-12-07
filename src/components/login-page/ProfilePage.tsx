import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { User } from '../../types'; // Sử dụng User từ types chung
import { Camera, Save, Loader2, Calendar, MapPin, User as UserIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { userService } from '../../services/userService';
import { toast } from 'sonner';

interface ProfilePageProps {
  user: User;
}

export function ProfilePage({ user }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Khởi tạo form với dữ liệu từ user prop
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    dob: user.dob || '',
    age: user.age || 0,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  };

  const getRoleLabel = (role: string) => {
    const labels: { [key: string]: string } = {
      admin: 'Quản trị viên',
      teacher: 'Giảng viên',
      student: 'Sinh viên'
    };
    return labels[role] || role;
  };

  // Helper: Chuyển đổi ISO date string sang YYYY-MM-DD cho input date
  const formatDateForInput = (isoDateString: string) => {
    if (!isoDateString) return '';
    const date = new Date(isoDateString);
    return date.toISOString().split('T')[0];
  };

  // Helper: Hiển thị ngày tháng đẹp (DD/MM/YYYY)
  const formatDateDisplay = (isoDateString: string) => {
    if (!isoDateString) return 'Chưa cập nhật';
    return new Date(isoDateString).toLocaleDateString('vi-VN');
  };

  // Xử lý lưu thông tin cá nhân
  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email, // Thường email ít khi cho sửa, tùy logic backend
        phone: formData.phone,
        address: formData.address,
        dob: formData.dob, // Gửi lên định dạng YYYY-MM-DD hoặc ISO tùy backend
        // age thường được tính toán tự động từ dob ở backend, nhưng nếu cần gửi thì gửi
      };

      await userService.updateUser(user.id, payload);
      
      toast.success('Cập nhật hồ sơ thành công!');
      setIsEditing(false);
      
      // Lưu ý: Trong thực tế, bạn nên gọi một hàm refreshUser() từ Context 
      // để cập nhật lại data toàn cục. Ở đây ta tạm thời giữ UI theo state local.
    } catch (error: any) {
      toast.error('Lỗi cập nhật: ' + (error.message || 'Vui lòng thử lại sau'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    // Gọi API đổi mật khẩu (cần implement thêm trong userService nếu có)
    toast.info('Chức năng đổi mật khẩu đang phát triển');
    
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary text-3xl font-bold uppercase">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground">Quản lý thông tin cá nhân và cài đặt tài khoản</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <Card className="border-2 h-fit">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarFallback className="bg-primary text-white text-3xl font-bold">
                    {getInitials(formData.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="mt-4 font-semibold text-primary text-xl text-center">{formData.name}</h2>
              <p className="text-muted-foreground font-medium">{getRoleLabel(user.role)}</p>
              
              <div className="mt-4 w-full space-y-2">
                {user.studentId && (
                  <div className="bg-muted/50 p-2 rounded text-center text-sm">
                    <span className="font-semibold text-primary">MSSV:</span> {user.studentId}
                  </div>
                )}
                {user.teacherId && (
                  <div className="bg-muted/50 p-2 rounded text-center text-sm">
                    <span className="font-semibold text-primary">MSGV:</span> {user.teacherId}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Info */}
        <Card className="md:col-span-2 border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-primary text-xl font-bold uppercase">Thông tin chi tiết</CardTitle>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="bg-primary text-white font-semibold border-primary hover:bg-primary/90 hover:text-white">
                  Chỉnh sửa
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={() => setIsEditing(false)} variant="outline" className="font-semibold border-destructive text-destructive hover:bg-destructive/10">
                    Hủy
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={isLoading} className="bg-primary text-white font-semibold border-2 border-primary">
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Lưu
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="info">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info" className="text-primary font-semibold">Thông tin cơ bản</TabsTrigger>
                <TabsTrigger value="security" className="text-primary font-semibold">Bảo mật</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Họ và tên */}
                  <div className="space-y-2">
                    <Label className="font-semibold text-primary">Họ và tên</Label>
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-white"
                      />
                    ) : (
                      <div className="p-2 bg-muted/30 rounded border border-transparent font-medium">{formData.name}</div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="font-semibold text-primary">Email</Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-white"
                        disabled // Thường email là định danh, không cho sửa tùy tiện
                      />
                    ) : (
                      <div className="p-2 bg-muted/30 rounded border border-transparent font-medium">{formData.email}</div>
                    )}
                  </div>

                  {/* Số điện thoại */}
                  <div className="space-y-2">
                    <Label className="font-semibold text-primary">Số điện thoại</Label>
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-white"
                        placeholder="09xx..."
                      />
                    ) : (
                      <div className="p-2 bg-muted/30 rounded border border-transparent font-medium">{formData.phone || 'Chưa cập nhật'}</div>
                    )}
                  </div>

                  {/* Ngày sinh */}
                  <div className="space-y-2">
                    <Label className="font-semibold text-primary flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Ngày sinh
                    </Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={formatDateForInput(formData.dob)}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="bg-white"
                      />
                    ) : (
                      <div className="p-2 bg-muted/30 rounded border border-transparent font-medium">
                        {formatDateDisplay(formData.dob)}
                      </div>
                    )}
                  </div>

                  {/* Tuổi (Thường là Read-only hoặc tự tính) */}
                  <div className="space-y-2">
                    <Label className="font-semibold text-primary flex items-center gap-2">
                        <UserIcon className="w-4 h-4" /> Tuổi
                    </Label>
                    <div className="p-2 bg-muted/30 rounded border border-transparent font-medium text-gray-500">
                        {/* Hiển thị tuổi từ DB hoặc tính từ DOB */}
                        {formData.age || (formData.dob ? new Date().getFullYear() - new Date(formData.dob).getFullYear() : '---')}
                    </div>
                  </div>

                  {/* Địa chỉ */}
                  <div className="space-y-2 md:col-span-2">
                    <Label className="font-semibold text-primary flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Địa chỉ
                    </Label>
                    {isEditing ? (
                      <Input
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="bg-white"
                        placeholder="Số nhà, Đường, Quận/Huyện..."
                      />
                    ) : (
                      <div className="p-2 bg-muted/30 rounded border border-transparent font-medium">
                        {formData.address || 'Chưa cập nhật'}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-4 mt-4">
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label className="font-semibold">Mật khẩu hiện tại</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">Mật khẩu mới</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">Xác nhận mật khẩu mới</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </div>

                  <Button onClick={handleChangePassword} className="bg-primary font-bold">
                    ĐỔI MẬT KHẨU
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      {user.role === 'student' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary font-bold">Thống kê học tập</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-destructive text-3xl font-bold">3</div>
                <div className="text-primary font-bold">Lớp học</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-destructive text-3xl font-bold">12</div>
                <div className="text-primary font-bold">Bài tập đã nộp</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-destructive text-3xl font-bold">85%</div>
                <div className="text-primary font-bold">Tỷ lệ hoàn thành</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-destructive text-3xl font-bold">3.45</div>
                <div className="text-primary font-bold">GPA</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {user.role === 'teacher' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary font-bold">Thống kê giảng dạy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-destructive text-3xl font-bold">3</div>
                <div className="text-sm text-muted-foreground font-semibold">Lớp học</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-destructive text-3xl font-bold">21</div>
                <div className="text-sm text-muted-foreground font-semibold">Sinh viên</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-destructive text-3xl font-bold">5</div>
                <div className="text-sm text-muted-foreground font-semibold">Bài tập đã giao</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-destructive text-3xl font-bold">4</div>
                <div className="text-sm text-muted-foreground font-semibold">Tài liệu đã upload</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}