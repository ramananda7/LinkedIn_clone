import { getAboutUser } from "../../action/authAction"
import { allPosts, getAllComments } from "../../action/postAction"

const { createSlice } = require("@reduxjs/toolkit")


const initialState = {
    posts : [],
    isError:false,
    isLoggedIn:false,
    isLoading:false,
    message: "",
    postFetched:false,
    comments:[],
    postId:""
}

const postSlice = createSlice({
    name :"posts",
    initialState,
    reducers : {
       reset: () => initialState,
       resetPostId : (state) =>{
            state.postId = ""
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(allPosts.pending,(state)=>{
            state.isError=true,
            state.message="fetching All posts"
        })
        .addCase(allPosts.fulfilled,(state ,action)=>{
             state.isLoading = false,
             state.isError=false,
             state.postFetched =true,
             state.posts=action.payload.posts.reverse()
        })
         .addCase(allPosts.rejected,(state ,action)=>{
             state.isLoading = false,
             state.isError=true,
             state.postFetched =true,
             state.message=action.payload
        })
         .addCase(getAllComments.fulfilled,(state ,action)=>{
            state.comments=action.payload.comments;
            state.postId = action.payload.comments[0]?.postId || "";

        })
        
    }

})
export const {resetPostId} =postSlice.actions;
export default postSlice.reducer;