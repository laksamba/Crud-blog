import Joi from "joi";
import Comment from "../models/Comment.js";
import CommentDTO from "../dto/comment.js";


const commentController = {
    async create(req, res,next){
        const createCommentSchema = Joi.object({
            content : Joi.string().required(),
            author : Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
            post : Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        })

        const {error} = createCommentSchema.validate(req.body);

        if(error){
            return next(error);
        }
        const {content, author, post} = req.body;

        try {
            const newComment = new Comment({
                content,author,post
            });
            await newComment.save();
        } catch (error) {
            return next(error);
        }
        return res.status(201).json({message: 'comment created successfully'})
    },

    // read by id 
    async getById(req, res, next){
        const getByIdSchema = Joi.object({
            id : Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
        });
        const {error} = getByIdSchema.validate(req.params);

        if(error){
            return next(error);
        }
        const {id} = req.params;
        let comments;

        try {
            comments = await Comment.find({post: id}).populate('author','username');
        } catch (error) {
            return next(error);
        }

        let commentsDto = [];

        for(let i=0; i<comments.length; i++){
            const obj = new CommentDTO(comments[i]);
            commentsDto.push(obj);
        }
        return res.status(200).json({data: comments});
    }
}

export default commentController;