import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api.js";

const initialState = {
    allAdmins: [],
    deletedAdmin: {},
    createdAdmin: {},
    error: "",
};

export const getAllAdmins = createAsyncThunk(
    "admin/fetchAllAdmins",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/v1/user/admin/fetch`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createAdmin = createAsyncThunk(
    "admin/createNewAdmin",
    async (email, { rejectWithValue }) => {
        try {
            const response = await api.put(`/api/v1/user/admin/add`, email);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const removeAdmin = createAsyncThunk(
    "admin/removeAdmin",
    async (email, { rejectWithValue }) => {
        try {
            const response = await api.put('/api/v1/user/admin/remove', email);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {},

    extraReducers: {
        [getAllAdmins.fulfilled]: (state, { payload }) => {
            state.allAdmins = payload;
            state.error = "";
        },
        [getAllAdmins.rejected]: (state, { payload }) => {
            state.allAdmins = {};
            state.error = payload;
        },
        [createAdmin.fulfilled]: (state, { payload }) => {
            state.createdAdmin = payload;
            state.error = "";
        },
        [createAdmin.rejected]: (state, { payload }) => {
            state.createdAdmin = {};
            state.error = payload;
        },
        [removeAdmin.fulfilled]: (state, { payload }) => {
            state.deletedAdmin = payload;
            state.error = "";
        },
        [removeAdmin.rejected]: (state, { payload }) => {
            state.deletedAdmin = {};
            state.error = payload;
        },
    },
});

export default adminSlice.reducer;