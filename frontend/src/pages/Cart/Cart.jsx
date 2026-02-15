

import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } =
    useContext(StoreContext);

  const navigate = useNavigate();

  const qtyOf = (id) => (cartItems && cartItems[id] ? cartItems[id] : 0);

  const handleRemove = (id) => {
    removeFromCart(id);
  };

  const itemsInCart = food_list.filter((item) => qtyOf(item._id) > 0);

  return (
    <div className="cart">
      <div className="cart-items">

        {/* ===== HEADER (Desktop Only) ===== */}
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        <hr />

        {itemsInCart.length === 0 ? (
          <div className="cart-empty">Your cart is empty.</div>
        ) : (
          itemsInCart.map((item) => {
            const quantity = qtyOf(item._id);

            return (
              <div key={item._id}>
                <div className="cart-items-item">

                  {/* Image */}
                  <img
                    src={`${url}/images/${item.image}`}
                    alt={item.name}
                  />

                  {/* Details */}
                  <div className="cart-item-details">
                    <p className="item-name">{item.name}</p>

                    <div className="mobile-row">
                      <span>Price:</span>
                      <span>₹{item.price}</span>
                    </div>

                    <div className="mobile-row">
                      <span>Qty:</span>
                      <span>{quantity}</span>
                    </div>

                    <div className="mobile-row">
                      <span>Total:</span>
                      <span>₹{item.price * quantity}</span>
                    </div>
                  </div>

                  {/* Desktop Price */}
                  <p className="desktop-only">₹{item.price}</p>

                  {/* Desktop Qty */}
                  <p className="desktop-only">{quantity}</p>

                  {/* Desktop Total */}
                  <p className="desktop-only">
                    ₹{item.price * quantity}
                  </p>

                  {/* Remove */}
                  <p
                    onClick={() => handleRemove(item._id)}
                    className="cross"
                  >
                    X
                  </p>
                </div>

                <hr />
              </div>
            );
          })
        )}
      </div>

      {/* ===== CART TOTAL ===== */}
      <div className="cart-bottom">
        <div className="carttotal">
          <h2>Cart Total</h2>

          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 5}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ₹
                {getTotalCartAmount() === 0
                  ? 0
                  : getTotalCartAmount() + 5}
              </b>
            </div>
          </div>

          <button
            onClick={() => navigate("/order")}
            disabled={getTotalCartAmount() === 0}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

