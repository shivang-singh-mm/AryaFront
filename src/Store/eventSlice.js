import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api/api.js';

const initialState = {
  allEvents: [],
  eventById: {},
  createdEvent: {},
  deletedEvent: {},
  updatedEvent: {},
  overlap:{},
  error: "",
};


export const getAllEvents = createAsyncThunk(
  "event/fetchAllEvents",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/event/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getOverlap = createAsyncThunk(
  "event/fetchOverlappingEvent",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/event/overlap`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const getEventById = createAsyncThunk(
  "event/fetchEventById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/event/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createEvent = createAsyncThunk(
  "event/createNewEvent",
  async (newEvent, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/event`, newEvent);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editEvent = createAsyncThunk(
  "event/changeEvent",
  async (updatedEvent, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/api/v1/event/${updatedEvent.id}`,
        updatedEvent.newEvent
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "event/removeEvent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/v1/event/${data.id}`, {data: data.propertyDetails});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {},

  extraReducers: {
    [getAllEvents.fulfilled]: (state, { payload }) => {
      state.allEvents = payload;
      state.error = "";
    },
    [getAllEvents.rejected]: (state, { payload }) => {
      state.allEvents = {};
      state.error = payload;
    },
    [getOverlap.fulfilled]: (state, { payload }) => {
      state.overlap = payload;
      state.error = "";
    },
    [getOverlap.rejected]: (state, { payload }) => {
      state.overlap = {};
      state.error = payload;
    },
    [getEventById.fulfilled]: (state, { payload }) => {
      state.eventById = payload;
      state.error = "";
    },
    [getEventById.rejected]: (state, { payload }) => {
      state.eventById = {};
      state.error = payload;
    },
    [createEvent.fulfilled]: (state, { payload }) => {
      state.createdEvent = payload;
      state.error = "";
    },
    [createEvent.rejected]: (state, { payload }) => {
      state.createdEvent = {};
      state.error = payload;
    },
    [editEvent.fulfilled]: (state, { payload }) => {
      state.updatedEvent = payload;
      state.error = "";
    },
    [editEvent.rejected]: (state, { payload }) => {
      state.updatedEvent = {};
      state.error = payload;
    },
    [deleteEvent.fulfilled]: (state, { payload }) => {
      state.deletedEvent = payload;
      state.error = "";
    },
    [deleteEvent.rejected]: (state, { payload }) => {
      state.deletedEvent = {};
      state.error = payload;
    },
  },
});


export default eventSlice.reducer;
