import { useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import AIChatBot from "./components/AIChatBot/AIChatBot";
import InstagramButton from "./components/Instagram/InstagramButton";
import WhatsAppButton from "./components/WhatsApp/WhatsAppButton";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";

function App() {

  const [chatOpen, setChatOpen] = useState(false);

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