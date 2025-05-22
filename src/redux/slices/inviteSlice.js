import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

const initialState = {
  data: {
    codes: [],
    stat: [0, 0, 0, 0, 0],
  },
  loading: { fetchInviteData: false, createInviteCode: false },
  error: { fetchInviteData: null, createInviteCode: null },
  createSuccess: false,
};

//获取邀请数据
export const fetchInviteData = createAsyncThunk(
  "invite/fetchInviteData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/user/invite/fetch");
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);
//创建邀请码
export const createInviteCode = createAsyncThunk(
  "invite/createInviteCode",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/user/invite/save");
      const { data, message } = response.data;

      if (data === true) {
        return true;
      } else {
        return rejectWithValue(message || "创建失败：后端返回 false");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "未知错误";
      return rejectWithValue(errorMsg);
    }
  },
);

const inviteSlice = createSlice({
  name: "invite",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInviteData.pending, (state) => {
        state.loading.fetchInviteData = true;
        state.error.fetchInviteData = null;
      })
      .addCase(fetchInviteData.fulfilled, (state, action) => {
        state.loading.fetchInviteData = false;
        state.data = action.payload;
      })
      .addCase(fetchInviteData.rejected, (state, action) => {
        state.loading.fetchInviteData = false;
        state.error.fetchInviteData = action.payload;
      })
      // 创建邀请码
      .addCase(createInviteCode.pending, (state) => {
        state.loading.createInviteCode = true;
        state.createSuccess = false;
        state.error.createInviteCode = null;
      })
      .addCase(createInviteCode.fulfilled, (state, action) => {
        state.loading.createInviteCode = false;
        state.createSuccess = true;
      })
      .addCase(createInviteCode.rejected, (state, action) => {
        state.loading.createInviteCode = false;
        state.createSuccess = false;
        state.error.createInviteCode = action.payload;
      });
  },
});

export default inviteSlice.reducer;
