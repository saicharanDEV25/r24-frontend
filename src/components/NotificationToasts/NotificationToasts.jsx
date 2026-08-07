import { FaBell } from "react-icons/fa";
import { useNotifications } from "../../context/NotificationContext";
import "./NotificationToasts.css";

function NotificationToasts() {
  const { toasts, dismissToast } = useNotifications();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="customer-toast-stack">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          className="customer-toast"
          onClick={() => dismissToast(toast.id)}
        >
          <FaBell />
          <span>{toast.message}</span>
        </button>
      ))}
    </div>
  );
}

export default NotificationToasts;
