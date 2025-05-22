import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  login,
  register,
  clearMessage,
  sendEmailVerify,
  forgetPassword,
} from "../redux/slices/passportSlice";

const Login = () => {
  // 当前模式：登录 / 注册 / 找回密码
  const [mode, setMode] = useState("login");
  // 找回密码步骤，分为发送验证码(1) 和 重置密码(2)
  const [forgotStep, setForgotStep] = useState(1);

  // 表单状态
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 本地错误提示
  const [localError, setLocalError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 从 Redux 读取 loading 状态和服务端错误信息
  const { loading, error } = useSelector((state) => state.passport);

  const siteName = "Shuttle";

  // 统一管理各异步接口 loading 状态
  const isLoading = {
    login: loading.login,
    register: loading.register,
    sendEmailVerify: loading.sendEmailVerify,
    forgetPassword: loading.forgetPassword,
  };

  // 错误自动清除（5秒后）
  useEffect(() => {
    if (error[mode]) {
      const timer = setTimeout(() => dispatch(clearMessage(mode)), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, mode, dispatch]);

  // 重置找回密码相关表单和状态
  const resetForm = () => {
    setForgotStep(1);
    setCode("");
    setPassword("");
    setConfirmPassword("");
    setLocalError("");
  };

  // 表单提交处理
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!email.includes("@")) {
      setLocalError("请输入有效的邮箱地址");
      return;
    }

    if (mode === "login") {
      if (password.length < 6) {
        setLocalError("密码长度至少6位");
        return;
      }
      const result = await dispatch(login({ email, password }));
      if (result.payload?.token) {
        navigate("/home");
      } else {
        setLocalError(result.payload || "登录失败，请稍后重试");
      }
      return;
    }

    if (mode === "register") {
      if (password.length < 6) {
        setLocalError("密码长度至少6位");
        return;
      }
      if (password !== confirmPassword) {
        setLocalError("两次密码输入不一致");
        return;
      }
      const result = await dispatch(register({ email, password }));
      if (result.payload?.token) {
        setMode("login");
        setEmail(email);
      } else {
        setLocalError(result.payload || "注册失败");
      }
      return;
    }

    if (mode === "forgot") {
      if (forgotStep === 1) {
        // 发送验证码
        const result = await dispatch(sendEmailVerify(email));
        if (result.payload?.status === "success") {
          setForgotStep(2);
        } else {
          setLocalError(result.payload || "发送验证码失败");
        }
        return;
      }

      if (forgotStep === 2) {
        // 验证码 + 新密码重置
        if (!code) {
          setLocalError("请输入验证码");
          return;
        }
        if (password.length < 6) {
          setLocalError("密码长度至少6位");
          return;
        }
        if (password !== confirmPassword) {
          setLocalError("两次密码输入不一致");
          return;
        }

        const result = await dispatch(
          forgetPassword({ email, password, email_code: code }),
        );
        if (result.payload) {
          resetForm();
          setMode("login");
        } else {
          setLocalError(result.payload || "密码重置失败");
        }
      }
    }
  };

  // 切换模式（登录 / 注册 / 找回密码）
  const switchMode = (newMode) => {
    setMode(newMode);
    if (newMode !== "forgot") resetForm();
  };

  // 文案配置
  const TEXT = {
    login: {
      title: "欢迎回来",
      button: "登录",
      footer: ["注册", "忘记密码？"],
    },
    register: {
      title: "创建账户",
      button: "注册",
      footer: ["返回登录"],
    },
    forgot: {
      title: "找回密码",
      button: forgotStep === 1 ? "发送验证码" : "重置密码",
      footer: ["返回登录"],
    },
  };

  return (
    <div className="relative w-full h-full p-8 flex flex-col justify-center rounded-none lg:rounded-xl shadow-xl min-h-[480px]">
      {/* 左上 Logo */}
      <div className="absolute top-6 left-6 text-xl font-bold select-none">
        🚀 {siteName}
      </div>

      {/* 右上 说明 */}
      <div className="absolute top-6 right-6 text-sm text-gray-500 select-none">
        Network Service
      </div>

      {/* 中间主体内容：标题 + 表单 */}
      <div className="w-full max-w-sm mx-auto flex flex-col items-center">
        {/* 标题  */}
        <h2 className="mb-6 text-2xl font-bold text-left w-full">
          {TEXT[mode].title}
        </h2>

        <form className="w-full" onSubmit={handleSubmit}>
          {/* 邮箱输入框 */}
          <div className="form-control mb-4">
            <input
              type="email"
              placeholder="邮箱"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* 验证码输入（找回密码第二步） */}
          {mode === "forgot" && forgotStep === 2 && (
            <div className="form-control mb-4">
              <p className="mb-1 text-sm text-gray-500">验证码已发送到 {email}</p>
              <input
                type="text"
                placeholder="验证码"
                className="input input-bordered w-full"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
          )}

          {/* 密码和确认密码输入 */}
          {(mode === "login" ||
            mode === "register" ||
            (mode === "forgot" && forgotStep === 2)) && (
            <>
              <div className="form-control mb-4">
                <input
                  type="password"
                  placeholder={mode === "forgot" ? "新密码" : "密码"}
                  className="input input-bordered w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {(mode === "register" || (mode === "forgot" && forgotStep === 2)) && (
                <div className="form-control mb-4">
                  <input
                    type="password"
                    placeholder={mode === "forgot" ? "确认新密码" : "确认密码"}
                    className="input input-bordered w-full"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}
            </>
          )}

          {/* 找回密码第一步提示 */}
          {mode === "forgot" && forgotStep === 1 && (
            <p className="mb-4 text-sm text-gray-500 text-center">
              请输入注册邮箱，我们将发送验证码。
            </p>
          )}

          {/* 错误提示 */}
          {(localError || error[mode]) && (
            <div className="mb-4 rounded bg-red-100 px-3 py-2 text-sm text-red-600 text-center">
              {localError || error[mode]}
            </div>
          )}

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={
              mode === "forgot" && forgotStep === 1
                ? isLoading.sendEmailVerify
                : mode === "forgot" && forgotStep === 2
                ? isLoading.forgetPassword
                : isLoading[mode]
            }
            className='btn btn-primary w-full'
          >
            {isLoading[mode] ? "处理中..." : TEXT[mode].button}
          </button>
        </form>

        {/* 底部切换按钮 */}
        <div className="fixed bottom-10 px-20 mt-6 flex justify-between text-sm text-primary w-full">
          {mode === "login" && (
            <>
              <button
                onClick={() => switchMode("register")}
                className="link-hover link"
              >
                注册
              </button>
              <button
                onClick={() => switchMode("forgot")}
                className="link-hover link"
              >
                忘记密码？
              </button>
            </>
          )}
          {(mode === "register" || mode === "forgot") && (
            <button
              onClick={() => switchMode("login")}
              className="ml-auto link-hover link"
            >
              返回登录
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
