import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import passportSlice from "./slices/passportSlice";
import planSlice from "./slices/planSlice";
import orderSlice from "./slices/orderSlice";
import knowledgeSlice from "./slices/knowledgeSlice";
import ticketSlice from "./slices/ticketSlice";
import inviteSlice from "./slices/inviteSlice";

const store = configureStore({
  reducer: {
    passport: passportSlice,
    user: userReducer,
    plan: planSlice,
    order: orderSlice,
    knowledge: knowledgeSlice,
    ticket: ticketSlice,
    invite: inviteSlice,
  },
});

export default store;
