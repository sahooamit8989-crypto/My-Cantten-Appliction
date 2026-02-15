




import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const FoodItem = ({ id, name, price, description, image }) => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    url,
    token, // 👈 token means user logged in
  } = useContext(StoreContext);

  const itemCount = cartItems?.[id] || 0;

  // 🔒 Check login before action
  const handleAdd = () => {
    if (!token) {
      toast.error("Please create an account or login first");
      return;
    }
    addToCart(id);
    toast.success(`item added to cart`);
  };

  const handleRemove = () => {
    if (!token) {
      toast.error("Please login to manage cart");
      return;
    }
    removeFromCart(id);
    toast.info(`item removed from cart`);
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={`${url}/images/${image}`}
          alt={name}
        />

        {itemCount === 0 ? (
          <img
            className="add"
            onClick={handleAdd}
            src={assets.add_icon_white}
            alt="add"
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={handleRemove}
              src={assets.remove_icon_red}
              alt="remove"
            />
            <p>{itemCount}</p>
            <img
              onClick={handleAdd}
              src={assets.add_icon_green}
              alt="add"
            />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">₹{price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
