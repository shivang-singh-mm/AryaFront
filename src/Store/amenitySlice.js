import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api/api.js';

const initialState = {
  allAmenities:[],
  amenityById:{},
  deletedAmenity:{},
  createdAmenity:{},
  editedAmenity:{},
  error:''
};


export const getAllAmenity = createAsyncThunk(
  'amenity/fetchAllAmenity',
  async (id, {rejectWithValue}) => {
    try {
      const response = await api.get(`/api/v1/amenity`);
      return response.data;  
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getSingleAmenity = createAsyncThunk(
  'amenity/fetchSingleAmenity',
  async (id, {rejectWithValue}) => {
    try {
      const response = await api.get(`/api/v1/amenity/${id}`);
      return response.data;  
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editAmenity = createAsyncThunk(
  'amenity/changeAmenity',
  async (updatedAmenity, {rejectWithValue}) => {
    try {
    const response = await api.patch(`/api/v1/amenity/${updatedAmenity.id}`,updatedAmenity.newAmenity);
    return response.data;  
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
    
  }
);

export const createAmenity = createAsyncThunk(
  'amenity/createNewAmenity',
  async (newAmenity, {rejectWithValue}) => {
    try {
      const response = await api.post(`/api/v1/amenity`, newAmenity);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteAmenity = createAsyncThunk(
  'amenity/removeAmenity',
  async (id, {rejectWithValue}) => {
    try {
      const response = await api.delete(`/api/v1/amenity/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const amenitySlice = createSlice({
  name: 'amenity',
  initialState,
  reducers: {},

  extraReducers:  {
    [getAllAmenity.fulfilled] : (state, { payload }) => {
      state.allAmenities = payload;
      state.error = '';
    },
    [getAllAmenity.rejected] : (state, { payload }) => {
      state.allAmenities = {};
      state.error = payload;
    },
    [getSingleAmenity.fulfilled] : (state, { payload }) => {
      state.amenityById = payload;
      state.error = '';
    },
    [getSingleAmenity.rejected] : (state, { payload }) => {
      state.amenityById = {};
      state.error = payload;
    },
    [createAmenity.fulfilled] : (state, { payload }) => {
      state.createdAmenity = payload;
      state.error = '';
    },
    [createAmenity.rejected] : (state, { payload }) => {
      state.createdAmenity = {};
      state.error = payload;
    },
    [editAmenity.fulfilled] : (state,{ payload }) => {
      state.editAmenity = payload;
      state.error = '';
    },
    [editAmenity.rejected] : (state, { payload }) => {
      state.editAmenity = {};
      state.error = payload;
    },
    [deleteAmenity.fulfilled] : (state,{ payload }) => {
      state.deletedAmenity = payload;
      state.error = '';
    },
    [deleteAmenity.rejected] : (state, { payload }) => {
      state.deletedAmenity = {};
      state.error = payload;
    },
  },
});

export default amenitySlice.reducer;
