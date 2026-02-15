














import { asycHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import User from "../models/userModel.js";
import { sendEmail } from "../services/emailService.js";

// ------------------ REGISTER ------------------
export const registerUser = asycHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  // Case-insensitive email check
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return next(new ErrorHandler("User already exists", 400));
  }

  // Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
  });

  // ------------------ SEND WELCOME EMAIL ------------------
const welcomeMessage = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to Canteen Application</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 0;">
      <tr>
        <td align="center">
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="
              background-color: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 6px 16px rgba(0,0,0,0.1);
              font-family: Arial, Helvetica, sans-serif;
            "
          >
            <!-- Header -->
            <tr>
              <td
                style="
                  background-color: #2f855a;
                  padding: 25px;
                  text-align: center;
                  color: #ffffff;
                "
              >
                <h1 style="margin: 0; font-size: 26px;">
                  Canteen Application 🍽️
                </h1>
                <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">
                  Smart & Easy Food Ordering System
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 35px; color: #333333;">
                <h2 style="margin-top: 0; font-size: 22px;">
                  Hello <span style="color:#2f855a;">${name}</span> 👋
                </h2>

                <p style="font-size: 15px; line-height: 1.8;">
                  Welcome to the <b>Canteen Application</b>! We’re happy to have
                  you as part of our community.
                </p>

                <p style="font-size: 15px; line-height: 1.8;">
                  Your account has been successfully created using this email
                  address. You can now browse the menu, place orders, and enjoy
                  a smooth and queue-free canteen experience.
                </p>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 35px 0;">
                  <a
                    href="https://your-app-url.com/login"
                    style="
                      background-color: #2f855a;
                      color: #ffffff;
                      padding: 14px 36px;
                      text-decoration: none;
                      border-radius: 8px;
                      font-weight: bold;
                      display: inline-block;
                      font-size: 15px;
                    "
                  >
                    Login to Canteen Application
                  </a>
                </div>

                <p style="font-size: 15px; line-height: 1.8;">
                  If you need any help or face issues while using the
                  application, please contact the canteen administration or
                  support team.
                </p>

                <p style="font-size: 15px; margin-bottom: 0;">
                  Enjoy your meals 🍴<br />
                  <b>Canteen Application Team</b>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="
                  background-color: #f1f1f1;
                  padding: 18px;
                  text-align: center;
                  font-size: 12px;
                  color: #777777;
                "
              >
                This is an automated message sent to <b>${email}</b>.<br />
                © ${new Date().getFullYear()} Canteen Application. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;


  // Email send should NOT block signup if it fails
  sendEmail({
    to: user.email,
    subject: "Welcome to Canteen App 🎉",
    message: welcomeMessage,
  }).catch((err) => console.error("Welcome email failed:", err.message));

  // Generate JWT
  const token = user.generateToken();

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
  });
});

// ------------------ LOGIN ------------------
export const login = asycHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const token = user.generateToken();

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    token,
  });
});

// ------------------ LOGOUT ------------------
export const logout = asycHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
    .json({ success: true, message: "Logged out successfully" });
});

// ------------------ GET USER ------------------
export const getUser = asycHandler(async (req, res, next) => {
  res.status(200).json({ success: true, user: req.user });
});

// ------------------ FORGET PASSWORD (SEND OTP) ------------------
export const forgetPasswordOTP = asycHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  user.resetOTP = otp;
  user.resetOTPExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save({ validateBeforeSave: false });

  // Send OTP email
  await sendEmail({
    to: user.email,
    subject: "Canteen App Password Reset OTP",
    message: `
      <p>Your OTP is <b>${otp}</b></p>
      <p>This OTP will expire in <b>15 minutes</b>.</p>
    `,
  });

  res.status(200).json({
    success: true,
    message: `OTP sent to ${user.email}`,
  });
});

// ------------------ RESET PASSWORD USING OTP ------------------
export const resetPasswordWithOTP = asycHandler(async (req, res, next) => {
  const { email, otp, password, confirmPassword } = req.body;

  if (!email || !otp || !password || !confirmPassword) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
    resetOTP: Number(otp),
    resetOTPExpire: { $gt: Date.now() },
  }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid or expired OTP", 400));
  }

  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password and confirm password do not match", 400)
    );
  }

  user.password = password;
  user.resetOTP = undefined;
  user.resetOTPExpire = undefined;
  await user.save();

  const token = user.generateToken();

  res.status(200).json({
    success: true,
    message: "Password reset successful",
    token,
  });
});
