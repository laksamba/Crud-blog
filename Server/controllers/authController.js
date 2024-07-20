import Joi from "joi";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import UserDTO from "../dto/user.js";
import JWTService from "../services/JWTService.js";
import RefreshToken from "../models/token.js";


const authController = {
  async register(req, res, next) {
    // Validate user input
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(3).max(30).required(),
      name: Joi.string().max(30).required(),
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string()
        .pattern(new RegExp(/^[a-zA-Z0-9]{3,30}$/))
        .required(),
      confirmPassword: Joi.ref("password"),
    });

    const { error } = userRegisterSchema.validate(req.body);
    // If error is validation, return error via middleware
    if (error) {
      return next(error);
    }

    // If email or username is already registered, return error
    const { name, username, email, password } = req.body;
    try {
      const emailInUse = await User.exists({ email });
      const usernameInUse = await User.exists({ username });

      if (emailInUse) {
        const error = {
          status: 409,
          message: "Email is already registered, use another email",
        };
        return next(error);
      }
      if (usernameInUse) {
        const error = {
          status: 409,
          message: "Username is already registered, use another username",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Store user data in db
    let accessToken;
    let refreshToken;
    let user;
    try {
      const userToRegister = new User({
        name,
        username,
        email,
        password: hashedPassword,
      });

      user = await userToRegister.save();
      // Token generation
      accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");
      refreshToken = JWTService.signRefreshToken({ _id: user._id }, "1d");
    } catch (error) {
      return next(error);
    }
    // Store refresh token in database
    await JWTService.storeRefreshToken(refreshToken, user._id);

    // Send cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    // Response send
    const userDto = new UserDTO(user);

    return res.status(201).json({ user: userDto, auth: true});
  },

  // For login
  async login(req, res, next) {
    // Validate user input
    const userLoginSchema = Joi.object({
      username: Joi.string().min(3).max(30).required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });

    const { error } = userLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    // Match username and password
    const { username, password } = req.body;
    let user;

    try {
      user = await User.findOne({ username });
      if (!user) {
        const error = {
          status: 401,
          message: "Invalid username",
        };
        return next(error);
      }
      // Hash password match
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        const error = {
          status: 401,
          message: "Incorrect password",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    const accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = JWTService.signRefreshToken({ _id: user._id }, "1d");

    // update refresh token in db

    try {
      await RefreshToken.updateOne(
        {
          _id: user._id
        },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    // Send cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    // Return response
    const userDto = new UserDTO(user);
    return res.status(200).json({ user: userDto, auth: true });
  },

  // logout section function

  async logout(req, res, next){
    console.log(req);
    // delete refresh token from db
    const {refreshToken} = req.cookies;
    try {
      RefreshToken.deleteOne({token: refreshToken});
    } catch (error) {
      return next(error)
    }
    // clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

// resposnse
    res.status(200).json({user:null, auth:false})
  },

  // refresh controller 
  async refresh(req, res, next){
    //  get refresh token form cookies 
    // veriry refresh token 
   

    const originalRefreshToken = req.cookies.refreshToken;
   
    
    let id;
    
    try {
      id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
      console.log(id);
    } catch (e) {
      const error = {
        status:401,
        message: "unauthorized hero"
      }
      return next(error);
    }

    try {
     const match = await RefreshToken.findOne({_id : id, token: originalRefreshToken});
      console.log('hello',match);

      if(!match){
        const error = {
          status: 401,
          message: 'unauthorized'
        }
        return next(error);
      }
    } catch (e) {
      return next(e)
    }
     //generate new token 
    // update in dbm return response 
    try {
      const accessToken = JWTService.signAccessToken({_id: id},'30m')
      const refreshToken = JWTService.signRefreshToken({ _id: id}, "1d");

      await RefreshToken.updateOne({_id: id},{token: refreshToken});

      res.cookie('accessToken',accessToken,{
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly:true
      })
      res.cookie('refreshToken',refreshToken,{
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly:true
      })

    } catch (error) {
      return next(error);
    }
    const user = await User.findOne({_id : id});
    const userDto = new UserDTO(user);

    return res.status(200).json({user: userDto, auth: true})
  },
};

export default authController;
