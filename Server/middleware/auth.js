import JWTService from "../services/JWTService.js";
import User from "../models/User.js";
import UserDTO from "../dto/user.js";

const auth = async (req, res, next) => {
  // refresh token and access token validate
  const { refreshToken, accessToken } = req.cookies;
  try {
    if (!refreshToken || !accessToken) {
    const error = {
      status: 401,
      message: "unauthorized",
    };
    return next(error);
  }

let _id;
  try {

     _id = JWTService.verifyAccessToken(accessToken);

  } catch (error) {

    return next(error);
  }

  let user;
  try {
    user = await User.findOne({_id: _id});

  } catch (error) {
    return next(error)
  }

  const userDto = new UserDTO(user);
  req.user = userDto;
  next();
  } catch (error) {
    return next(error)
  }

  
};

export default auth;
