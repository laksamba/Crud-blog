import express from 'express'
import authController from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import postController from '../controllers/postController.js';
import commentController from '../controllers/commentController.js';

const router = express.Router();


// testing

router.get('/test', (req, res) => {
    res.json({ msg: 'test page working' });
  });
  // user

// login
router.post('/login', authController.login);
// register
router.post('/register', authController.register);
// logout
router.post('/logout', auth,authController.logout)
// refresh
router.get('/refresh', authController.refresh)
// 

// blog
// CRUD 
// create 
router.post('/blog',auth,postController.create)
// read all blogs
router.get('/blog/all',auth,postController.getAll);
// get by id
router.get('/blog/:id',auth,postController.getById);

// update
router.put('/blog',auth,postController.update);

// delete
router.delete('/blog/:id',auth,postController.delete);

// comment

// crate comment 
router.post('/comment', auth, commentController.create)
// read comment by blogid
router.get('/comment/:id', auth, commentController.getById)




export default router;