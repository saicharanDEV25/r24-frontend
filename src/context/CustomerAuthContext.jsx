import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    const saved = localStorage.getItem("customer");
    return saved ? JSON.parse(saved) : null;
  });

  const [favorites, setFavorites] = useState([]);

  const loadFavorites = async () => {
    try {
      const res = await api.get("/favorites");
      setFavorites(res.data);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  useEffect(() => {
    if (customer) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer?.id]);

  const requestOtp = async (phoneNumber) => {
    const res = await api.post("/auth/customer/request-otp", {
      phoneNumber,
    });
    return res.data;
  };

  const verifyOtp = async (phoneNumber, code) => {
    const res = await api.post("/auth/customer/verify-otp", {
      phoneNumber,
      code,
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("customer", JSON.stringify(res.data.customer));
    setCustomer(res.data.customer);

    return res.data.customer;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
    setCustomer(null);
  };

  const updateCustomer = (updated) => {
    localStorage.setItem("customer", JSON.stringify(updated));
    setCustomer(updated);
  };

  const isFavorite = (productId) =>
    favorites.some((p) => p.id === productId);

  const toggleFavorite = async (product) => {
    if (!customer) return false;

    const currentlyFavorite = isFavorite(product.id);

    setFavorites((prev) =>
      currentlyFavorite
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );

    try {
      if (currentlyFavorite) {
        await api.delete(`/favorites/${product.id}`);
      } else {
        await api.post(`/favorites/${product.id}`);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      loadFavorites();
    }

    return !currentlyFavorite;
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        requestOtp,
        verifyOtp,
        logout,
        updateCustomer,
        favorites,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  return useContext(CustomerAuthContext);
}
