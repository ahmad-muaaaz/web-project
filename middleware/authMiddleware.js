import JWT from 'jsonwebtoken'
import userModel from '../models/userModel.js';

//ProtectedRoute token based

export const requireSignIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization; // Assuming the token is included in headers
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    }

    const decoded = JWT.verify(token, process.env.SECRET);

    // Assuming your JWT payload contains user information
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};


//middleware

export const isAdmin = async (req, res, next) => {
    try {
      const user = await userModel.findById(req.user._id);
      if (user.role!== 1) {
        return res.status(401).send({
          success: false,
          message: "Unauthorized Access",
        });
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(401).send({
        success: false,
        error,
        message: "Error in admin middleware",
      });
    }
  };