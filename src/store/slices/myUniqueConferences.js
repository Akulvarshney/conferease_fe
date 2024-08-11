import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  data: null,
  status: "idle",
  error: null,
};

export const fetchMyUniqueConferences = createAsyncThunk(
  "conference/fetchMyUniqueConferences",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/conference/my`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      console.log(response.data);
      return response.data.conferences;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const conferenceSlice = createSlice({
  name: "fetchMyUniqueConferences",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyUniqueConferences.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMyUniqueConferences.fulfilled, (state, action) => {
        state.status = "ok";
        state.data = action.payload;
      })
      .addCase(fetchMyUniqueConferences.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default conferenceSlice.reducer;
