import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  data: null,
  status: "idle",
  error: null,
};

export const submitPaper = createAsyncThunk(
  "paper/submitPaper",
  async (paperDetails, { rejectWithValue }) => {
    try {
      console.log("under hu", paperDetails);
      let data = new FormData();
      data.append("paperName", paperDetails.paperName);
      paperDetails.authorEmails.forEach((email) =>
        data.append("authorEmails[]", email)
      );
      data.append("trackId", paperDetails.trackId);
      data.append("conferenceId", paperDetails.conferenceId);

      data.append("file", paperDetails.file);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/conference/paper/submit`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const paperSlice = createSlice({
  name: "paper",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitPaper.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitPaper.fulfilled, (state, action) => {
        state.status = "ok";
        state.data = action.payload;
      })
      .addCase(submitPaper.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default paperSlice.reducer;
