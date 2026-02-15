

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Offer from "../models/Offer.js";
import Stripe from "stripe";
import { sendEmail } from "../services/emailService.js";

const stripe = new Stripe(process.env.STRIPE_SECRET);

export const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    const { items, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }

    // 1️⃣ Calculate original amount
    let originalAmount = 0;
    items.forEach((item) => {
      originalAmount += item.price * item.quantity;
    });

    let discountAmount = 0;
    let finalAmount = originalAmount;

    // 2️⃣ Apply Coupon
    let stripeCouponId = null;

    if (couponCode) {
      const offer = await Offer.findOne({
        couponCode: couponCode.trim().toUpperCase(),
        isActive: true,
      });

      if (offer) {
        const now = new Date();

        if (now >= offer.startDate && now <= offer.endDate) {
          if (originalAmount >= offer.minOrderAmount) {
            if (offer.discountType === "percentage") {
              discountAmount = (originalAmount * offer.discountValue) / 100;

              if (offer.maxDiscountAmount) {
                discountAmount = Math.min(
                  discountAmount,
                  offer.maxDiscountAmount
                );
              }
            } else if (offer.discountType === "flat") {
              discountAmount = offer.discountValue;
            }
          }
        }

        finalAmount = Math.max(originalAmount - discountAmount, 0);

        // Create Stripe Coupon only if discount exists
        if (discountAmount > 0) {
          const coupon = await stripe.coupons.create({
            amount_off: Math.round(discountAmount * 100),
            currency: "inr",
            name: "Order Discount",
          });

          stripeCouponId = coupon.id;
        }
      }
    }

    // 3️⃣ Add Service Fee
    finalAmount += 1;

    // 4️⃣ Save Order
    const newOrder = new orderModel({
      userId: req.userId,
      items,
      amount: finalAmount,
      originalAmount,
      discountAmount,
      couponCode: couponCode || null,
      payment: false,
      status: "Placed",
    });

    await newOrder.save();

    // 5️⃣ Clear Cart
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    // 6️⃣ Send Email
    try {
      const user = await userModel.findById(req.userId);

      const orderItems = items
        .map((i) => `${i.name} x ${i.quantity}`)
        .join(", ");

      const message = `
        <h2>Thank You for Your Order!</h2>
        <p>Dear ${user.name},</p>
        <p>Your order has been received at <strong>My Cantten</strong>.</p>
        <ul>
          <li><strong>Items Ordered:</strong> ${orderItems}</li>
          <li><strong>Total Amount:</strong> ₹${finalAmount}</li>
        </ul>
        <p>We’ll prepare your order shortly.</p>
      `;

      await sendEmail({
        to: user.email,
        subject: "Order Confirmation",
        message,
      });
    } catch (err) {
      console.error(
        "Failed to send order confirmation email:",
        err.message
      );
    }

    // 7️⃣ Stripe Line Items
    const line_items = [
      ...items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      {
        price_data: {
          currency: "inr",
          product_data: { name: "Service Fee" },
          unit_amount: 5 * 100,
        },
        quantity: 1,
      },
    ];

    // 8️⃣ Stripe Session


    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ["card"],
    //   line_items,
    //   mode: "payment",
    //   discounts: stripeCouponId ? [{ coupon: stripeCouponId }] : [],
    //   success_url: `${frontend_url}/verify`,
    //   cancel_url: `${frontend_url}/verify`,
    //   metadata: {
    //     orderId: newOrder._id.toString(),
    //     userId: req.userId.toString(),
    //   },
    // });




  const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items,
  mode: "payment",
  discounts: stripeCouponId ? [{ coupon: stripeCouponId }] : [],
  success_url: `${frontend_url}/verify?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${frontend_url}/verify?session_id={CHECKOUT_SESSION_ID}`,
  metadata: {
    orderId: newOrder._id.toString(),
    userId: req.userId.toString(),
  },
});


    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.error("Place order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to place order",
    });
  }
};

export const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        status: "Processing",
      });

      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};




















// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import Offer from "../models/Offer.js";
// import Stripe from "stripe";
// import { sendEmail } from "../services/emailService.js";

// const stripe = new Stripe(process.env.STRIPE_SECRET);

// // ===============================
// // PLACE ORDER
// // ===============================
// export const placeOrder = async (req, res) => {
//   const frontend_url = "http://localhost:5174";

//   try {
//     const { items, couponCode } = req.body;
//     if (!items || items.length === 0)
//       return res.json({ success: false, message: "Cart is empty" });

//     // 1️⃣ Calculate amounts
//     let originalAmount = 0;
//     items.forEach((item) => {
//       originalAmount += item.price * item.quantity;
//     });

//     let discountAmount = 0;
//     let finalAmount = originalAmount;

//     // 2️⃣ Apply coupon
//     let stripeCouponId = null;
//     if (couponCode) {
//       const offer = await Offer.findOne({
//         couponCode: couponCode.trim().toUpperCase(),
//         isActive: true,
//       });
//       if (offer) {
//         const now = new Date();
//         if (now >= offer.startDate && now <= offer.endDate && originalAmount >= offer.minOrderAmount) {
//           discountAmount =
//             offer.discountType === "percentage"
//               ? Math.min((originalAmount * offer.discountValue) / 100, offer.maxDiscountAmount || Infinity)
//               : offer.discountValue;
//         }
//         finalAmount = Math.max(originalAmount - discountAmount, 0);

