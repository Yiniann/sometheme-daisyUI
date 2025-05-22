import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

const initialState = {
  list: [],
  current: null,
  loading: { fetchKnowledgeById: false, fetchKnowledgeList: false },
  error: { fetchKnowledgeById: null, fetchKnowledgeList: null },
};

// 获取知识库列表
export const fetchKnowledgeList = createAsyncThunk(
  "knowledge/fetchList",
  async (language = "zh-CN", { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("未授权，请登录");

      const response = await api.get(
        `/api/v1/user/knowledge/fetch?language=${language}`,
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "获取知识库列表失败",
      );
    }
  },
);

// 获取知识库详情
export const fetchKnowledgeById = createAsyncThunk(
  "knowledge/fetchById",
  async ({ id, language = "zh-CN" }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("未授权，请登录");

      const response = await api.get(
        `/api/v1/user/knowledge/fetch?language=${language}&id=${id}`,
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "获取知识库详情失败",
      );
    }
  },
);

const knowledgeSlice = createSlice({
  name: "knowledge",
  initialState,
  reducers: {
    clearKnowledgeDetail(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKnowledgeList.pending, (state) => {
        state.loading.fetchKnowledgeList = true;
        state.error.fetchKnowledgeList = null;
      })
      .addCase(fetchKnowledgeList.fulfilled, (state, action) => {
        state.loading.fetchKnowledgeList = false;
        state.list = action.payload;
      })
      .addCase(fetchKnowledgeList.rejected, (state, action) => {
        state.loading.fetchKnowledgeList = false;
        state.error.fetchKnowledgeList = action.payload;
      })

      .addCase(fetchKnowledgeById.pending, (state) => {
        state.loading.fetchKnowledgeById = true;
        state.error.fetchKnowledgeById = null;
      })
      .addCase(fetchKnowledgeById.fulfilled, (state, action) => {
        state.loading.fetchKnowledgeById = false;
        if (state.current?.id === action.payload.id) return;
        state.current = action.payload;
      })
      .addCase(fetchKnowledgeById.rejected, (state, action) => {
        state.loading.fetchKnowledgeById = false;
        state.error.fetchKnowledgeById = action.payload;
      });
  },
});

export const { clearKnowledgeDetail } = knowledgeSlice.actions;
export default knowledgeSlice.reducer;
