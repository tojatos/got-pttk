import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthState } from "../constant/AuthState";
import { Login } from "../constant/Login";
import { AppThunk } from "./store";
import { ROLE_URL, TOKEN_URL } from "../constant/Api";

const initialState: AuthState = {
  token: null,
  login: null,
  role: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authLogin: (state, action: PayloadAction<AuthState>) => {
      state.token = action.payload.token;
      state.login = action.payload.login;
      state.role = action.payload.role;
    },
    authLogout: (state) => {
      state.token = null;
      state.login = null;
      state.role = null;
    },
  },
});

export const { authLogin, authLogout } = authSlice.actions;

interface AuthTokens {
  access: string;
  refresh: string;
}

export const authenticate = ({ login, password }: Login): AppThunk => async (
  dispatch
) => {
  try {
    const result = await axios.post(TOKEN_URL, {
      username: login,
      password: password,
    });
    if (result.status === 200) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { access, refresh }: AuthTokens = result.data;
      const roleResult = await axios.get(ROLE_URL, {
        headers: {
          Authorization: "Bearer " + access,
        },
      });
      const role = roleResult.data;
      dispatch(authLogin({ token: access, login, role }));
    }
  } catch (error) {
    console.warn(error);
  }
};

export default authSlice.reducer;
