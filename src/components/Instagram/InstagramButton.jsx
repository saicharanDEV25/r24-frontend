import { FaInstagram } from "react-icons/fa";
import "./InstagramButton.css";

export default function InstagramButton() {
  return (
    <div className="floating-instagram">
      <a
        href="https://www.instagram.com/r24.automotive_/?hl=en"
        target="_blank"
        rel="noreferrer"
      >
        <FaInstagram />
      </a>
    </div>
  );
}