import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import qs from "qs";

const initialState = {
  plans: [],
  coupon: null,
  loading: { fetchPlan: false, checkCoupon: false },
  error: { fetchPlan: null, checkCoupon: null },
  loaded: false,
};

// 获取计划数据
export const fetchPlan = createAsyncThunk(
  "user/fetchPlan",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("未授权，请登录");
      }

      const response = await api.get("/api/v1/user/plan/fetch");

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "获取计划数据失败",
      );
    }
  },
);

// 检查优惠券
export const checkCoupon = createAsyncThunk(
  "user/checkCoupon",
  async ({ code, plan_id }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/api/v1/user/coupon/check",
        qs.stringify({ code, plan_id }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // 必须设置该 header
          },
        },
      );
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { status: "error", message: "验证失败" },
      );
    }
  },
);

const planSlice = createSlice({
  name: "plan",
  initialState,
  reducers: {
    clearCoupon(state) {
      state.coupon = null;
      state.error.checkCoupon = null;
      state.loading.checkCoupon = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取计划数据
      .addCase(fetchPlan.pending, (state) => {
        state.loading.fetchPlan = true;
        state.error.fetchPlan = null;
        state.loaded = false;
      })
      .addCase(fetchPlan.fulfilled, (state, action) => {
        state.loading.fetchPlan = false;
        state.plans = action.payload;
        state.loaded = true;
      })
      .addCase(fetchPlan.rejected, (state, action) => {
        state.loading.fetchPlan = false;
        state.error.fetchPlan = action.payload;
        state.loaded = false;
      })
      // 检查优惠券
      .addCase(checkCoupon.pending, (state) => {
        state.loading.checkCoupon = true;
        state.error.checkCoupon = null;
        state.coupon = null;
        state.couponError = null;
      })
      .addCase(checkCoupon.fulfilled, (state, action) => {
        state.loading.checkCoupon = false;
        state.coupon = action.payload;
      })
      .addCase(checkCoupon.rejected, (state, action) => {
        state.loading.checkCoupon = false;
        state.coupon = null;
        state.error.checkCoupon = action.payload?.message || "优惠券验证失败";
      });
  },
});

export const { clearCoupon } = planSlice.actions;
export default planSlice.reducer;
