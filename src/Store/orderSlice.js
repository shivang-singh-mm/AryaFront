import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api.js";

const initialState = {
  allOrders: [],
  createdOrder: {},
  updatedOrder: {},
  deletedOrder: {},
  ordersByUserId: [],
  orderById: {},
  current: [],
  past: [],
  deleteOrdersCount: 0,
  error: "",
};

export const allOrders = createAsyncThunk(
  "order/fetchAllOrders",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/order`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPastOrders = createAsyncThunk(
  "order/fetchPastOrders",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/order/past/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getCurrentOrders = createAsyncThunk(
  "order/fetchCurrentOrders",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/order/current/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getOrderById = createAsyncThunk(
  "order/fetchOrderById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/order/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editOrder = createAsyncThunk(
  "order/changeOrder",
  async (updatedOrder, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/api/v1/order/${updatedOrder.id}`,
        updatedOrder.newOrder
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createOrder = createAsyncThunk(
  "order/createNewOrder",
  async (newOrder, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/order`, newOrder);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "order/removeOrder",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/v1/order/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteOrdersByPropertyId = createAsyncThunk(
  "order/removeOrdersByPropertyId",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/v1/order/property/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},

  extraReducers: {
    [allOrders.fulfilled]: (state, { payload }) => {
      state.allOrders = payload;
      state.error = "";
    },
    [allOrders.rejected]: (state, { payload }) => {
      state.allOrders = {};
      state.error = payload;
    },
    [getPastOrders.fulfilled]: (state, { payload }) => {
      state.past = payload;
      state.error = "";
    },
    [getPastOrders.rejected]: (state, { payload }) => {
      state.past = {};
      state.error = payload;
    },
    [getCurrentOrders.fulfilled]: (state, { payload }) => {
      state.current = payload;
      state.error = "";
    },
    [getCurrentOrders.rejected]: (state, { payload }) => {
      state.current = {};
      state.error = payload;
    },
    [getOrderById.fulfilled]: (state, { payload }) => {
      state.current = payload;
      state.error = "";
    },
    [getOrderById.rejected]: (state, { payload }) => {
      state.current = {};
      state.error = payload;
    },
    [createOrder.fulfilled]: (state, { payload }) => {
      state.createOrder = payload;
      state.error = "";
    },
    [createOrder.rejected]: (state, { payload }) => {
      state.createdOrder = {};
      state.error = payload;
    },
    [editOrder.fulfilled]: (state, { payload }) => {
      state.updatedOrder = payload;
      state.error = "";
    },
    [editOrder.rejected]: (state, { payload }) => {
      state.updatedOrder = {};
      state.error = payload;
    },
    [deleteOrder.fulfilled]: (state, { payload }) => {
      state.deletedOrder = payload;
      state.error = "";
    },
    [deleteOrder.rejected]: (state, { payload }) => {
      state.deletedOrder = {};
      state.error = payload;
    },
    [deleteOrdersByPropertyId.fulfilled]: (state, { payload }) => {
      state.deleteOrdersCount = payload;
      state.error = "";
    },
    [deleteOrdersByPropertyId.rejected]: (state, { payload }) => {
      state.deleteOrdersCount = 0;
      state.error = payload;
    },
  },
});

export default orderSlice.reducer;
