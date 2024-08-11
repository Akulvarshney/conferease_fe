// src/slices/conferenceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  data: null,
  status: "idle",
  error: null,
};

const fetchTracksAndConfDetails = createAsyncThunk(
  "conference/fetchTracksAndConfDetails",
  async (confId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/conference/${confId}/tracks`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
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

const fetchTracksAndConfDetailsSlice = createSlice({
  name: "fetchTracksAndConfDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracksAndConfDetails.pending, (state) => {
        console.log("fetchAllConferenceList.pending");
        state.status = "loading";
      })
      .addCase(fetchTracksAndConfDetails.fulfilled, (state, action) => {
        console.log("fetchAllConferenceList.fulfilled");
        state.status = "ok";
        state.data = action.payload;
      })
      .addCase(fetchTracksAndConfDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export { fetchTracksAndConfDetails };
export default fetchTracksAndConfDetailsSlice.reducer;
