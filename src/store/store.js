// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import conferenceDetail from "./slices/conferenceSlice";
import allConferenceList from "./slices/allConferenceSlice";
import userRoleForConference from "./slices/userRoleForConference";
import userConfereceBasedOnRole from "./slices/userConfereceBasedOnRole";
import submitPaper from "./slices/createSubmission";
import tracksListAndConfDetails from "./slices/tracksListSlice";
import myUniqueConferences from "./slices/myUniqueConferences";

const store = configureStore({
  reducer: {
    conferenceDetail,
    allConferenceList,
    userRoleForConference,
    userConfereceBasedOnRole,
    submitPaper,
    tracksListAndConfDetails,
    myUniqueConferences,
  },
});

export default store;