//         const coupon = await stripe.coupons.create({
//           amount_off: discountAmount * 100,
//           currency: "inr",
//           name: "Order Discount",
//         });
//         stripeCouponId = coupon.id;
//       }
//     }

//     // 3️⃣ Add service fee
//     finalAmount += 5;

//     // 4️⃣ Save order
//     const newOrder = new orderModel({
//       userId: req.userId,
//       items,
//       amount: finalAmount,
//       originalAmount,
//       discountAmount,
//       couponCode: couponCode || null,
//       payment: false,
//       status: "Placed",
//     });
//     await newOrder.save();

//     // 5️⃣ Clear cart
//     await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

//     // 6️⃣ Send confirmation email
//     try {
//       const user = await userModel.findById(req.userId);
//       const orderItems = items.map(i => `${i.name} x ${i.quantity}`).join(", ");

//       const message = `
//         <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
//           <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 30px;">
//             <h2 style="color: #27ae60; text-align: center;">Thank You for Your Order!</h2>
//             <p style="font-size: 16px; color: #555;">Dear ${user.name},</p>
//             <p style="font-size: 16px; color: #555;">
//               Your order has been received at <strong>My Cantten</strong>:
//             </p>
//             <ul style="font-size: 16px; color: #555; line-height: 1.6;">
//               <li><strong>Items Ordered:</strong> ${orderItems}</li>
//               <li><strong>Total Amount:</strong> ₹${finalAmount}</li>
//             </ul>
//             <p style="font-size: 16px; color: #555;">
//               Your order will be processed shortly.
//             </p>
//             <div style="text-align: center; margin: 25px 0;">
//               <a href="#" style="background-color: #27ae60; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
//                 Track Your Order in App
//               </a>
//             </div>
//             <p style="font-size: 16px; color: #555;">
//               We appreciate your business!
//             </p>
//             <p style="margin-top: 20px; font-size: 16px; color: #555;"><strong>The My Cantten Team</strong></p>
//           </div>
//         </div>
//       `;

//       await sendEmail({ to: user.email, subject: "Order Confirmation", message });
//     } catch (err) {
//       console.error("Failed to send order confirmation email:", err.message);
//     }

//     res.json({ success: true, order: newOrder });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Failed to place order" });
//   }
// };

// ===============================
// ADMIN UPDATE STATUS
// ===============================

// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId, status } = req.body;
//     const order = await orderModel.findById(orderId);
//     if (!order) return res.json({ success: false, message: "Order not found" });

//     order.status = status;
//     await order.save();

//     // Send email
//     try {
//       const user = await userModel.findById(order.userId);
//       const message = `
//         <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
//           <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 30px;">
//             <h2 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">Order Status Update</h2>
//             <p style="font-size: 16px; color: #555;">Dear ${user.name},</p>
//             <p style="font-size: 16px; color: #555;">
//               Your order with ID <strong>${order._id}</strong> is now <strong style="color: #e67e22;">${order.status}</strong>.
//             </p>
//             <div style="text-align: center; margin: 25px 0;">
//               <a href="#" style="background-color: #27ae60; color: #ffffff; text-decoration: none; 
//                  padding: 12px 30px; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
//                  Track Your Order in My Cantten App
//               </a>
//             </div>
//             <p style="font-size: 16px; color: #555;">Thank you for choosing <strong>My Cantten</strong>!</p>
//             <p style="margin-top: 20px; font-size: 16px; color: #555;"><strong>The My Cantten Team</strong></p>
//           </div>
//         </div>
//       `;
//       await sendEmail({ to: user.email, subject: "Order Status Updated", message });
//     } catch (err) {
//       console.error("Failed to send status update email:", err.message);
//     }

//     res.json({ success: true, message: "Status updated", data: order });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };


