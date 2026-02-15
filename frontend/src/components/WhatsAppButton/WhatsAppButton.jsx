import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import "./WhatsAppButton.css"; // import the CSS file

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/7849047603"
      target="_blank"
      rel="noopener noreferrer"
      title="Chat with us on WhatsApp"
      className="whatsapp-button"
    >
      <FaWhatsapp size={26} className="whatsapp-icon" />
    </a>
  );
}
