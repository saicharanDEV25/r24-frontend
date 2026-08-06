import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import AIChatBot from "./components/AIChatBot/AIChatBot";
import InstagramButton from "./components/Instagram/InstagramButton";
import WhatsAppButton from "./components/WhatsApp/WhatsAppButton";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";
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

function App() {

  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    api
      .post("/analytics/visit", {
        visitorId: getOrCreateVisitorId(),
        path: window.location.pathname,
      })
      .catch((error) => console.error("Error tracking visit:", error));
  }, []);

  return (
    <CustomerAuthProvider>
      {/* Website Pages */}
      <AppRoutes />

      {/* AI Chatbot */}
      <AIChatBot
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
      />

      {/* Floating Buttons */}
      {!chatOpen && (
        <>
          <InstagramButton />
          <WhatsAppButton />
        </>
      )}
    </CustomerAuthProvider>
  );
}

export default App; 