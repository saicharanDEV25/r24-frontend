import { createContext, useContext, useEffect, useRef, useState } from "react";
import api from "../services/api";
import { useCustomerAuth } from "./CustomerAuthContext";
import { playNotificationSound } from "../utils/notificationSound";

const NotificationContext = createContext(null);

const POLL_INTERVAL_MS = 15 * 1000;
const TOAST_LIFETIME_MS = 7 * 1000;
const MAX_HISTORY = 20;

export function NotificationProvider({ children }) {
  const { customer } = useCustomerAuth();
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const prevStatuses = useRef(null);

  const pushNotification = (message) => {
    const entry = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      read: false,
      createdAt: Date.now(),
    };

    setNotifications((prev) => [entry, ...prev].slice(0, MAX_HISTORY));
    setToasts((prev) => [...prev, entry]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== entry.id));
    }, TOAST_LIFETIME_MS);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const checkBookingUpdates = async () => {
    if (!customer) return;

    try {
      const res = await api.get("/bookings/my");
      const bookings = res.data || [];

      const current = {};
      bookings.forEach((b) => {
        current[b.id] = b.status;
      });

      if (prevStatuses.current) {
        let hasNew = false;

        bookings.forEach((b) => {
          const prevStatus = prevStatuses.current[b.id];
          if (prevStatus && prevStatus !== b.status) {
            pushNotification(
              `Your ${b.serviceType} booking is now "${b.status}"`
            );
            hasNew = true;
          }
        });

        if (hasNew) {
          playNotificationSound();
        }
      }

      prevStatuses.current = current;
    } catch (error) {
      console.error("Error checking booking updates:", error);
    }
  };

  useEffect(() => {
    prevStatuses.current = null;
    setNotifications([]);
    setToasts([]);

    if (!customer) return;

    checkBookingUpdates();
    const interval = setInterval(checkBookingUpdates, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer?.id]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, toasts, dismissToast, markAllRead, unreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
