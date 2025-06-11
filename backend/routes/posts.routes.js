import {Router} from "express";
import {activeCheck, commentPost, createPost, deleteCommentOfUser, deletePost, getAllPosts, getCommentByPost, incrementLikes} from "../controllers/posts.controller.js"
import multer from  "multer";
const router = Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({storage : storage});

router.route('/post').post(upload.single('media'), createPost);
router.route("/").get(activeCheck);
router.route("/posts").get(getAllPosts);
router.route("/delete_post").delete(deletePost);
router.route("/comment").post(commentPost);
router.route("/getComments").get(getCommentByPost);//getComments
router.route("/delete_comment").post(deleteCommentOfUser);
router.route("/increament_likes").post(incrementLikes);






export default router;