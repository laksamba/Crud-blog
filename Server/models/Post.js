import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type:String,
        requitred: true,
    },
    content:{
        type:String,
        requitred: true,
    },
    photoPath:{
        type:String,
        requitred: true,
    },
    author:{
        type: mongoose.SchemaTypes.ObjectId, ref: "User"
    },
},{timestamps:true});

export default mongoose.model("Post",PostSchema);