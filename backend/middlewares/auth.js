// import jwt from "jsonwebtoken";


// const authMiddleware=async(req,res,next)=>{
//     const {token}=req.headers;
//     if(!token){
//         return res.json({success:false,message:"Not Authorized Login Again"})
//     }
//     try {
//         const token_decode=jwt.verify(token,process.env.JWT_SECRETE);
//         req.body.userId=token_decode.id;
//         next();
//     } catch (error) {
//         console.log(error)
//         res.json({success:false,message:"Error"});
//     }

// }

// export default authMiddleware;












// import jwt from "jsonwebtoken";

// const authMiddleware = async (req, res, next) => {
//   const { token } = req.headers;
//   if (!token) {
//     return res.json({ success: false, message: "Not Authorized. Please login again." });
//   }

//   try {
//     // Use the correctly spelled environment variable
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Attach userId to req so controllers can access it
//     req.userId = decoded.id;

//     next();
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: "Invalid or expired token" });
//   }
// };

// export default authMiddleware;







// import jwt from "jsonwebtoken";

// const authMiddleware = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({
//       success: false,
//       message: "Not Authorized. Please login again.",
//     });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // attach user id
//     req.userId = decoded.id;

//     next();
//   } catch (error) {
//     console.error(error);
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token",
//     });
//   }
// };

// export default authMiddleware;




// import jwt from "jsonwebtoken";

// const authMiddleware = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({
//       success: false,
//       message: "Not Authorized. Please login again.",
//     });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.id;
//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token",
//     });
//   }
// };

// export default authMiddleware;
