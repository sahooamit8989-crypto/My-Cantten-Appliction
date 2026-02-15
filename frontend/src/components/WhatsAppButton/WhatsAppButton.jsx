import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import "./WhatsAppButton.css"; // import the CSS file

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/7849047603?text=Greetings%2C%20I%20am%20interested%20in%20learning%20Odissi%20and%20would%20like%20more%20details%20about%20classes%20and%20admissions."
      target="_blank"
      rel="noopener noreferrer"
      title="Chat with us on WhatsApp"
      className="whatsapp-button"
    >
      <FaWhatsapp size={26} className="whatsapp-icon" />
    </a>
  );
}
