import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api.js";

const initialState = {
    allFaqs: [],
    faqById: {},
    updatedFaq: {},
    deletedFaq: {},
    createdFaq: {},
    error: "",
};

export const getAllFaqs = createAsyncThunk(
    "faqs/fetchAllfaqs",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/v1/faq`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getFaqById = createAsyncThunk(
    "faq/fetchFaqById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/v1/faq/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const editFaq = createAsyncThunk(
    "faq/changeFaq",
    async (updatedFaq, { rejectWithValue }) => {
        try {
            const response = await api.patch(
                `/api/v1/faq/${updatedFaq.id}`,
                updatedFaq.newFaq
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createFaq = createAsyncThunk(
    "faq/createNewFaq",
    async (newFaq, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/v1/faq`, newFaq);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteFaq = createAsyncThunk(
    "faq/removeFaq",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/api/v1/faq/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const faqSlice = createSlice({
    name: "faq",
    initialState,
    reducers: {},

    extraReducers: {
        [getAllFaqs.fulfilled]: (state, { payload }) => {
            state.allFaqs = payload;
            state.error = "";
        },
        [getAllFaqs.rejected]: (state, { payload }) => {
            state.allFaqs = {};
            state.error = payload;
        },
        [getFaqById.fulfilled]: (state, { payload }) => {
            state.faqById = payload;
            state.error = "";
        },
        [getFaqById.rejected]: (state, { payload }) => {
            state.faqById = {};
            state.error = payload;
        },
        [editFaq.fulfilled]: (state, { payload }) => {
            state.updatedFaq = payload;
            state.error = "";
        },
        [editFaq.rejected]: (state, { payload }) => {
            state.updatedFaq = {};
            state.error = payload;
        },
        [createFaq.fulfilled]: (state, { payload }) => {
            state.createdFaq = payload;
            state.error = "";
        },
        [createFaq.rejected]: (state, { payload }) => {
            state.createdFaq = {};
            state.error = payload;
        },
        [deleteFaq.fulfilled]: (state, { payload }) => {
            state.deletedFaq = payload;
            state.error = "";
        },
        [deleteFaq.rejected]: (state, { payload }) => {
            state.deletedFaq = {};
            state.error = payload;
        },
    },
});

export default faqSlice.reducer;