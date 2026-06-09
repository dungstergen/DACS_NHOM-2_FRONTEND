import { useNavigate } from "react-router";
import { Tabs, Form, Input, Button, message, Divider, ConfigProvider } from "antd";
import { Mail, Lock, User, Phone, Home } from "lucide-react";
import { useLogin, useRegister } from "../../../hook/useAuth";
import { motion } from "motion/react";

export function AuthPage() {
  const navigate = useNavigate();
  const { mutate: login, isPending: isLoginPending } = useLogin();
  const { mutate: register, isPending: isRegisterPending } = useRegister();
  const [loginFormInstance] = Form.useForm();
  const [registerFormInstance] = Form.useForm();

  const onFinishLogin = (values: any) => {
    login(
      { email: values.email, password: values.password },
      {
        onSuccess: (response) => {
          message.success(`Chào mừng ${response.data.full_name} đã quay trở lại!`);
          if (response.data.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        },
        onError: (error: any) => {
          const errMsg = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
          message.error(errMsg);
        },
      }
    );
  };

  const onFinishRegister = (values: any) => {
    register(
      { 
        full_name: values.fullname, 
        email: values.email, 
        password: values.password,
        password_confirmation: values.password
      },
      {
        onSuccess: (response) => {
          message.success(`Đăng ký thành công! Chào mừng ${response.data.full_name}`);
          navigate("/");
        },
        onError: (error: any) => {
          const errMsg = error.response?.data?.message || "Đăng ký thất bại. Email có thể đã tồn tại.";
          message.error(errMsg);
        },
      }
    );
  };

  const loginForm = (
    <Form
      form={loginFormInstance}
      layout="vertical"
      onFinish={onFinishLogin}
      requiredMark={false}
      className="mt-6"
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Mừng bạn quay lại!</h2>
        <p className="text-slate-500 mt-2 text-sm">Vui lòng đăng nhập để tiếp tục</p>
      </div>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Email không hợp lệ!' }
        ]}
      >
        <Input
          prefix={<Mail className="w-4 h-4 text-slate-400 mr-2" />}
          placeholder="Email của bạn"
          className="h-12 bg-slate-50/50"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
      >
        <Input.Password
          prefix={<Lock className="w-4 h-4 text-slate-400 mr-2" />}
          placeholder="Mật khẩu"
          className="h-12 bg-slate-50/50"
        />
      </Form.Item>

      <div className="flex justify-end mb-6 -mt-2">
        <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">Quên mật khẩu?</a>
      </div>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoginPending}
          block
          className="h-12 font-medium text-base shadow-lg shadow-indigo-500/30 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 border-0"
        >
          Đăng nhập
        </Button>
      </Form.Item>

      <Divider className="my-6 text-slate-400 text-xs font-normal">HOẶC ĐĂNG NHẬP VỚI</Divider>

      <div className="grid grid-cols-2 gap-4">
        <Button className="h-11 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
          Google
        </Button>
        <Button className="h-11 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center">
          <svg className="w-4 h-4 mr-2 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
          Facebook
        </Button>
      </div>
    </Form>
  );

  const registerForm = (
    <Form
      form={registerFormInstance}
      layout="vertical"
      onFinish={onFinishRegister}
      requiredMark={false}
      className="mt-6"
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Tạo tài khoản mới</h2>
        <p className="text-slate-500 mt-2 text-sm">Nhanh chóng và hoàn toàn miễn phí</p>
      </div>

      <Form.Item name="fullname">
        <Input prefix={<User className="w-4 h-4 text-slate-400 mr-2" />} placeholder="Họ và tên" className="h-12 bg-slate-50/50" />
      </Form.Item>

      <Form.Item name="phone">
        <Input prefix={<Phone className="w-4 h-4 text-slate-400 mr-2" />} placeholder="Số điện thoại" className="h-12 bg-slate-50/50" />
      </Form.Item>

      <Form.Item name="email">
        <Input prefix={<Mail className="w-4 h-4 text-slate-400 mr-2" />} placeholder="Email" className="h-12 bg-slate-50/50" />
      </Form.Item>

      <Form.Item name="password">
        <Input.Password prefix={<Lock className="w-4 h-4 text-slate-400 mr-2" />} placeholder="Mật khẩu" className="h-12 bg-slate-50/50" />
      </Form.Item>

      <Form.Item className="mt-8">
        <Button
          type="primary"
          htmlType="submit"
          loading={isRegisterPending}
          block
          className="h-12 font-medium text-base shadow-lg shadow-indigo-500/30 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 border-0"
        >
          Đăng ký ngay
        </Button>
      </Form.Item>
    </Form>
  );

  const tabItems = [
    { key: 'signin', label: 'Đăng nhập', children: loginForm },
    { key: 'signup', label: 'Đăng ký', children: registerForm },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4f46e5', // indigo-600
          borderRadius: 12,
          controlHeight: 48,
          fontFamily: 'inherit',
        },
        components: {
          Tabs: {
            itemColor: '#64748b', // slate-500
            itemHoverColor: '#4f46e5', // indigo-600
            itemSelectedColor: '#4f46e5', // indigo-600
            inkBarColor: '#4f46e5', // indigo-600
            titleFontSize: 16,
          }
        }
      }}
    >
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 font-sans overflow-hidden bg-slate-50">

        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-300/40 mix-blend-multiply blur-[100px] animate-pulse" />
          <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-pink-300/40 mix-blend-multiply blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-300/40 mix-blend-multiply blur-[100px] animate-pulse" style={{ animationDelay: '4s' }} />

          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        {/* Back to Home Logo */}
        <div
          className="absolute top-8 left-8 z-20 cursor-pointer hover:scale-105 transition-transform flex items-center gap-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white shadow-sm"
          onClick={() => navigate("/")}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md">
            <Home className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-800">Rental</span>
        </div>

        {/* Centered Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 sm:p-10">
            <Tabs
              defaultActiveKey="signin"
              centered
              items={tabItems}
              className="w-full"
              tabBarStyle={{ marginBottom: 16 }}
            />
          </div>

          <p className="text-center text-sm text-slate-500 mt-8">
            {/* © 2026 Rental Space. Đã đăng ký bản quyền. */}
          </p>
        </motion.div>

      </div>
    </ConfigProvider>
  );
}
