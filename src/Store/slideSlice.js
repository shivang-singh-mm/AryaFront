import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api/api.js';

const initialState = {
  allSlides:[],
  slideById:{},
  deletedSide:{},
  createdSlide:{},
  editedSlide:{},
  error:''
};


export const getAllSlides = createAsyncThunk(
  'slide/fetchAllSlides',
  async (id, {rejectWithValue}) => {
    try {
      const response = await api.get(`/api/v1/slide`);
      return response.data;  
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getSingleSlide = createAsyncThunk(
  'slide/fetchSingleSlide',
  async (id, {rejectWithValue}) => {
    try {
      const response = await api.get(`/api/v1/slide/${id}`);
      return response.data;  
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editSlide = createAsyncThunk(
  'slide/changeSlide',
  async (updatedSlide, {rejectWithValue}) => {
    try {
    const response = await api.patch(`/api/v1/slide/${updatedSlide.id}`,updatedSlide.newSlide);
    return response.data;  
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
    
  }
);

export const createSlide = createAsyncThunk(
  'slide/createNewSlide',
  async (newSlide, {rejectWithValue}) => {
    try {
      const response = await api.post(`/api/v1/slide`, newSlide);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteSlide = createAsyncThunk(
  'slide/removeSlide',
  async (data, {rejectWithValue}) => {
    try {
      const response = await api.delete(`/api/v1/slide/${data.id}`, {data: data.propertyDetails} );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const slideSlice = createSlice({
  name: 'slide',
  initialState,
  reducers: {},

  extraReducers:  {
    [getAllSlides.fulfilled] : (state, { payload }) => {
      state.allSlides = payload;
      state.error = '';
    },
    [getAllSlides.rejected] : (state, { payload }) => {
      state.allSlides = {};
      state.error = payload;
    },
    [getSingleSlide.fulfilled] : (state, { payload }) => {
      state.slideById = payload;
      state.error = '';
    },
    [getSingleSlide.rejected] : (state, { payload }) => {
      state.slideById = {};
      state.error = payload;
    },
    [createSlide.fulfilled] : (state, { payload }) => {
      state.createdSlide = payload;
      state.error = '';
    },
    [createSlide.rejected] : (state, { payload }) => {
      state.createdSlide = {};
      state.error = payload;
    },
    [editSlide.fulfilled] : (state,{ payload }) => {
      state.editedSlide = payload;
      state.error = '';
    },
    [editSlide.rejected] : (state, { payload }) => {
      state.editedSlide = {};
      state.error = payload;
    },
    [deleteSlide.fulfilled] : (state,{ payload }) => {
      state.deletedSlide = payload;
      state.error = '';
    },
    [deleteSlide.rejected] : (state, { payload }) => {
      state.deletedSlide = {};
      state.error = payload;
    },
  },
});

export default slideSlice.reducer;
