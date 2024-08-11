// src/slices/conferenceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  data: null,
  status: "idle",
  error: null,
};

const userRoleForConference = createAsyncThunk(
  "conference/userRoleForConference",
  async (confid, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/conference/${confid}/roles`,
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

const userRoleForConferenceSlice = createSlice({
  name: "userRoleForConference",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userRoleForConference.pending, (state) => {
        console.log("fetchConferenceDetails.pending");
        state.status = "loading";
      })
      .addCase(userRoleForConference.fulfilled, (state, action) => {
        console.log("fetchConferenceDetails.fulfilled");
        state.status = "ok";
        state.data = action.payload;
      })
      .addCase(userRoleForConference.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export { userRoleForConference };
export default userRoleForConferenceSlice.reducer;
