import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getAllUsers, getConnected, getConnectionRequest, login, registerUser, user_me_ConnectionreqUest } from "../../action/authAction";
import { act } from "react";

const initialState = {
    user : null,
    isError:false,
    isSuccess:false,
    isLoggedIn:false,
    isLoading:false,
    isTokenThere:false,
    message: "",
    profileFetched:false,
    connections:[],
    connected:[],
    connectionRequest:[],
    all_users:[],
    all_profiles_fetched :false
}
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        reset:()=> initialState,
        handleLoginUser:(state)=>   {state.message= "hello"},
        emptyMessgae:(state)=>   {state.message= ""}  ,
        setTokenIsThere : (state)=>{state.isTokenThere= true },
        setTokenIsNotThere : (state)=>{state.isTokenThere= false } 
    },
    extraReducers:(builder)=>{
        builder
        .addCase(login.pending,(state)=>{
            state.isLoading= true;
            state.message="waiting";
        })
        .addCase(login.fulfilled , (state , action)=>{
            state.isLoading=false;
            state.isError=false;
            state.isSuccess=true;
            state.isLoggedIn=true;
            state.message = "logined successs"
        })
        .addCase(login.rejected , (state , action)=>{
            state.isLoading=false;
            state.isError=true;       
            state.message = action.payload.message;   
        })
        .addCase(registerUser.pending,(state,action)=>{
            state.isLoading=true;
            state.message = "regisetring is pending"
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isError=false;
            state.isSuccess=true;
            state.isLoggedIn=true;
            state.message = "register successs"
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;   
            state.message =  action.payload.message; 
        })
        .addCase(getAboutUser.fulfilled, (state, action) => {
            state.user = action.payload;
            state.profileFetched = true;
            state.isError = false;
            state.isLoggedIn = true;
        })
        .addCase(getAllUsers.fulfilled,(state,action)=>{
                state.all_users = action.payload;
                state.isLoading = false;
                state.isError=false;
                state.all_profiles_fetched=true
        })
            .addCase(getConnectionRequest.fulfilled,(state,action)=>{
                state.connections = action.payload.connections;
            })
            .addCase(user_me_ConnectionreqUest.fulfilled,(state,action)=>{
                state.connectionRequest=action.payload.connections
            })
            .addCase(getConnected.fulfilled,(state,action)=>{
                state.connected=action.payload.connections
            })
    //   const [isConnectionNull , getIsConnectionNull] = useState(false);

    }
})
export const {reset , emptyMessgae , setTokenIsThere ,setTokenIsNotThere} =authSlice.actions;
export default authSlice.reducer;