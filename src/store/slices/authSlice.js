import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { AUTH_TOKEN } from "constants/AuthConstant";
// import FirebaseService from "services/FirebaseService";
import API from "services/Api";

export const initialState = {
  loading: false,
  message: "",
  showMessage: false,
  redirect: "",
  token: localStorage.getItem("AUTH_TOKEN") || null,
  userDetails: JSON.parse(localStorage.getItem("userDetails")) || null, // Store user details
};

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (data, { rejectWithValue }) => {
    const { email, password, otp } = data;
    // const identifier = email;
    try {
      console.log("Sending login request...");
      const response = await API("/user/login/", "POST", {
        email,
        password,
        otp,
      });
      console.log("Response:", response);
      if (response.status === "success") {
        const token = response.data.jwt_token;
        console.log("token", token);
        // Extract user profile information
        const profile = {
          id: response.data.id,
          email: response.data.email,
          name: response.data.full_name,
          avatar: response.data.photo,
          roles: response.data.roles,
          permissions: response.data.roles[0].permissions,
        };
        localStorage.setItem("AUTH_TOKEN", token);
        localStorage.setItem("userDetails", JSON.stringify(profile));

        return {
          token,
          profile, // Return roles and permissions to store in Redux
        };
      } else {
        const error_msg = response.data["non_field_errors"][0];
        if (error_msg === "OTP sent. Please verify.") {
          return rejectWithValue(`${error_msg}`);
        }
        return rejectWithValue(`Login failed. ${error_msg}`);
      }
    } catch (err) {
      console.error("Error during login request:", err);
      return rejectWithValue(err.response?.data?.msg || "Error");
    }
  }
);
export const signUp = createAsyncThunk(
  "auth/signUp",
  async (data, { rejectWithValue }) => {
    const { email, password } = data;
    try {
      const response = API("register", "POST", { email, password });
      // const response = await FirebaseService.signUpEmailRequest(
      //   email,
      //   password
      // );
      if (response.user) {
        const token = response.user.refresh_token;
        // localStorage.setItem(AUTH_TOKEN, token);
        return token;
      } else {
        return rejectWithValue(response.message?.replace("Firebase: ", ""));
      }
    } catch (err) {
      return rejectWithValue(err.message || "Error");
    }
  }
);

export const signOut = createAsyncThunk("auth/signOut", async () => {
  //   const response = await AuthService.signOutRequest();
  localStorage.removeItem("AUTH_TOKEN");
  localStorage.removeItem("userDetails");

  const response = { message: "Logged out successfully" };

  return response.message;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticated: (state, action) => {
      state.loading = false;
      state.redirect = "/";
      state.token = action.payload;
      state.userDetails = action.payload.profile;
    },
    showAuthMessage: (state, action) => {
      state.message = action.payload;
      state.showMessage = true;
      state.loading = false;
      state.userDetails = null;
    },
    hideAuthMessage: (state) => {
      state.message = "";
      state.showMessage = false;
    },
    signOutSuccess: (state) => {
      state.loading = false;
      state.token = null;
      state.redirect = "/";
    },
    showLoading: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.loading = false;
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;        
        state.redirect = "/";
        state.token = action.payload;
        state.userDetails = action.payload.profile;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.userDetails = null;
        state.redirect = "/";
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.redirect = "/";
        state.token = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      });
  },
});
export const {
  authenticated,
  showAuthMessage,
  hideAuthMessage,
  signOutSuccess,
  showLoading,
  signInSuccess,
} = authSlice.actions;

export default authSlice.reducer;
