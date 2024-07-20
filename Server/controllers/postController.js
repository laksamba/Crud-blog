import Joi from "joi";
import fs from "fs";
import Post from "../models/Post.js";
import PostDTO from "../dto/post.js";
import { config } from "../config/Config.js";
import PostDetailsDTO from "../dto/postDetails.js";
import Comment from "../models/Comment.js";
// MongoDB ObjectId regex pattern
// const mongodbIdPattern = /^[a-zA-Z0-9]{3,30}$/;

const postController = {
  async create(req, res, next) {
    // validate the req.body
    // photo storage handle
    // add to db
    // return response

    const cratePostSchema = Joi.object({
      title: Joi.string().required(),
      author: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
      content: Joi.string().required(),
      photo: Joi.string().required(),
    });

    const { error } = cratePostSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const { title, author, content, photo } = req.body;

    // read as buffer
    const buffer = Buffer.from(
      photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );

    // alotcate a number
    const imagePath = `${Date.now()}-${author}.png`;
    try {
      fs.writeFileSync(`storage/${imagePath}`, buffer);
    } catch (error) {
      return next(error);
    }

    // save blog in db
    let newPost;
    try {
      newPost = new Post({
        title,
        author,
        content,
        photoPath: `${config.BACKEND_SERVER_PATH}/storage/${imagePath}`,
      });
      await newPost.save();
    } catch (error) {
      return next(error);
    }

    const postDto = new PostDTO(newPost);
    return res.status(201).json({ post: postDto });
  },

  // ----get all post     section here----
  async getAll(req, res, next) {
    try {
      const posts = await Post.find({});

      const postsDto = [];

      for (let i = 0; i < posts.length; i++) {
        const dto = new PostDTO(posts[i]);
        postsDto.push(dto);
      }
      return res.status(200).json({ posts: postsDto });
    } catch (error) {}
  },

  // get by setction----------------------------
  async getById(req, res, next) {
    // validate id
    // response
    const getByIdSchema = Joi.object({
      id: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
    });

    const { error } = getByIdSchema.validate(req.params);

    if (error) {
      return next(error);
    }
    let post;

    const { id } = req.params;

    try {
      post = await Post.findById({ _id: id }).populate("author");
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
    } catch (error) {
      return next(error);
    }

    const postDetailsDTO = new PostDetailsDTO(post);
    return res.status(200).json({ post: postDetailsDTO });
  },

  // ---------update controller here --------------------
  async update(req, res, next) {
    // Validate request body
    const updatePostSchema = Joi.object({
      title: Joi.string(),
      content: Joi.string(),
      author: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
      postId: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
      photo: Joi.string(),
    });

    const { error } = updatePostSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { title, content, author, postId, photo } = req.body;

    let post;
    try {
      post = await Post.findOne({ _id: postId });
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
    } catch (error) {
      return next(error);
    }

    if (photo) {
      let previousPhoto = post.photoPath;

      previousPhoto = previousPhoto.split("/").at(-1);

      // Delete the previous photo
      try {
        fs.unlinkSync(`storage/${previousPhoto}`);
      } catch (error) {
        return next(error);
      }

      // Read the new photo as a buffer
      const buffer = Buffer.from(
        photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );

      // Generate a new image path
      const imagePath = `${Date.now()}-${author}.png`;
      try {
        fs.writeFileSync(`storage/${imagePath}`, buffer);
      } catch (error) {
        return next(error);
      }

      await Post.updateOne(
        { _id: postId },
        {
          title,
          content,
          photoPath: `${config.BACKEND_SERVER_PATH}/storage/${imagePath}`,
        }
      );
    } else {
      await Post.updateOne({ _id: postId }, { title, content });
    }

    return res.status(200).json({ message: "Post updated" });
  },

  //------------ delete section controller here -----------------------
  async delete(req, res, next) {
    // validation

    const deletePostSchema = Joi.object({
      id: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
    });

    const { error } = deletePostSchema.validate(req.params);

    const { id } = req.params;
    // deletion blog
    // delete comment on this post
    try {
      await Post.deleteOne({ _id: id });

      await Comment.deleteMany({ post: id });
    } catch (error) {
      return next(error);
    }
    return res.status(200).json({ message: "post deleted sucessfully" });
  },
};

export default postController;
