import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import qs from "qs";

const initialState = {
  orderId: null,
  orders: [],
  paymentMethods: [],
  orderStatus: null,
  orderDetails: null,
  loading: {
    fetchOrders: false,
    fetchOrderDetails: false,
    fetchPaymentMethods: false,
    checkout: false,
    cancelOrder: false,
    saveOrder: false,
    checkOrderStatus: false,
    checkOrderStatus: false,
  },
  error: {
    fetchOrders: null,
    fetchOrderDetails: null,
    fetchPaymentMethods: null,
    checkout: null,
    cancelOrder: null,
    saveOrder: null,
    checkOrderStatus: null,
  },
};

// 获取订单列表的异步操作
export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/v1/user/order/fetch");

      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { status: "error", message: "获取订单失败" },
      );
    }
  },
);

// 获取订单详情的异步操作
export const fetchOrderDetails = createAsyncThunk(
  "order/fetchOrderDetails",
  async (trade_no, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/v1/user/order/detail`, {
        params: { trade_no },
      });
      // 返回数据中的 data 部分，包含订单详情
      if (res.data.status === "success") {
        return res.data.data; // 仅返回订单数据部分
      } else {
        throw new Error(res.data.message || "获取订单详情失败");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          status: "error",
          message: "获取订单详情失败",
        },
      );
    }
  },
);

// 获取付款方式的异步操作
export const fetchPaymentMethods = createAsyncThunk(
  "order/fetchPaymentMethods",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/v1/user/order/getPaymentMethod");

      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          status: "error",
          message: "获取付款方式失败",
        },
      );
    }
  },
);

//下单（保存订单）异步
export const saveOrder = createAsyncThunk(
  "user/saveOrder",
  async ({ period, plan_id, coupon_code }, { rejectWithValue }) => {
    try {
      // 构建请求数据
      const requestData = { period, plan_id };
      if (coupon_code) {
        requestData.coupon_code = coupon_code;
      }

      // 发送请求
      const res = await api.post(
        "/api/v1/user/order/save",
        qs.stringify(requestData),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        },
      );

      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { status: "error", message: "下单失败" },
      );
    }
  },
);

// 结账异步操作
export const checkout = createAsyncThunk(
  "order/checkout",
  async ({ trade_no, method }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/api/v1/user/order/checkout",
        qs.stringify({ trade_no, method }),
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { status: "error", message: "结账失败" },
      );
    }
  },
);

// 检查订单支付状态
export const checkOrderStatus = createAsyncThunk(
  "order/checkOrderStatus",
  async (trade_no, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/v1/user/order/check", {
        params: { trade_no },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          status: "error",
          message: "查询订单状态失败",
        },
      );
    }
  },
);

// 取消订单的异步操作
export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async (trade_no, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/api/v1/user/order/cancel",
        qs.stringify({ trade_no }),
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        },
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { status: "error", message: "取消订单失败" },
      );
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 下订单
      .addCase(saveOrder.pending, (state) => {
        state.loading.saveOrder = true;
        state.error.saveOrder = null;
      })
      .addCase(saveOrder.fulfilled, (state, action) => {
        state.loading.saveOrder = false;
        state.orderId = action.payload;
      })
      .addCase(saveOrder.rejected, (state, action) => {
        state.loading.saveOrder = false;
        state.error.saveOrder = action.payload?.message || "下单失败";
      })
      // 获取订单列表
      .addCase(fetchOrders.pending, (state) => {
        state.loading.fetchOrders = true;
        state.error.fetchOrders = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading.fetchOrders = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading.fetchOrders = false;
        state.error.fetchOrders = action.payload?.message || "获取订单失败";
      })
      //获取付款方式
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.loading.fetchPaymentMethods = true;
        state.error.fetchPaymentMethods = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.loading.fetchPaymentMethods = false;
        state.paymentMethods = action.payload;
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.loading.fetchPaymentMethods = false;
        state.error.fetchPaymentMethods =
          action.payload?.message || "获取付款方式失败";
      })
      // 结账
      .addCase(checkout.pending, (state) => {
        state.loading.checkout = true;
        state.error.checkout = null;
      })
      .addCase(checkout.fulfilled, (state) => {
        state.loading.checkout = false;
      })
      .addCase(checkout.rejected, (state, action) => {
        state.loading.checkout = false;
        state.error.checkout = action.payload?.message || "唤起付款链接失败";
      })
      // 检查订单状态
      .addCase(checkOrderStatus.pending, (state) => {
        state.loading.checkOrderStatus = true;
        state.error.checkOrderStatus = null;
      })
      .addCase(checkOrderStatus.fulfilled, (state, action) => {
        state.loading.checkOrderStatus = false;
        state.orderStatus = action.payload; // 订单当前状态
      })
      .addCase(checkOrderStatus.rejected, (state, action) => {
        state.loading.checkOrderStatus = false;
        state.error.checkOrderStatus =
          action.payload?.message || "查询订单状态失败";
      })
      // 处理获取订单详情
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading.fetchOrderDetails = true;
        state.error.fetchOrderDetails = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading.fetchOrderDetails = false;
        state.orderDetails = action.payload; // 存储订单详情
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading.fetchOrderDetails = false;
        state.error.fetchOrderDetails =
          action.payload?.message || "获取订单详情失败";
      })
      //取消订单
      .addCase(cancelOrder.pending, (state) => {
        state.loading.cancelOrder = true;
        state.error.cancelOrder = null;
      })
      .addCase(cancelOrder.fulfilled, (state) => {
        state.loading.cancelOrder = false;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading.cancelOrder = false;
        state.error.cancelOrder = action.payload?.message || "取消订单失败";
      });
  },
});

export default orderSlice.reducer;
