import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import AIChatBot from "./components/AIChatBot/AIChatBot";
import InstagramButton from "./components/Instagram/InstagramButton";
import WhatsAppButton from "./components/WhatsApp/WhatsAppButton";
import NotificationToasts from "./components/NotificationToasts/NotificationToasts";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import api from "./services/api";

function getOrCreateVisitorId() {
  let visitorId = localStorage.getItem("visitorId");

  if (!visitorId) {
    visitorId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    localStorage.setItem("visitorId", visitorId);
  }

  return visitorId;
}

const HEARTBEAT_INTERVAL_MS = 45 * 1000; // 45 seconds

function App() {

  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const visitorId = getOrCreateVisitorId();

    // Tracked once per tab session — surviving a background/minimize, but
    // reset when the tab is actually closed and reopened.
    if (!sessionStorage.getItem("visitTracked")) {
      api
        .post("/analytics/visit", {
          visitorId,
          path: window.location.pathname,
        })
        .then(() => sessionStorage.setItem("visitTracked", "1"))
        .catch((error) => console.error("Error tracking visit:", error));
    }

    const sendHeartbeat = () => {
      api
        .post("/analytics/heartbeat", { visitorId })
        .catch(() => {});
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <CustomerAuthProvider>
      <NotificationProvider>
        {/* Website Pages */}
        <AppRoutes />

        <NotificationToasts />

        <div className="floating-stack">
          <AIChatBot
            chatOpen={chatOpen}
            setChatOpen={setChatOpen}
          />

          {!chatOpen && (
            <>
              <InstagramButton />
              <WhatsAppButton />
            </>
          )}
        </div>
      </NotificationProvider>
    </CustomerAuthProvider>
  );
}

export default App; 