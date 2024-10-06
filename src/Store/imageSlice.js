import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api.js";

const initialState = {
  allImages: [],
  headingImage: {},
  imageById: {},
  createdImage: {},
  deletedImage: {},
  updatedImage: {},
  error: "",
};

export const getAllImages = createAsyncThunk(
  "image/fetchAllImages",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/image`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getHeadingImages = createAsyncThunk(
  "image/getHeadingImage",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/image/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getImageById = createAsyncThunk(
  "image/fetchImageById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/image/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createImage = createAsyncThunk(
  "image/createNewImage",
  async (newImage, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/image`, newImage);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editImage = createAsyncThunk(
  "image/changeImage",
  async (updatedImage, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/api/v1/image/${updatedImage.id}`,
        updatedImage.newImage
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteImage = createAsyncThunk(
  "image/removeImage",
  async (data, { rejectWithValue }) => {
    try {
    
      const response = await api.delete(`/api/v1/image/${data.id}`, {data: data.propertyDetails});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {},

  extraReducers: {
    [getAllImages.fulfilled]: (state, { payload }) => {
      state.allImages = payload;
      state.error = "";
    },
    [getAllImages.rejected]: (state, { payload }) => {
      state.allImages = {};
      state.error = payload;
    },
    [getHeadingImages.fulfilled]: (state, { payload }) => {
      state.headingImages = payload;
      state.error = "";
    },
    [getHeadingImages.rejected]: (state, { payload }) => {
      state.headingImages = {};
      state.error = payload;
    },
    [getImageById.fulfilled]: (state, { payload }) => {
      state.imageById = payload;
      state.error = "";
    },
    [getImageById.rejected]: (state, { payload }) => {
      state.imageById = {};
      state.error = payload;
    },
    [createImage.fulfilled]: (state, { payload }) => {
      state.createdImage = payload;
      state.error = "";
    },
    [createImage.rejected]: (state, { payload }) => {
      state.createdImage = {};
      state.error = payload;
    },
    [editImage.fulfilled]: (state, { payload }) => {
      state.updatedImage = payload;
      state.error = "";
    },
    [editImage.rejected]: (state, { payload }) => {
      state.updatedImage = {};
      state.error = payload;
    },
    [deleteImage.fulfilled]: (state, { payload }) => {
      state.deletedImage = payload;
      state.error = "";
    },
    [deleteImage.rejected]: (state, { payload }) => {
      state.deletedImage = {};
      state.error = payload;
    },
  },
});

export default imageSlice.reducer;
