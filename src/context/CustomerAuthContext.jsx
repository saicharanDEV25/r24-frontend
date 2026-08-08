import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { getOrCreateDeviceId } from "../utils/deviceId";

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    const saved = localStorage.getItem("customer");
    return saved ? JSON.parse(saved) : null;
  });

  const [favorites, setFavorites] = useState([]);

  // No login step: every device gets a stable anonymous id (see
  // utils/deviceId), and this exchanges it for a session + Customer row on
  // first load — creating one on the backend the first time this device is
  // seen. Same browser next time -> same customer, favorites/garage intact.
  useEffect(() => {
    const startSession = async () => {
      try {
        const deviceId = getOrCreateDeviceId();
        const res = await api.post("/customers/session", { deviceId });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("customer", JSON.stringify(res.data.customer));
        setCustomer(res.data.customer);
      } catch (error) {
        console.error("Error starting customer session:", error);
      }
    };

    startSession();
  }, []);

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
