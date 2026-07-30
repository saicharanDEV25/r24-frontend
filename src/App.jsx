import { useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import AIChatBot from "./components/AIChatBot/AIChatBot";
import InstagramButton from "./components/Instagram/InstagramButton";
import WhatsAppButton from "./components/WhatsApp/WhatsAppButton";

function App() {

  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
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
    </>
  );
}

export default App; 