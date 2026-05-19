import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import NavBar from "./NavBar";
import WhatsappButton from "./WhatsappButton";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-primary-800 text-secondary-200">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsappButton phoneNumber="+250788313617" />
    </div>
  );
}