const statusSteps = ["Placed", "Accepted", "Cooking", "Ready", "Delivered", "Cancelled"];

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    const currentIndex = statusSteps.indexOf(order.status);
    const newIndex = statusSteps.indexOf(status);

    // Only allow next step or cancel
    if (!(newIndex === currentIndex + 1 || status === "Cancelled")) {
      return res.json({
        success: false,
        message: `Cannot skip status. Current: ${order.status}, attempted: ${status}`,
      });
    }

    order.status = status;
    await order.save();

    // Send status update email
    try {
      const user = await userModel.findById(order.userId);
      const message = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color:#f4f6f8">
          <div style="max-width:600px;margin:auto;background:#fff;padding:30px;border-radius:10px;">
            <h2 style="text-align:center;color:#2c3e50">Order Status Updated</h2>
            <p>Dear ${user.name},</p>
            <p>Your order <strong>${order._id}</strong> is now <strong>${order.status}</strong>.</p>
            <div style="text-align:center;margin:20px 0;">
              <a href="#" style="background:#27ae60;color:#fff;padding:12px 25px;border-radius:5px;text-decoration:none;font-weight:bold;">Track Your Order</a>
            </div>
            <p>Thanks for choosing My Cantten!</p>
          </div>
        </div>`;
      await sendEmail({ to: user.email, subject: "Order Status Updated", message });
    } catch (err) {
      console.error("Failed to send email:", err.message);
    }

    res.json({ success: true, message: "Status updated", data: order });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// ===============================
// VERIFY ORDER
// ===============================



// export const verifyOrder = async (req, res) => {
//   const { orderId, success } = req.body;

//   try {
//     if (success === "true") {
//       await orderModel.findByIdAndUpdate(orderId, {
//         payment: true,
//         status: "Processing",
//       });

//       res.json({ success: true, message: "Paid" });
//     } else {
//       await orderModel.findByIdAndDelete(orderId);
//       res.json({ success: false, message: "Not Paid" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// ===============================
// USER ORDERS
// ===============================
export const userOrder = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false, message: "Error fetching orders" });
  }
};

// ===============================
// ADMIN LIST ALL ORDERS
// ===============================
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false, message: "Error fetching all orders" });
  }
};

// ===============================
// ADMIN UPDATE STATUS
// ===============================
// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId, status } = req.body;
//     const order = await orderModel.findById(orderId);

//     if (!order) {
//       return res.json({ success: false, message: "Order not found" });
//     }

//     order.status = status;
//     await order.save();

//     // Send status update email
//     try {
//       const user = await userModel.findById(order.userId);
// const message = `
//   <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
//     <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 30px;">
      
//       <!-- Header -->
//       <h2 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">Order Status Update</h2>
      
//       <!-- Greeting -->
//       <p style="font-size: 16px; color: #555;">Dear ${user.name},</p>
      
//       <!-- Order Status Details -->
//       <p style="font-size: 16px; color: #555;">
//         Your order with ID <strong>${order._id}</strong> has been updated. 
//         Current status: <strong style="color: #e67e22;">${order.status}</strong>.
//       </p>
      
//       <!-- Call-to-Action -->
//       <div style="text-align: center; margin: 25px 0;">
//         <a href="#" style="background-color: #27ae60; color: #ffffff; text-decoration: none; 
//            padding: 12px 30px; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
//            Track Your Order in My Cantten Application
//         </a>
//       </div>
      
//       <!-- Footer -->
//       <p style="font-size: 16px; color: #555;">
//         Thank you for choosing <strong>My Cantten</strong>. We look forward to serving you again!
//       </p>
//       <p style="margin-top: 20px; font-size: 16px; color: #555; text-align: left;">
//         <strong>The My Cantten Team</strong>
//       </p>
//     </div>
//   </div>
// `;

//       await sendEmail({ to: user.email, subject: "Order Status Updated", message });
//     } catch (err) {
//       console.error("Failed to send status update email:", err.message);
//     }

//     res.json({ success: true, message: "Status updated", data: order });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// ===============================
// CANCEL ORDER
// ===============================
export const cancelOrder = async (req, res) => {
  const { orderId } = req.body;

  try {
    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized action" });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({ success: false, message: "Delivered orders cannot be cancelled" });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({ success: false, message: "Order already cancelled" });
    }

    order.status = "Cancelled";
    order.payment = false;
    await order.save();

    // Send cancellation email
    try {
      const user = await userModel.findById(req.userId);
const message = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; 
                box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 30px;">

      <!-- Header -->
      <h2 style="color: #c0392b; text-align: center; margin-bottom: 20px;">Order Cancelled</h2>

      <!-- Greeting -->
      <p style="font-size: 16px; color: #555;">Dear ${user.name},</p>

      <!-- Cancellation Message -->
      <p style="font-size: 16px; color: #555;">
        Your order with ID <strong>${order._id}</strong> has been cancelled successfully. 
        If you have already made a payment, it will be refunded shortly.
      </p>

      <!-- Positive Encouragement -->
      <p style="font-size: 16px; color: #555;">
        We’re sorry we couldn’t serve you this time, but we’d love to see you again soon. 
        <strong>Exciting meals and offers await you in the My Cantten app!</strong>
      </p>

      <!-- Call-to-Action -->
      <div style="text-align: center; margin: 25px 0;">
        <a href="#" style="background-color: #27ae60; color: #ffffff; text-decoration: none; 
           padding: 12px 30px; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
           Browse Our Menu
        </a>
      </div>

      <!-- Footer -->
      <p style="font-size: 16px; color: #555;">
        Thank you for choosing <strong>My Cantten</strong>. We look forward to serving you soon!
      </p>
      <p style="margin-top: 20px; font-size: 16px; color: #555;">
        <strong>The My Cantten Team</strong>
      </p>
    </div>
  </div>
`;

      await sendEmail({ to: user.email, subject: "Order Cancelled", message });
    } catch (err) {
      console.error("Failed to send cancellation email:", err.message);
    }

    res.status(200).json({ success: true, message: "Order cancelled successfully", data: order });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ success: false, message: "Something went wrong while cancelling order" });
  }
};




















