import { Router } from "express";
import { register , login , uploadProfilePicture, updateUserProfile, getUserAndProfile, updateProfileData, getAllUserProfile, downloadProfile, sendConnectionRequest, getMyConnectionRequest, whoSentMeConnections, accecptConnectionRequest, getUserByUsername, getConnected } from "../controllers/user.controller.js";
import multer from  "multer";
const router = Router();

const storage = multer.diskStorage({
    destination:(req,res,cb)=>{
         cb(null,'uploads/');
    },
    filename:(req,res,cb)=>{
      cb(null,res.originalname);
    }
});
const upload = multer({storage : storage});
router.route('/uploads_profile_picture').post(upload.single('profilePicture'),uploadProfilePicture);
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/updateUserProfile').post(updateUserProfile);
router.route('/get_user_and_profile').get(getUserAndProfile);
router.route('/update_Profile_Data').post(updateProfileData);
router.route('/user/getAllUsers').get(getAllUserProfile);
router.route('/user/download_resume').get(downloadProfile);
router.route('/user/send_connection_request').get(sendConnectionRequest);
router.route('/user/getConnectionRequest').post(getMyConnectionRequest);
router.route('/user/user_me_ConnectionreqUest').post(whoSentMeConnections);
router.route('/user/accecptConnectionRequest').post(accecptConnectionRequest);
router.route('/user/getConnected').post(getConnected);
router.route('/user/getUserByUsername').get(getUserByUsername);

export default router;
