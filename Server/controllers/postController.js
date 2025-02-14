import Joi from 'joi';
import Post from '../models/Post.js';
import PostDTO from '../dto/post.js';
import PostDetailsDTO from '../dto/postDetails.js';
import Comment from '../models/Comment.js';
import cloudinary from '../config/cloudinaryConfig.js';

const postController = {
  async create(req, res, next) {
    const createPostSchema = Joi.object({
      title: Joi.string().required(),
      author: Joi.string().regex(/^[a-zA-Z0-9]{24}$/).required(), // MongoDB ObjectId pattern
      content: Joi.string().required(),
      photo: Joi.string().required(), // Base64 image string
    });

    const { error } = createPostSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { title, author, content, photo } = req.body;

    let photoPath;
    try {
      const uploadResponse = await cloudinary.uploader.upload(photo, {
        folder: 'uploads',
        public_id: `${Date.now()}-${author}`,
        overwrite: true,
        resource_type: 'image',
      });
      photoPath = uploadResponse.secure_url;
    } catch (error) {
      return next(error);
    }

    let newPost;
    try {
      newPost = new Post({
        title,
        author,
        content,
        photoPath,
      });
      await newPost.save();
    } catch (error) {
      return next(error);
    }

    const postDto = new PostDTO(newPost);
    return res.status(201).json({ post: postDto });
  },

  async getAll(req, res, next) {
    try {
      const posts = await Post.find({});
      const postsDto = posts.map(post => new PostDTO(post));
      return res.status(200).json({ posts: postsDto });
    } catch (error) {
      return next(error);
    }
  },

  async getById(req, res, next) {
    const getByIdSchema = Joi.object({
      id: Joi.string().regex(/^[a-zA-Z0-9]{24}$/).required(), // MongoDB ObjectId pattern
    });

    const { error } = getByIdSchema.validate(req.params);
    if (error) {
      return next(error);
    }

    const { id } = req.params;
    let post;
    try {
      post = await Post.findById(id).populate('author');
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
    } catch (error) {
      return next(error);
    }

    const postDetailsDTO = new PostDetailsDTO(post);
    return res.status(200).json({ post: postDetailsDTO });
  },

  async update(req, res, next) {
    const updatePostSchema = Joi.object({
      title: Joi.string(),
      content: Joi.string(),
      author: Joi.string().regex(/^[a-zA-Z0-9]{24}$/).required(), // MongoDB ObjectId pattern
      postId: Joi.string().regex(/^[a-zA-Z0-9]{24}$/).required(), // MongoDB ObjectId pattern
      photo: Joi.string(),
    });

    const { error } = updatePostSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { title, content, author, postId, photo } = req.body;

    let post;
    try {
      post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
    } catch (error) {
      return next(error);
    }

    if (photo) {
      const previousPublicId = post.photoPath.split('/').slice(-1)[0].split('.')[0];
      try {
        await cloudinary.uploader.destroy(`uploads/${previousPublicId}`);
      } catch (error) {
        return next(error);
      }

      let newPhotoPath;
      try {
        const uploadResponse = await cloudinary.uploader.upload(photo, {
          folder: 'uploads',
          public_id: `${Date.now()}-${author}`,
          overwrite: true,
          resource_type: 'image',
        });
        newPhotoPath = uploadResponse.secure_url;
      } catch (error) {
        return next(error);
      }

      post.photoPath = newPhotoPath;
    }

    if (title) post.title = title;
    if (content) post.content = content;

    try {
      await post.save();
    } catch (error) {
      return next(error);
    }

    return res.status(200).json({ message: 'Post updated' });
  },

  async delete(req, res, next) {
    const deletePostSchema = Joi.object({
      id: Joi.string().regex(/^[a-zA-Z0-9]{24}$/).required(), // MongoDB ObjectId pattern
    });

    const { error } = deletePostSchema.validate(req.params);
    if (error) {
      return next(error);
    }

    const { id } = req.params;

    let post;
    try {
      post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const publicId = post.photoPath.split('/').slice(-1)[0].split('.')[0];
      try {
        await cloudinary.uploader.destroy(`uploads/${publicId}`);
      } catch (error) {
        return next(error);
      }

      await Post.deleteOne({ _id: id });
      await Comment.deleteMany({ post: id });
    } catch (error) {
      return next(error);
    }

    return res.status(200).json({ message: 'Post deleted successfully' });
  },
};

export default postController;
