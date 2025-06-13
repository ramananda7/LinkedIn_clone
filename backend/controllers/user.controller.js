import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import PDFDocument from 'pdfkit';
import fs from "fs";
import path from "path";
import ConnectionRequest from "../models/connections.models.js";

// Helper: Generate PDF from profile data
const convertUserDataToPDF = async (userData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const filename = crypto.randomBytes(16).toString("hex") + ".pdf";
      const outputPath = path.join("uploads", filename);
      const stream = fs.createWriteStream(outputPath);

      doc.pipe(stream);

      // Attempt to include profile picture
      try {
        const imagePath = path.join("uploads", userData.userId.profilePicture);
        if (fs.existsSync(imagePath)) {
          doc.image(imagePath, { fit: [100, 100], align: "center" });
          doc.moveDown();
        }
      } catch (imgErr) {
        console.warn("Profile picture error:", imgErr.message);
      }

      // User Info
      doc.fontSize(16).text("User Profile", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).text(`Name: ${userData.userId?.name || "N/A"}`);
      doc.text(`Username: ${userData.userId?.username || "N/A"}`);
      doc.text(`Email: ${userData.userId?.email || "N/A"}`);
      doc.text(`Bio: ${userData.bio || "N/A"}`);
      doc.text(`Current Position: ${userData.currentPosition || "N/A"}`);
      doc.moveDown();

      // Past Work
      if (Array.isArray(userData.PastWork) && userData.PastWork.length > 0) {
        doc.fontSize(14).text("Past Work:", { underline: true });
        doc.moveDown(0.5);
        userData.PastWork.forEach((work, i) => {
          doc.fontSize(12).text(`• Company: ${work.company || "N/A"}`);
          doc.text(`  Position: ${work.position || "N/A"}`);
          doc.text(`  Years: ${work.years || "N/A"}`);
          doc.moveDown(0.5);
        });
      }

      doc.end();

      stream.on("finish", () => resolve(filename));
      stream.on("error", (err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};


export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });

    if (user)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await newUser.save();

    const profile = new Profile({ userId: newUser._id });
    await profile.save();

    return res.status(201).json({ message: "User Created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

  export const login = async (req,res)=>{
     const {email,password}= req.body;
     if(!email || !password)return res.status(400).json({message:"all field are required"});

     const user = await User.findOne({
        email
     });
     if(!user) return  res.status(404).json({message:"user not valid"});
     
     const isMatch=await bcrypt.compare(password,user.password);
     if(!isMatch) return  res.status(404).json({message:"invalid cradential"});

     const token = crypto.randomBytes(32).toString("hex");
     await User.updateOne({_id : user._id} , {token});  
     return res.json({token:token});
  }


  export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "user not found" });

    user.profilePicture = req.file.filename; // fixed typo
    await user.save();

    return res.status(200).json({ message: "profile uploaded" }); // correct status code
  } catch (e) {
    return res.status(500).json({ message: e.message }); // fixed error reference
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    const { token, PastWork, education, username, email, bio } = req.body;

    // Step 1: Find user by token
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Step 2: Update username/email if provided and unique
    if (username || email) {
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (existingUser && String(existingUser._id) !== String(user._id)) {
        return res.status(400).json({ message: "Username or email already exists" });
      }

      if (username) user.username = username;
      if (email) user.email = email;
      await user.save();
    }

    // Step 3: Find Profile
    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    // Step 4: Update PastWork (append if array)
    if (PastWork && Array.isArray(PastWork)) {
      profile.PastWork.push(...PastWork);
    }

    // Step 5: Update education (append if array)
    if (education && Array.isArray(education)) {
      profile.education.push(...education);
    }

    // **Step 6: Update bio (replace with new bio)**
    if (typeof bio === "string") {
      profile.bio = bio;
    }

    // Save profile
    await profile.save();

    return res.status(200).json({ message: "User profile updated" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      'userId',
      'name email username profilePicture'
    );

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    return res.status(200).json(userProfile);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



export const updateProfileData = async (req,res)=>{
      
       try {
          const {token, ...newProfileData} = req.body;
          const user =await  User.findOne({token :token});
          if(!user) return res.status(404).json({message:"user not found"});

          const profile =await Profile.findOne({userId: user._id});
         
          Object.assign(profile, newProfileData);
          await profile.save();
          return res.json({message : "profile updated"})

       } catch (error) {
        return res.status(500).json({ message: error.message });
       }
   }
export const getAllUserProfile = async (req,res)=>{
      
       try {
          const profiles =await Profile.find().populate('userId' ,'name email username profilePicture' );
          return res.json(profiles);

       } catch (error) {
        return res.status(500).json({ message: error.message });
       }
   }
export const downloadProfile = async (req,res)=>{
      
       try {
          const user_id = req.query.id;
          const user_Profile = await Profile.findOne({userId : user_id}).populate('userId' ,'name email username profilePicture' );

          const a= await convertUserDataToPDF(user_Profile);
          return res.json({ message: a });

       } catch (error) {
                return res.status(500).json({ message: error.message });

       }
   }

   export const sendConnectionRequest = async (req,res)=>{
       const {token , connectionId} = req.query;
       try {
          const user = await User.findOne({token});
          if(!user) return res.status(404).json({message:"user not found"});

          const connectionUser = await User.findOne({_id:connectionId});
          if(!connectionUser) return res.status(404).json({message:"reciever user not found"});
 
          const existingConnection = await ConnectionRequest.findOne({
             userId:user._id,
             connectionId:connectionUser._id 
          });
          if(existingConnection) return res.status(200).json({message:"request already sent"});
          
          const request = new ConnectionRequest({
             userId:user._id,
             connectionId:connectionUser._id 
          })
          await request.save();

          return res.json({message : "request sent "});
        } catch (error) {
                return res.status(500).json({ message: error.message });

       }
   }

export const getMyConnectionRequest = async(req,res) =>{
      const {token} = req.body;
      try {
        const user = await User.findOne({token});
        if(!user) return res.status(404).json({message:"user not found"});

        const connections = await ConnectionRequest.find({userId : user._id})
        .populate('connectionId' , 'name username email profilePicture');
       if(!connections) return res.status(404).json({message:"no request found"});

       
        return res.json({ connections}); 

         
      } catch (error) {
        return res.status(500).json({ message: error.message }); 
      }
   }
export const whoSentMeConnections = async(req,res) =>{
      const {token} = req.body;
      try {
        const user = await User.findOne({token});
        if(!user) return res.status(404).json({message:"user not found"});

        const connections = await ConnectionRequest.find({connectionId : user._id})
        .populate('userId' , 'name username email profilePicture');
         if(!connections) return res.status(404).json({message:"no request found"});

        return res.json({ connections}); 

         
      } catch (error) {
        return res.status(500).json({ message: error.message });        
      }
   }

export const accecptConnectionRequest = async(req,res) =>{
      const {token , requestId , actionType} = req.body;
      try {
        const user = await User.findOne({token});
        if(!user) return res.status(404).json({message:"user not found"});

        const connection = await ConnectionRequest.findOne({_id :requestId})
        if(!connection) return res.status(404).json({message:"connection not found"});
      
        if(actionType == "accepted"){
           connection.status_accepted = true;
        }else{
          connection.status_accepted=false;
        }
        await connection.save();
        return res.json({message : "request updated"});
         
      } catch (error) {
          return res.status(500).json({ message: error.message });   
      }
   }
export const getConnected = async(req,res) =>{
      const {token} = req.body;
      try {
        const user = await User.findOne({token});
        if(!user) return res.status(404).json({message:"user not found"});

        const connections = await ConnectionRequest.find({ $or: [
        { userId: user._id },
        { connectionId: user._id }
        ],
        status_accepted: true})
         .populate('userId' , 'name username email profilePicture');
       if(!connections) return res.status(404).json({message:"no request found"});
        return res.json({ connections});     
      } catch (error) {
        return res.status(500).json({ message: error.message }); 
      }
   }
export const getUserByUsername = async(req,res)=>{
      const {username} = req.query;
      try {
         if (!username) {
              return res.status(400).json({ message: "Username is required" });
        }
         const user = await User.findOne({username});
         if(!user)  if(!user) return res.status(404).json({message:"user not found"});
         const userProfile = await Profile.findOne({userId:user._id})
                             .populate('userId' , 'name username email profilePicture')
        return res.json({"profile" : userProfile})
      } catch (error) {
        return res.status(500).json({message : error.message})
      }
   }

