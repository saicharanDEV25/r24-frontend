import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import AIChatBot from "./components/AIChatBot/AIChatBot";
import InstagramButton from "./components/Instagram/InstagramButton";
import WhatsAppButton from "./components/WhatsApp/WhatsAppButton";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";
import { getOrCreateDeviceId } from "./utils/deviceId";
import api from "./services/api";

const HEARTBEAT_INTERVAL_MS = 45 * 1000;

function App() {

  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const visitorId = getOrCreateDeviceId();

    // once per tab session — survives background/minimize, resets on tab close
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
      <AppRoutes />

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
    </CustomerAuthProvider>
  );
}

export default App; 