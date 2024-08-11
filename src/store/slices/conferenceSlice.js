// src/slices/conferenceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  data: null,
  status: "idle",
  error: null,
};

const fetchConferenceDetails = createAsyncThunk(
  "conference/fetchConferenceDetails",
  async (confid, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/conference/${confid}/conferencedetails`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
        }
      );

      const result = response.data;
      console.log(result);
      return result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const conferenceDetailSlice = createSlice({
  name: "SingleConferenceDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConferenceDetails.pending, (state) => {
        console.log("fetchConferenceDetails.pending");
        state.status = "loading";
      })
      .addCase(fetchConferenceDetails.fulfilled, (state, action) => {
        console.log("fetchConferenceDetails.fulfilled");
        state.status = "ok";
        state.data = action.payload;
      })
      .addCase(fetchConferenceDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export { fetchConferenceDetails };
export default conferenceDetailSlice.reducer;
