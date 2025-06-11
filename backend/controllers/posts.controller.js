 import Comment from "../models/comments.model.js";
import ConnectionRequest from "../models/connections.models.js";
import Like from "../models/likes.models.js";
import Post from "../models/posts.model.js";
 import User from "../models/user.model.js";
 
 export const activeCheck = async (req,res) =>{
      return res.status(200).json({message : "running"});
}



export const createPost = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[0] : ""
    });

    await post.save();

    return res.status(200).json({ message: "Post Created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  
  try {
    const posts = await Post.find().populate('userId' , "name username email profilePicture")
    return res.json({posts});

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const  deletePost = async(req,res)=>{
      const { token , post_id} =req.body;
      try {
        const user = await User.findOne({token : token}).select("_id");
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        const post = await Post.findOne({_id : post_id});
        if(!post)  return res.status(404).json({ message: "post not found" });
        
        if(post.userId.toString() != user._id.toString())  return res.status(404).json({ message: "not authorized" });
        await Post.deleteOne({_id:post_id});

         return res.json({message : "post deleted"});
      } catch (error) {
            return res.status(500).json({ message: error.message });
      }
}
export const commentPost = async (req, res) => {
  const { token , post_id , comment } = req.body;

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const post = await Post.findOne({_id : post_id});
    if(!post)  return res.status(404).json({ message: "post not found" });

    const newComment= new Comment({
      userId : user._id,
      postId:post_id,
      body:comment
    });
    await newComment.save();
    console.log(newComment)
    return res.json({ message: "comment Created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getCommentByPost = async (req, res) => {
  const { post_id } = req.query;
  
  if (!post_id) {
    return res.status(400).json({ message: "post_id query parameter is required" });
  }

  try {
    const comments = await Comment.find({ postId: post_id }).populate('userId', 'name profilePicture');
    return res.json({ comments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCommentOfUser = async(req,res)=>{
    const { token, cmt_id } = req.body;

  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const comment = await Comment.findOne({ _id: cmt_id })  
    if(!comment)  return res.status(404).json({ message: " not found" });

if (comment.userId.toString() !== user._id.toString()) {
  return res.status(403).json({ message: "Unauthorized" }); // use 403 instead of 404
}
    await Comment.deleteOne({_id : cmt_id});
    return res.json({ message : "comment deleted " });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
// export const increament_like = async(req,res)=>{
//     const {  post_id } = req.body;

//   try {
//     const post = await Post.findOne({ _id: post_id })  
//     if(!post)  return res.status(404).json({ message: "post  not found" });
//     post.likes=post.likes+1;
//     post.save();
//     return res.json({ message: "liked" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// }
export const incrementLikes = async (req, res) => {
  const { token, post_id } = req.body;

  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let existingLike = await Like.findOne({ userId: user._id, postId: post._id });

    if (existingLike) {
      existingLike.like_status = !existingLike.like_status;

      post.likes += existingLike.like_status ? 1 : -1;
      await existingLike.save();
      await post.save();

      return res.json({ message: "Like status toggled", like_status: existingLike.like_status });
    } else {
      // New like, setting it to true by default
      const newLike = new Like({ userId: user._id, postId: post._id, like_status: true });
      post.likes += 1;

      await newLike.save();
      await post.save();

      return res.json({ message: "Post liked", like_status: true });
    }

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

