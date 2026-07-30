import { FaWhatsapp } from "react-icons/fa";
import "./WhatsAppButton.css";

export default function WhatsAppButton() {

  const message = encodeURIComponent(
    "Hello R24 Automotive 👋\n\nI visited your website and I'm interested in your services. Please provide me with more details."
  );

  return (
    <div className="floating-whatsapp">
      <a
        href={`https://wa.me/918309560622?text=${message}`}
        target="_blank"
        rel="noreferrer"
      >
        <FaWhatsapp />
      </a>
    </div>
  );
}