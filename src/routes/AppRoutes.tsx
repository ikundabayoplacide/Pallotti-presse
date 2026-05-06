import { Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import AboutPage from "../pages/AboutPage";
import BlogPage from "../pages/BlogPage";
import ContactPage from "../pages/ContactPage";
import LandingPage from "../pages/LandingPage";
import PortfolioPage from "../pages/PortfolioPage";
import ServicesPage from "../pages/ServicesPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="contact" element={<ContactPage />} />
        {/* Add more routes here as needed */}
      </Route>
    </Routes>
  );
}
