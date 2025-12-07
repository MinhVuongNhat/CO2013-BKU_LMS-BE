import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { User } from '../../types';
import { Camera, Save, Loader2, Calendar, MapPin, User as UserIcon, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { userService } from '../../services/userService';
import { toast } from 'sonner';
import { useAuth } from '../../lib/authContext';

interface ProfilePageProps {
  user: User;
}

export function ProfilePage({ user: initialUser }: ProfilePageProps) {
  const { updateUser } = useAuth(); // Lấy hàm updateUser từ context
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  // State lưu thông tin user hiện tại
  const [currentUser, setCurrentUser] = useState<User>(initialUser);

  // Form data cho editing
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    age: 0,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Hàm fetch thông tin user từ API
  const fetchUserData = async () => {
    // Fix: Dùng userId nếu không có id
    const userIdToFetch = initialUser?.id || (initialUser as any)?.userId;
    
    if (!userIdToFetch) {
      console.error('❌ No valid user ID found:', initialUser);
      toast.error('Không tìm thấy thông tin người dùng');
      setIsFetching(false);
      return;
    }

    setIsFetching(true);
    try {
      const userData = await userService.getUserById(userIdToFetch);
    
      const mergedUser = {
        ...userData,
        role: initialUser.role || userData.role, 
      };
      
      
      setCurrentUser(mergedUser);
      updateUser(mergedUser);
      
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        dob: userData.dob || '',
        age: userData.age || 0,
      });
    } catch (error: any) {
      toast.error('Không thể tải thông tin người dùng');
      
      setCurrentUser(initialUser);
      setFormData({
        name: initialUser.name || '',
        email: initialUser.email || '',
        phone: initialUser.phone || '',
        address: initialUser.address || '',
        dob: initialUser.dob || '',
        age: initialUser.age || 0,
      });
    } finally {
      setIsFetching(false);
    }
  };

  // Fetch data khi component mount hoặc khi user ID thay đổi
  useEffect(() => {
    const userIdToCheck = initialUser?.id || (initialUser as any)?.userId;
    
    if (userIdToCheck) {
      fetchUserData();
    } else {
      // Nếu không có ID, dùng data từ props
      setCurrentUser(initialUser);
      setFormData({
        name: initialUser.name || '',
        email: initialUser.email || '',
        phone: initialUser.phone || '',
        address: initialUser.address || '',
        dob: initialUser.dob || '',
        age: initialUser.age || 0,
      });
      setIsFetching(false);
    }
  }, [initialUser?.id, (initialUser as any)?.userId]);

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  };

  const getRoleLabel = (role: string) => {
    const labels: { [key: string]: string } = {
      Admin: 'Quản trị viên',
      Instructor: 'Giảng viên',
      Student: 'Sinh viên',
      admin: 'Quản trị viên',
      student: 'Sinh viên',
      instructor: 'Giảng viên',
      teacher: 'Giảng viên'
    };
    return labels[role] || role;
  };


  const formatDateForInput = (isoDateString: string) => {
    if (!isoDateString) return '';
    try {
      const date = new Date(isoDateString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  // Helper: Hiển thị ngày tháng đẹp (DD/MM/YYYY)
  const formatDateDisplay = (isoDateString: string) => {
    if (!isoDateString) return 'Chưa cập nhật';
    try {
      return new Date(isoDateString).toLocaleDateString('vi-VN');
    } catch {
      return 'Chưa cập nhật';
    }
  };

  // Xử lý lưu thông tin cá nhân
  const handleSaveProfile = async () => {
    // Fix: Dùng userId nếu không có id
    const userIdToUse = currentUser?.id || (currentUser as any)?.userId;
    console.log('🆔 Using ID:', userIdToUse);
    
    if (!userIdToUse) {
      console.error('currentUser:', JSON.stringify(currentUser, null, 2));
      toast.error('Lỗi: Không tìm thấy ID người dùng');
      return;
    }

    if (!formData.name?.trim()) {
      toast.error('Vui lòng nhập họ tên');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email,
        phone: formData.phone || '',
        address: formData.address || '',
        dob: formData.dob || '',
      };

      await userService.updateUser(userIdToUse, payload);
      
      toast.success('Cập nhật hồ sơ thành công!');
      setIsEditing(false);
      
      await fetchUserData();
      
    } catch (error: any) {
      toast.error('Lỗi cập nhật: ' + (error.message || 'Vui lòng thử lại sau'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    // TODO: Gọi API đổi mật khẩu
    toast.info('Chức năng đổi mật khẩu đang phát triển');
    
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleCancelEdit = () => {
    // Reset form data về giá trị hiện tại
    setFormData({
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      address: currentUser.address || '',
      dob: currentUser.dob || '',
      age: currentUser.age || 0,
    });
    setIsEditing(false);
  };

  // Show loading skeleton khi đang fetch data
  if (isFetching) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-primary text-3xl font-bold uppercase">Hồ sơ cá nhân</h1>
          <p className="text-muted-foreground">Đang tải thông tin...</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Kiểm tra nếu không có user data
  if (!currentUser) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-primary text-3xl font-bold uppercase">Hồ sơ cá nhân</h1>
          <p className="text-destructive">Không tìm thấy thông tin người dùng</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary text-3xl font-bold uppercase">Hồ sơ cá nhân</h1>
          <p className="text-muted-foreground">Quản lý thông tin cá nhân và cài đặt tài khoản</p>
        </div>
        <Button
          onClick={fetchUserData}
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={isFetching || (!currentUser?.id && !(currentUser as any)?.userId)}
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <Card className="border-2 h-fit">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarFallback className="bg-primary text-white text-3xl font-bold">
                    {getInitials(currentUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="mt-4 font-semibold text-primary text-xl text-center">{currentUser.name}</h2>
              <p className="text-muted-foreground font-medium">{getRoleLabel(currentUser.role)}</p>
              
              <div className="mt-4 w-full space-y-2">
                {currentUser.studentId && (
                  <div className="bg-muted/50 p-2 rounded text-center text-sm">
                    <span className="font-semibold text-primary">MSSV:</span> {currentUser.studentId}
                  </div>
                )}
                {currentUser.teacherId && (
                  <div className="bg-muted/50 p-2 rounded text-center text-sm">
                    <span className="font-semibold text-primary">Mã GV:</span> {currentUser.teacherId}
                  </div>
                )}
                {(currentUser.id || (currentUser as any).userId) && (
                  <div className="bg-muted/50 p-2 rounded text-center text-sm">
                    <span className="font-semibold text-primary">ID:</span> {currentUser.id || (currentUser as any).userId}
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
                  <Button onClick={handleCancelEdit} variant="outline" className="font-semibold border-destructive text-destructive hover:bg-destructive/10">
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
                        disabled
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

                  {/* Tuổi */}
                  <div className="space-y-2">
                    <Label className="font-semibold text-primary flex items-center gap-2">
                      <UserIcon className="w-4 h-4" /> Tuổi
                    </Label>
                    <div className="p-2 bg-muted/30 rounded border border-transparent font-medium text-gray-500">
                      {currentUser.age || (formData.dob ? new Date().getFullYear() - new Date(formData.dob).getFullYear() : '---')}
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

      {/* Additional Stats - Chỉ hiển thị cho Sinh viên */}
      {currentUser.role === 'Student' && (
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
    </div>
  );
}