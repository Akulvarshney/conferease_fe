// src/slices/conferenceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  allConferenceList: null,
  status: "idle",
  error: null,
};

const fetchAllConferenceList = createAsyncThunk(
  "conference/fetchConferenceDetails",
  async ({ page, pageSize }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/conference/allconferences`,
        {
          params: { page, pageSize },
        }
      );
      console.log(response.data.data);
      const result = response.data.data;
      return result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const allConferenceListSlice = createSlice({
  name: "AllConferenceList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllConferenceList.pending, (state) => {
        console.log("fetchAllConferenceList.pending");
        state.status = "loading";
      })
      .addCase(fetchAllConferenceList.fulfilled, (state, action) => {
        console.log("fetchAllConferenceList.fulfilled");
        state.status = "ok";
        state.conferenceData = action.payload;
      })
      .addCase(fetchAllConferenceList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export { fetchAllConferenceList };
export default allConferenceListSlice.reducer;
