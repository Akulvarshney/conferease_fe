import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const userConfereceBasedOnRole = createAsyncThunk(
  "conference/userConfereceBasedOnRole",
  async (payload, { rejectWithValue }) => {
    const data = JSON.stringify({
      conferenceId: payload.conferenceId,
      role: payload.role,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/conference/paperDetails/role`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("authToken"),
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      //   console.log(response.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const userConfereceBasedOnRoleSlice = createSlice({
  name: "userConfereceBasedOnRole",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userConfereceBasedOnRole.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(userConfereceBasedOnRole.fulfilled, (state, action) => {
        state.status = "ok";
        state.data = action.payload;
      })
      .addCase(userConfereceBasedOnRole.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default userConfereceBasedOnRoleSlice.reducer;
