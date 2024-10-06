import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api/api.js';

const initialState = {
  userDetails:{},
  user:null,
  isAuthenticated:false,
  role:"",
  error:''
};
export const getUserById = createAsyncThunk(
  'user/fetchCurrentUserById',
  async (id, {rejectWithValue}) => {
    try {
      const response = await api.get(`/api/v1/user/${id}`);
      return response.data;  
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editUser = createAsyncThunk(
  'user/changeUser',
  async (updatedUser, {rejectWithValue}) => {
    try {
    const response = await api.patch(`/api/v1/user/${updatedUser.id}`,updatedUser.newUser);
    return response.data;  
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
    
  }
);

export const createUser = createAsyncThunk(
  'user/createNewUser',
  async (newUser, {rejectWithValue}) => {
    try {
      const response = await api.post(`/api/v1/user`, newUser);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const userSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    login: (state,{ payload }) => {
      state.user = payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.userDetails = {};
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    }
  },

  extraReducers:  {
    [getUserById.fulfilled] : (state, { payload }) => {
      state.userDetails = payload;
      state.error = '';
    },
    [getUserById.rejected] : (state, { payload }) => {
      state.userDetails = {};
      state.error = payload;
    },
    [createUser.fulfilled] : (state, { payload }) => {
      state.userDetails = payload;
      state.error = '';
    },
    [createUser.rejected] : (state, { payload }) => {
      state.userDetails = {};
      state.error = payload;
    },
    [editUser.fulfilled] : (state,{ payload }) => {
      state.userDetails = payload;
      state.error = '';
    },
    [editUser.rejected] : (state, { payload }) => {
      state.userDetails = {};
      state.error = payload;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
