import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccountResponse } from "../../types";

type State = {
  token: string | null;
  refreshToken: string | null;
  account: AccountResponse | null;
};

const initialState: State = { token: null, refreshToken: null, account: null };

// This auth slice manages the auth state of the application, which includes the access token, refresh token, and user account information.
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthTokens(
      state: State,
      action: PayloadAction<{ token: string; refreshToken: string }>
    ) {
      state.refreshToken = action.payload.refreshToken;
      state.token = action.payload.token;
    },
    setAccount(state: State, action: PayloadAction<AccountResponse>) {
      state.account = action.payload;
    },
    setLogout(state: State) {
      state.account = null;
      state.refreshToken = null;
      state.token = null;
    },
  },
});

export default authSlice;