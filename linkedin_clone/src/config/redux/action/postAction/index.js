import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const allPosts = createAsyncThunk("posts/allPosts" ,async (user , thunkApi)=>{
     try {
         const response = await clientServer.get("/posts");
         return thunkApi.fulfillWithValue(response.data);
     } catch (error) {
           return thunkApi.rejectWithValue(error.response.data);
     }
});

export const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, thunkApi) => {
    const { file, body } = userData;
    try {
      const formData = new FormData();
      formData.append('token', localStorage.getItem('token'));
      formData.append('body', body);
      formData.append('media', file);

      const response = await clientServer.post("/post", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
       
        return thunkApi.fulfillWithValue("Post uploaded");
      } else {
        return thunkApi.rejectWithValue("Upload failed");
      }

    } catch (error) {
      console.error("Error uploading post:", error);
      return thunkApi.rejectWithValue(
        error.response?.data || "Network or server error"
      );
    }
  }
);
export const delete_post = createAsyncThunk(
  "post/deletePost",
  async(postId ,thunkApi)=>{
    
    try {
      const res = await clientServer.delete("/delete_post",{
        data:{
          token:localStorage.getItem('token'),
          post_id : postId.post_id
        }
      })
      return thunkApi.fulfillWithValue(res.data);
    } catch (error) {
       return thunkApi.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status || 500,
      });
    }
  }
)
export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async(post_id,thunkApi)=>{
    try {
      const response = await clientServer.get("/getComments",{
        params: {
          post_id:post_id.post_id
        }
      })
      return thunkApi.fulfillWithValue({ comments: response.data.comments})
    } catch (error) {
       return thunkApi.rejectWithValue("something went wrong")
    }
  }
)
export const postComment = createAsyncThunk(
  "post/uploadComment",
  async(cmtData,thunkApi)=>{
    try {
      //console.log(cmtData.post_Id)
      const response = await clientServer.post("/comment", {
        token :  localStorage.getItem('token'),
        post_id: cmtData.post_id, 
        comment: cmtData.body 

      })
      return thunkApi.fulfillWithValue(response.data)
    } catch (error) {
      
    }
  }
)
export const deleteComment = createAsyncThunk(
  "post/deleteComment",
  async (cmt, thunkApi) => {
    try {
      const response = await clientServer.post("/delete_comment", {
        token: localStorage.getItem("token"),
        cmt_id: cmt.cmt_id,
      });
      return thunkApi.fulfillWithValue(response.data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || "Delete failed");
    }
  }
);
export const increment_likes = createAsyncThunk(
  "increment_likes",
  async (user, thunkApi) => {
    try {
      const { token, post_id } = user;

      const response = await clientServer.post("/increament_likes", {
        token,
        post_id,
      });

      await thunkApi.dispatch(allPosts());
      return thunkApi.fulfillWithValue(response.data);
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to increment likes"
      );
    }
  }
);

