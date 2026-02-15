



import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = import.meta.env.VITE_BACKEND_URL;

  // ✅ Token restore from localStorage (IMPORTANT FIX)
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const [food_list, setFoodList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  /* ================= CART ================= */

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      await axios.post(
        `${url}/api/cart/add`,
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) updated[itemId] -= 1;
      else delete updated[itemId];
      return updated;
    });

    if (token) {
      await axios.post(
        `${url}/api/cart/remove`,
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      const product = food_list.find((p) => p._id === item);
      if (product) {
        totalAmount += product.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const getFinalAmount = () => {
    return getTotalCartAmount() - discountAmount;
  };

  const applyCoupon = async (code) => {
    try {
      const res = await axios.post(`${url}/api/offers/apply`, {
        couponCode: code,
        cartTotal: getTotalCartAmount(),
      });

      if (res.data.success) {
        setDiscountAmount(res.data.discount);
        setAppliedCoupon(res.data.offer);
        return { success: true };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      return { success: false, message: "Coupon failed" };
    }
  };

  const fetchFoodList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    setFoodList(response.data.data);
  };

  // ✅ Fetch food list on load
  useEffect(() => {
    fetchFoodList();
  }, []);

  // ✅ EXTRA SAFETY: Sync token if localStorage changes
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && storedToken !== token) {
      setToken(storedToken);
    }
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getFinalAmount,
    applyCoupon,
    discountAmount,
    appliedCoupon,
    url,
    token,
    setToken,
    searchResults,
    setSearchResults,
    searchActive,
    setSearchActive,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
