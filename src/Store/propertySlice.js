import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api.js";

const initialState = {
  allProperties: [],
  propertyById: {},
  updatedProperty: {},
  deletedProperty: {},
  createdProperty: {},
  error: "",
};

export const getAllProperties = createAsyncThunk(
  "property/fetchAllproperties",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/property`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPropertyById = createAsyncThunk(
  "property/fetchPropertyById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/property/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editProperty = createAsyncThunk(
  "property/changeProperty",
  async (updatedProperty, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/api/v1/property/${updatedProperty.id}`,
        updatedProperty.newProperty
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createProperty = createAsyncThunk(
  "property/createNewProperty",
  async (newProperty, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/property`, newProperty);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteProperty = createAsyncThunk(
  "property/removeProperty",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/v1/property/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {},

  extraReducers: {
    [getAllProperties.fulfilled]: (state, { payload }) => {
      state.allProperties = payload;
      state.error = "";
    },
    [getAllProperties.rejected]: (state, { payload }) => {
      state.allProperties = {};
      state.error = payload;
    },
    [getPropertyById.fulfilled]: (state, { payload }) => {
      state.propertyById = payload;
      state.error = "";
    },
    [getPropertyById.rejected]: (state, { payload }) => {
      state.propertyById = {};
      state.error = payload;
    },
    [editProperty.fulfilled]: (state, { payload }) => {
      state.updatedProperty = payload;
      state.error = "";
    },
    [editProperty.rejected]: (state, { payload }) => {
      state.updatedProperty = {};
      state.error = payload;
    },
    [createProperty.fulfilled]: (state, { payload }) => {
      state.createdProperty = payload;
      state.error = "";
    },
    [createProperty.rejected]: (state, { payload }) => {
      state.createdProperty = {};
      state.error = payload;
    },
    [deleteProperty.fulfilled]: (state, { payload }) => {
      state.deletedProperty = payload;
      state.error = "";
    },
    [deleteProperty.rejected]: (state, { payload }) => {
      state.deletedProperty = {};
      state.error = payload;
    },
  },
});

export default propertySlice.reducer;
