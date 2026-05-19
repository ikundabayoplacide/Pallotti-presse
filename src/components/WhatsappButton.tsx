import { FaWhatsapp } from "react-icons/fa";

interface WhatsappButtonProps {
  phoneNumber: string;  // e.g. "250788313617" — no + or spaces
  message?: string;     // pre-filled message (optional)
}

export default function WhatsappButton({
  phoneNumber,
  message = "Hello! I'd like to inquire about your printing services.",
}: WhatsappButtonProps) {
  const encodedMessage = encodeURIComponent(message);
  const href = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="whatsapp-pulse whatsapp-bounce fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_4px_20px_rgba(37,211,102,0.5)] transition-transform duration-200 hover:scale-110 sm:bottom-8 sm:right-8"
    >
      <FaWhatsapp className="h-8 w-8 text-white" />
      {/* Ripple ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping" />
    </a>
  );
}
