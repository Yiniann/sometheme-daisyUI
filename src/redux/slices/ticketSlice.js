import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import qs from "qs";

let abortController = null;

const initialState = {
  tickets: [],
  selectedTicket: null,
  loading: {
    fetchTickets: false,
    fetchTicketDetail: false,
    replyToTicket: false,
    closeTicket: false,
    createTicket: false,
    withdrawTicket: false,
  },
  error: {
    fetchTickets: null,
    fetchTicketDetail: null,
    replyToTicket: null,
    closeTicket: null,
    createTicket: null,
    withdrawTicket: null,
  },
  success: {
    reply: false,
    close: false,
    create: false,
    withdrawTicket: false,
  },
  fetchedDetail: false,
  currentRequestId: undefined,
};

// 获取工单列表
export const fetchTickets = createAsyncThunk(
  "ticket/fetchTickets",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("未授权，请登录");

      const response = await api.get("/api/v1/user/ticket/fetch");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "获取工单失败");
    }
  },
);

// 获取工单详情
export const fetchTicketDetail = createAsyncThunk(
  "ticket/fetchTicketDetail",
  async (id, { rejectWithValue, signal }) => {
    // ✅ 中断上一个请求
    if (abortController) {
      abortController.abort();
    }

    abortController = new AbortController();
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("未授权，请登录");

      const response = await api.get(`/api/v1/user/ticket/fetch?id=${id}`, {
        signal: abortController.signal,
      });

      return response.data.data;
    } catch (error) {
      if (error.name === "AbortError") {
        return rejectWithValue("请求被取消");
      }
      return rejectWithValue(
        error.response?.data?.message || "获取工单详情失败",
      );
    }
  },
);

// 回复工单
export const replyToTicket = createAsyncThunk(
  "ticket/replyToTicket",
  async ({ id, message }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("未授权，请登录");

      const data = qs.stringify({ id, message });

      const response = await api.post("/api/v1/user/ticket/reply", data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "发送回复失败");
    }
  },
);

// 关闭工单
export const closeTicket = createAsyncThunk(
  "ticket/closeTicket",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("未授权，请登录");

      const data = qs.stringify({ id });

      const response = await api.post("/api/v1/user/ticket/close", data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "关闭工单失败");
    }
  },
);

// 创建新工单
export const createTicket = createAsyncThunk(
  "ticket/createTicket",
  async ({ subject, level, message }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("未授权，请登录");

      const data = qs.stringify({ subject, level, message });

      const response = await api.post("/api/v1/user/ticket/save", data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      return response.data;  // 这里返回整个接口响应体
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "创建工单失败");
    }
  },
);

// 提现操作
export const withdrawTicket = createAsyncThunk(
  "ticket/withdrawTicket",
  async ({ withdraw_account, withdraw_method }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("未授权，请登录");

      const data = qs.stringify({ withdraw_account, withdraw_method });

      const response = await api.post("/api/v1/user/ticket/withdraw", data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "提现失败");
    }
  },
);

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    setSelectedTicket: (state, action) => {
      state.selectedTicket = action.payload;
      state.fetchedDetail = false;
    },
    clearReplyStatus: (state) => {
      state.success.reply = false;
      state.error.replyToTicket = null;
    },
    clearCloseStatus: (state) => {
      state.success.close = false;
      state.error.closeTicket = null;
    },
    clearCreateStatus: (state) => {
      state.success.create = false;
      state.error.createTicket = null;
    },
    clearTicketDetail: (state) => {
      state.selectedTicket = null;
      state.fetchedDetail = false;
    },
    clearWithdrawStatus: (state) => {
      state.success.withdraw = false;
      state.error.withdrawTicket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取工单列表
      .addCase(fetchTickets.pending, (state) => {
        state.loading.fetchTickets = true;
        state.error.fetchTickets = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading.fetchTickets = false;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading.fetchTickets = false;
        state.error.fetchTickets = action.payload;
      })
      // 获取工单详情
      .addCase(fetchTicketDetail.pending, (state, action) => {
        state.loading.fetchTicketDetail = true;
        state.error.fetchTicketDetail = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchTicketDetail.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.loading.fetchTicketDetail = false;
        state.selectedTicket = action.payload;
        state.fetchedDetail = true;
      })
      .addCase(fetchTicketDetail.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.loading.fetchTicketDetail = false;
        state.error.fetchTicketDetail = action.payload;
      })
      // 回复工单
      .addCase(replyToTicket.pending, (state) => {
        state.loading.replyToTicket = true;
        state.error.replyToTicket = null;
        state.success.reply = false;
      })
      .addCase(replyToTicket.fulfilled, (state, action) => {
        state.loading.replyToTicket = false;
        if (action.payload.status === "success" && action.payload.data === true) {
          state.success.reply = true;
        } else {
          state.error.replyToTicket = action.payload.message || "回复失败";
        }
      })

      .addCase(replyToTicket.rejected, (state, action) => {
        state.loading.replyToTicket = false;
        state.error.replyToTicket = action.payload;
      })
      // 关闭工单
      .addCase(closeTicket.pending, (state) => {
        state.loading.closeTicket = true;
        state.error.closeTicket = null;
        state.success.close = false;
      })
      .addCase(closeTicket.fulfilled, (state, action) => {
        state.loading.closeTicket = false;
        state.success.close = !!action.payload?.data;
      })
      .addCase(closeTicket.rejected, (state, action) => {
        state.loading.closeTicket = false;
        state.error.closeTicket = action.payload;
      })
      // 创建新工单
      .addCase(createTicket.pending, (state) => {
        state.loading.createTicket = true;
        state.error.createTicket = null;
        state.success.create = false;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading.createTicket = false;
        // 判断接口返回的 status 字段决定是否成功
        state.success.create = action.payload?.status === "success" && action.payload?.data === true;
        if (!state.success.create) {
          state.error.createTicket = action.payload?.message || "创建工单失败";
        }
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading.createTicket = false;
        // rejectWithValue 传来的错误信息放这里
        state.error.createTicket = action.payload || action.error.message;
      })
      // 提现操作
      .addCase(withdrawTicket.pending, (state) => {
        state.loading.withdrawTicket = true;
        state.error.withdrawTicket = null;
        state.success.withdraw = false;
      })
      .addCase(withdrawTicket.fulfilled, (state) => {
        state.loading.withdrawTicket = false;
        state.success.withdraw = true;
      })
      .addCase(withdrawTicket.rejected, (state, action) => {
        state.loading.withdrawTicket = false;
        state.error.withdrawTicket = action.payload;
      });
  },
});

export const {
  setSelectedTicket,
  clearReplyStatus,
  clearCloseStatus,
  clearCreateStatus,
  clearTicketDetail,
  clearWithdrawStatus,
} = ticketSlice.actions;

export default ticketSlice.reducer;
