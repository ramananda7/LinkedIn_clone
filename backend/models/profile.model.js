import mongoose from "mongoose";
const edcationSchema = new mongoose.Schema({
    school:{
        type:String,
        default:""
    },
    degree:{
         type:String,
        default:""
    },
    fieldOfStudy:{
        type:String,
       default:""
   }
});
const workSchema = new mongoose.Schema({
    company:{
        type:String,
        default:""
    },
    position:{
         type:String,
        default:""
    },
    years:{
        type:String,
       default:""
   }
});
const profileSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    bio:{
         type:String,
        default:""
    },
    currentpost:{
        type:String,
        default:""
   },
   PastWork:{
        type:[workSchema],
        default:[]
   },
   education:{
       type:[edcationSchema],
       default:[]
   }
});

export default mongoose.model("Profile" , profileSchema);