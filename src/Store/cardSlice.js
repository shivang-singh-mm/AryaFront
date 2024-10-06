import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api.js";

const initialState = {
  allCards: [],
  cardById: {},
  deletedCard: {},
  createdCard: {},
  editedCard: {},
  error: "",
};

export const getAllCards = createAsyncThunk(
  "card/fetchAllCards",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/card`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getSingleCard = createAsyncThunk(
  "card/fetchSingleCard",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/card/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editCard = createAsyncThunk(
  "card/changeCard",
  async (updatedCard, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/api/v1/card/${updatedCard.id}`,
        updatedCard.newCard
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createCard = createAsyncThunk(
  "amenity/createNewCard",
  async (newCard, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/card`, newCard);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCard = createAsyncThunk(
  "card/removeCard",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/v1/card/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {},

  extraReducers: {
    [getAllCards.fulfilled]: (state, { payload }) => {
      state.allCards = payload;
      state.error = "";
    },
    [getAllCards.rejected]: (state, { payload }) => {
      state.allCards = {};
      state.error = payload;
    },
    [getSingleCard.fulfilled]: (state, { payload }) => {
      state.cardById = payload;
      state.error = "";
    },
    [getSingleCard.rejected]: (state, { payload }) => {
      state.cardById = {};
      state.error = payload;
    },
    [createCard.fulfilled]: (state, { payload }) => {
      state.createdCard = payload;
      state.error = "";
    },
    [createCard.rejected]: (state, { payload }) => {
      state.createdCard = {};
      state.error = payload;
    },
    [editCard.fulfilled]: (state, { payload }) => {
      state.editedCard = payload;
      state.error = "";
    },
    [editCard.rejected]: (state, { payload }) => {
      state.editedCard = {};
      state.error = payload;
    },
    [deleteCard.fulfilled]: (state, { payload }) => {
      state.deletedCard = payload;
      state.error = "";
    },
    [deleteCard.rejected]: (state, { payload }) => {
      state.deletedCard = {};
      state.error = payload;
    },
  },
});

export default cardSlice.reducer;
