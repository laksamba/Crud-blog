import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
     content:{
        type: String,
        required : true
     },
     post:{
        type: mongoose.SchemaTypes.ObjectId, ref : "Post"
    },
    author:{
        type: mongoose.SchemaTypes.ObjectId, ref : "User"
    },
},{timestamps:true});

export default mongoose.model('comment', CommentSchema);