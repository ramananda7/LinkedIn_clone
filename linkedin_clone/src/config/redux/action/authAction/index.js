import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { use } from "react";
import { useDispatch } from "react-redux";

export const login  = createAsyncThunk(
    "user/login",
    async(user , thunkAPI)=>{
        try {
            const response = await clientServer.post(`/login`,{
                email:user.email,
                password : user.password
            })
            if (response.data.token) {
                localStorage.setItem("token",response.data.token)
            } else {
                return thunkAPI.rejectWithValue({message : "token not provided"})
            }
            return thunkAPI.fulfillWithValue(response.data.token)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)
export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/register", {
        username: user.username,
        password: user.password,
        email: user.email,
        name: user.name,
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue( error.response.data );
    }
  }
);
export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (user, thunkAPI) => {
    try {
    // console.log(use.token)
      const response = await clientServer.get("/get_user_and_profile", {
        params: { token: user.token }
      });
   //  console.log(response.data)
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const getAllUsers = createAsyncThunk(
  "auth/getAll_Users",
  async (user, thunkAPI) => {
    try {
      
       const response = await clientServer.get("/user/getAllUsers");
    // console.log(response.data)
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const getConnectionRequest = createAsyncThunk(
  "user/getConnectionRequest",
  async(userData , thunkAPI)=>{
     try {
       const response = await clientServer.post("/user/getConnectionRequest",{
        token: userData.token
       })
       return thunkAPI.fulfillWithValue(response.data)
     } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
      
     }
  }
)
export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (userData, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/send_connection_request", {
        params: {
          token: userData.token,
          connectionId: userData.connectionId,
        },
      });

      // Optionally await it (if it returns a promise)
      await thunkAPI.dispatch(getConnectionRequest({ token: userData.token }));

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const user_me_ConnectionreqUest = createAsyncThunk(
  "user/user_me_ConnectionreqUest",
  async(data ,thunkAPI)=>{
    try {
       const response = await clientServer.post("user/user_me_ConnectionreqUest",{
          token: data.token
       })
       return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
)
export const accecptConnectionRequest = createAsyncThunk(
  "post/accecptConnectionRequest",
  async(user,thunkAPI)=>{
     try {
        const response =  await clientServer.post("user/accecptConnectionRequest",{
          token : user.token,
          requestId :user.requestId,
          actionType : user.action
        })
      await thunkAPI.dispatch(getConnectionRequest({ token: user.token }));
      await thunkAPI.dispatch(user_me_ConnectionreqUest({ token: user.token }));
        return thunkAPI.fulfillWithValue(response.data)
     } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
      
     }
  }
)

export const getConnected = createAsyncThunk(
  "post/getConnected",
  async(user,thunkAPI)=>{
     try {
        const response =  await clientServer.post("user/getConnected",{
          token : user.token,
        })
        return thunkAPI.fulfillWithValue(response.data)
     } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
      
     }
  }
)

export const changingNameAndEmail = createAsyncThunk(
  "user/updateProfile",
  async (newUserData, thunkAPI) => {
    try {
      const response = await clientServer.post("/updateUserProfile", newUserData);
      await thunkAPI.dispatch(getAboutUser({ token: newUserData.token }));
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

