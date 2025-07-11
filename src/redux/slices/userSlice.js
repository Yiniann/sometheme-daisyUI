import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import qs from "qs";

const initialState = {
  info: null,
  subscription: null,
  bot:null,
  servers: [],
  stat: {
    pendingOrders: 0,
    pendingWorkOrders: 0,
    pendingInvites: 0,
  },
  notices: [],
  fetchedNotice: false,
  trafficLog: [],
  loading: {
    fetchInfo: false,
    fetchSubscription: false,
    getStat: false,
    fetchNotice: false,
    getTrafficLog: false,
    fetchServerList: false,
    resetSecurity: false,
    changePassword: false,
    transferCommission: false,
    getBotInfo:false,
  },
  error: {
    fetchInfo: null,
    fetchSubscription: null,
    getStat: null,
    fetchNotice: null,
    getTrafficLog: null,
    fetchServerList: null,
    resetSecurity: null,
    changePassword: null,
    transferCommission: null,
    getBotInfo:null,
  },
};

// 获取用户信息
export const fetchInfo = createAsyncThunk(
  "user/fetchInfo",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("未授权，请登录");
      }

      const response = await api.get("/api/v1/user/info");

      const { data } = response.data;
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "获取用户信息失败",
      );
    }
  },
);

// 获取用户订阅信息
export const fetchSubscription = createAsyncThunk(
  "user/fetchSubscription",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("未授权，请登录");
      }

      const response = await api.get("/api/v1/user/getSubscribe");

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "获取订阅信息失败",
      );
    }
  },
);

// 获取用户统计信息
export const getStat = createAsyncThunk(
  "user/getStat",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/user/getStat");
      return response.data.data; // 直接返回数据
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "获取统计信息失败",
      );
    }
  },
);

// 获取通知列表
export const fetchNotice = createAsyncThunk(
  "user/fetchNotice",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/user/notice/fetch");
      return response.data.data; // 返回通知列表
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "获取通知失败");
    }
  },
);

// 获取流量日志
export const getTrafficLog = createAsyncThunk(
  "user/getTrafficLog",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("未授权，请登录");
      }

      const response = await api.get("/api/v1/user/stat/getTrafficLog");

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "获取流量日志失败",
      );
    }
  },
);

// 获取节点信息
export const fetchServerList = createAsyncThunk(
  "user/fetchServerList",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("未授权，请登录");
      }

      const response = await api.get("/api/v1/user/server/fetch");

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "获取节点信息失败",
      );
    }
  },
);
//重置订阅链接
export const resetSecurity = createAsyncThunk(
  "user/resetSecurity",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("未授权，请登录");
      }

      const response = await api.get("/api/v1/user/resetSecurity", null);

      return response.data.data; // 返回新链接
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "重置失败");
    }
  },
);

//修改密码
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("未授权，请登录");
      }

      const data = qs.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      });

      const response = await api.post("/api/v1/user/changePassword", data);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "修改密码失败");
    }
  },
);

// 划转佣金
export const transferCommission = createAsyncThunk(
  "user/transferCommission",
  async ({ transferAmount }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("未授权，请登录");
      }

      const data = qs.stringify({
        transfer_amount: transferAmount,
      });

      const response = await api.post("/api/v1/user/transfer", data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "划转佣金失败");
    }
  },
);

//获取Tg机器人信息
export const getBotInfo = createAsyncThunk(
  "user/telegram/getBotInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/user/telegram/getBotInfo");
      return response.data.data; // 直接返回数据
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "获取机器人失败",
      );
    }
  },
);

