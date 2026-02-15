

// import jwt from "jsonwebtoken";
// import { asycHandler } from "../middlewares/asyncHandler.js";
// import ErrorHandler from "../middlewares/error.js";
// import  User  from "../models/userModel.js";

// export const isAuthenticated = asycHandler(async (req, res, next) => {
//   const { token } = req.cookies;

//   if (!token) {
//     return next(new ErrorHandler("Please login to access this resource.", 401));
//   }

//   // Verify JWT
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);

//   // Find user by ID
//   req.user = await User.findById(decoded.id).select(
//     "-resetPasswordToken -resetPasswordExpire"
//   );

//   if (!req.user) {
//     return next(new ErrorHandler("User not found with this id.", 404));
//   }

//   next();
// });






// import jwt from "jsonwebtoken";
// import { asycHandler } from "../middlewares/asyncHandler.js";
// import ErrorHandler from "../middlewares/error.js";
// import User from "../models/userModel.js";

// export const isAuthenticated = asycHandler(async (req, res, next) => {
//   const { token } = req.cookies;

//   if (!token) {
//     return next(new ErrorHandler("Please login to access this resource.", 401));
//   }

//   let decoded;
//   try {
//     // Use the same secret as in your User model
//     decoded = jwt.verify(token, process.env.JWT_SECRET); 
//   } catch (err) {
//     return next(new ErrorHandler("Token is invalid or expired.", 401));
//   }

//   // Find user by ID
//   const user = await User.findById(decoded.id).select(
//     "-resetPasswordToken -resetPasswordExpire -password"
//   );

//   if (!user) {
//     return next(new ErrorHandler("User not found with this ID.", 404));
//   }

//   req.user = user;
//   next();
// });




// import jwt from "jsonwebtoken";
// import User from "../models/userModel.js";

// const authMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     // Check header
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "Not Authorized. Please login again.",
//       });
//     }

//     // Extract token
//     const token = authHeader.split(" ")[1];

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Get user
//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     // Attach user
//     req.user = user;
//     req.userId = user._id;

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token.",
//     });
//   }
// };

// export default authMiddleware;



// import jwt from "jsonwebtoken";
// import User from "../models/userModel.js";

// const authMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "Not Authorized. Please login again.",
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     req.user = user;        // for /me, logout
//     req.userId = user._id;  // for orders

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token",
//     });
//   }
// };

// export default authMiddleware;

import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Please login again.",
      });
    }

    const token = authHeader.split(" ")[1];

    // 🔍 ADD THIS LINE
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;


