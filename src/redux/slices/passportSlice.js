import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import qs from "qs";

const initialState = {
  accountConfig: {},
  token: localStorage.getItem("token") || null,
  isAuthenticated: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
  isAdmin: null,
  authData: null,
  loading: {
    fetchAccountConfig: false,
    login: false,
    sendEmailVerify: false,
    register: false,
    forgetPassword: false,
  },
  error: {
    fetchAccountConfig: null,
    login: null,
    sendEmailVerify: null,
    register: null,
    forgetPassword: null,
  },
};

// 获取账户配置/comm/config
export const fetchAccountConfig = createAsyncThunk(
  "user/fetchAccountConfig",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/user/comm/config");
      return response.data.data; // 返回账户配置数据
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "获取账户配置失败",
      );
    }
  },
);

// checkLogin 异步操作

export const checkLogin = createAsyncThunk(
  "auth/checkLogin",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/user/checkLogin");
      const data = response.data.data;
      if (!data.is_login) {
        dispatch(logout()); // 如果未登录，触发登出
      }
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "验证登录状态失败",
      );
    }
  },
);

// 创建登录的异步操作passport/auth/login
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/api/v1/passport/auth/login",
        qs.stringify({ email, password }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      );
      const { data } = response.data;
      // 返回包含用户信息和token的对象
      return {
        token: data.token,
        authData: data.auth_data,
        isAdmin: data.is_admin,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "登录失败");
    }
  },
);

// 创建发送邮箱验证码的异步操作
export const sendEmailVerify = createAsyncThunk(
  "auth/sendEmailVerify",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/api/v1/passport/comm/sendEmailVerify",
        qs.stringify({ email }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      );
      return response.data; //
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "发送验证码失败");
    }
  },
);

// 创建注册的异步操作
export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/api/v1/passport/auth/register",
        qs.stringify({ email, password }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      );
      const { data } = response.data;

      // 返回包含 token 和 authData 等信息
      return {
        token: data.token,
        authData: data.auth_data,
        isAdmin: data.is_admin,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "注册失败");
    }
  },
);

// 创建忘记密码的异步操作
export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async ({ email, password, email_code }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/api/v1/passport/auth/forget",
        qs.stringify({ email, password: password, email_code: email_code }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      );
      return "密码重置成功"; // 成功时返回成功信息
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "密码重置失败");
    }
  },
);

const passportSlice = createSlice({
  name: "passport",
  initialState,
  reducers: {
    clearMessage: (state) => {
      for (const key in state.error) {
        state.error[key] = null;
      }
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.authData = null;
      state.isAdmin = null;
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("authData");
      localStorage.removeItem("isAdmin");
      sessionStorage.removeItem("hasVisited");
      localStorage.removeItem("hasCheckedLogin");
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取账户配置
      .addCase(fetchAccountConfig.pending, (state) => {
        state.loading.fetchAccountConfig = true;
        state.error.fetchAccountConfig = null;
      })
      .addCase(fetchAccountConfig.fulfilled, (state, action) => {
        state.loading.fetchAccountConfig = false;
        state.accountConfig = action.payload;
      })
      .addCase(fetchAccountConfig.rejected, (state, action) => {
        state.loading.fetchAccountConfig = false;
        state.error.fetchAccountConfig = action.payload;
      });
    builder
      .addCase(checkLogin.pending, (state) => {
        state.loading.checkLogin = true;
        state.error.checkLogin = null;
      })
      .addCase(checkLogin.fulfilled, (state, action) => {
        const { is_login, is_admin } = action.payload;
        if (is_login) {
          state.token = localStorage.getItem("token");
          state.authData = JSON.parse(localStorage.getItem("authData"));
          state.isAuthenticated = true;
          state.isAdmin = is_admin;
        }
        state.loading.checkLogin = false;
      })
      .addCase(checkLogin.rejected, (state, action) => {
        state.loading.checkLogin = false;
        state.error.checkLogin = action.payload || "登录验证失败";
        state.token = null;
        state.authData = null;
        state.isAdmin = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("authData");
        localStorage.removeItem("isAdmin");
      });
    // 登录操作的状态变化
    builder
      .addCase(login.pending, (state) => {
        state.loading.login = true;
        state.error.login = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading.login = false;
        state.token = action.payload.token;
        state.authData = action.payload.authData;
        state.isAdmin = action.payload.isAdmin;
        state.isAuthenticated = true;
        //本地存储
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("isAdmin", JSON.stringify(action.payload.isAdmin));
        localStorage.setItem(
          "authData",
          JSON.stringify(action.payload.authData),
        );
        localStorage.setItem("hasCheckedLogin", "true");
      })
      .addCase(login.rejected, (state, action) => {
        state.loading.login = false;
        state.error.login = action.payload;
      });
    // 发送邮箱验证码的状态变化
    builder
      .addCase(sendEmailVerify.pending, (state) => {
        state.loading.sendEmailVerify = true;
        state.error.sendEmailVerify = null;
      })
      .addCase(sendEmailVerify.fulfilled, (state, action) => {
        state.loading.sendEmailVerify = false;
        if (action.payload?.status === "success") {
          state.error.sendEmailVerify = null;
        } else {
          state.error.sendEmailVerify =
            action.payload?.message || "发送验证码失败";
        }
      })
      .addCase(sendEmailVerify.rejected, (state, action) => {
        state.loading.sendEmailVerify = false;
        state.error.sendEmailVerify = action.payload;
      });
    // 注册操作的状态变化
    builder
      .addCase(register.pending, (state) => {
        state.loading.register = true;
        state.error.register = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading.register = false;
        if (!action.payload) {
          state.error.register = "注册返回数据为空";
          return;
        }
        state.token = action.payload.token;
        state.authData = action.payload.authData;
        state.isAdmin = action.payload.isAdmin;
        state.isAuthenticated = true;

        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("isAdmin", JSON.stringify(action.payload.isAdmin));
        localStorage.setItem(
          "authData",
          JSON.stringify(action.payload.authData),
        );
      })
      .addCase(register.rejected, (state, action) => {
        state.loading.register = false;
        state.error.register = action.payload;
      });
    // 忘记密码操作的状态变化
    builder
      .addCase(forgetPassword.pending, (state) => {
        state.loading.forgetPassword = true;
        state.error.forgetPassword = null;
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.loading.forgetPassword = false;
        state.error.forgetPassword = null;
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.loading.forgetPassword = false;
        state.error.forgetPassword = action.payload;
      });
  },
});

export const { logout, clearMessage } = passportSlice.actions;
export default passportSlice.reducer;