// 创建 userSlice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 获取用户基本信息
      .addCase(fetchInfo.pending, (state) => {
        state.loading.fetchInfo = true;
        state.error.fetchInfo = null;
      })
      .addCase(fetchInfo.fulfilled, (state, action) => {
        state.loading.fetchInfo = false;
        state.info = action.payload;
      })
      .addCase(fetchInfo.rejected, (state, action) => {
        state.loading.fetchInfo = false;
        state.error.fetchInfo = action.payload;
      })
      // 获取用户订阅信息
      .addCase(fetchSubscription.pending, (state) => {
        state.loading.fetchSubscription = true;
        state.error.fetchSubscription = null;
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.loading.fetchSubscription = false;
        state.subscription = action.payload;
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.loading.fetchSubscription = false;
        state.error.fetchSubscription = action.payload;
      })
      // 获取统计信息
      .addCase(getStat.pending, (state) => {
        state.loading.getStat = true;
        state.error.getStat = null;
      })
      .addCase(getStat.fulfilled, (state, action) => {
        state.loading.getStat = false;
        state.stat = {
          pendingOrders: action.payload[0],
          pendingWorkOrders: action.payload[1],
          pendingInvites: action.payload[2],
        };
      })
      .addCase(getStat.rejected, (state, action) => {
        state.loading.getStat = false;
        state.error.getStat = action.payload;
      })
      // 获取通知
      .addCase(fetchNotice.pending, (state) => {
        state.loading.fetchNotice = true;
        state.error.fetchNotice = null;
      })
      .addCase(fetchNotice.fulfilled, (state, action) => {
        state.loading.fetchNotice = false;
        state.notices = action.payload; // 更新通知列表
        state.fetchedNotice = true;
      })
      .addCase(fetchNotice.rejected, (state, action) => {
        state.loading.fetchNotice = false;
        state.error.fetchNotice = action.payload;
        state.fetchedNotice = true;
      })
      // 处理获取流量日志
      .addCase(getTrafficLog.pending, (state) => {
        state.loading.getTrafficLog = true;
        state.error.getTrafficLog = null;
      })
      .addCase(getTrafficLog.fulfilled, (state, action) => {
        state.loading.getTrafficLog = false;
        state.trafficLog = action.payload; // 保存流量日志数据
      })
      .addCase(getTrafficLog.rejected, (state, action) => {
        state.loading.getTrafficLog = false;
        state.error.getTrafficLog = action.payload;
      })
      // 获取服务器列表
      .addCase(fetchServerList.pending, (state) => {
        state.loading.fetchServerList = true;
        state.error.fetchServerList = null;
      })
      .addCase(fetchServerList.fulfilled, (state, action) => {
        state.loading.fetchServerList = false;
        state.servers = action.payload;
      })
      .addCase(fetchServerList.rejected, (state, action) => {
        state.loading.fetchServerList = false;
        state.error.fetchServerList = action.payload;
      })
      // 重置订阅链接
      .addCase(resetSecurity.pending, (state) => {
        state.loading.resetSecurity = true;
        state.error.resetSecurity = null;
      })
      .addCase(resetSecurity.fulfilled, (state, action) => {
        state.loading.resetSecurity = false;
        if (state.subscription) {
          state.subscription.subscribe_url = action.payload;
        }
      })
      .addCase(resetSecurity.rejected, (state, action) => {
        state.loading.resetSecurity = false;
        state.error.resetSecurity = action.payload;
      })
      // 修改密码
      .addCase(changePassword.pending, (state) => {
        state.loading.changePassword = true;
        state.error.changePassword = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading.changePassword = false;
        localStorage.removeItem("token");
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading.changePassword = false;
        state.error.changePassword = action.payload;
      })
      // 划转佣金
      .addCase(transferCommission.pending, (state) => {
        state.loading.transferCommission = true;
        state.error.transferCommission = null;
      })
      .addCase(transferCommission.fulfilled, (state) => {
        state.loading.transferCommission = false;
      })
      .addCase(transferCommission.rejected, (state, action) => {
        state.loading.transferCommission = false;
        state.error.transferCommission = action.payload;
      })
      //获取bot
      .addCase(getBotInfo.pending, (state, action) => {
        state.loading.getBotInfo = true;
        state.error.getBotInfo = null;
      })
      .addCase(getBotInfo.fulfilled, (state, action) => {
        state.loading.getBotInfo = false;
        state.bot = action.payload
      })
      .addCase(getBotInfo.rejected, (state, action) => {
      state.loading.getBotInfo = false;
      state.error.getBotInfo = action.payload;
    })
  },
});

export default userSlice.reducer;
