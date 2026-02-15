import userModel from "../models/userModel.js";
import { sendEmail } from "../services/emailService.js";

// ================================
// SEND OFFER MAIL TO ALL USERS
// ================================
export const sendOfferMailToAllUsers = async (req, res) => {
  try {
    const { subject, title, messageBody, couponCode, expiryDate } = req.body;

    if (!subject || !messageBody) {
      return res.json({
        success: false,
        message: "Subject and message are required",
      });
    }

    // Get all registered users
    const users = await userModel.find({}, "email name");

    if (!users.length) {
      return res.json({
        success: false,
        message: "No users found",
      });
    }

    // =====================
    // Dynamic Email Template
    // =====================
    const createEmailTemplate = (userName) => `
      <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
        <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:12px;">
          
          <h2 style="color:#27ae60; text-align:center;">
            ${title || "Special Offer For You 🎉"}
          </h2>

          <p>Dear <strong>${userName}</strong>,</p>

          <p style="font-size:15px; line-height:1.6;">
            ${messageBody}
          </p>

          ${
            couponCode
              ? `
              <div style="margin:25px 0; text-align:center;">
                <span style="
                  background:#27ae60;
                  color:white;
                  padding:12px 25px;
                  border-radius:8px;
                  font-size:20px;
                  letter-spacing:2px;
                ">
                  ${couponCode}
                </span>
              </div>
            `
              : ""
          }

          ${
            expiryDate
              ? `<p style="color:#e74c3c;"><b>Valid Till:</b> ${expiryDate}</p>`
              : ""
          }

          <hr style="margin:30px 0;" />

          <p style="text-align:center; color:#777;">
            Thank you for being with us ❤️
          </p>

          <p style="text-align:center;">
            <b>${process.env.CANTEEN_NAME || "Canteen Team"}</b>
          </p>

        </div>
      </div>
    `;

    // =====================
    // Send Mail To All Users
    // =====================
    let successCount = 0;

    for (const user of users) {
      try {
        const emailHTML = createEmailTemplate(user.name || "Customer");

        await sendEmail({
          to: user.email,
          subject,
          message: emailHTML,
        });

        successCount++;
      } catch (err) {
        console.log("Failed for:", user.email);
      }
    }

    res.json({
      success: true,
      message: `Offer email sent to ${successCount} users`,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Failed to send offer emails",
    });
  }
};
