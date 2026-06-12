import { Route, Routes } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import Layout from "../components/Layout";
import AboutPage from "../pages/AboutPage";
import AdminAbout from "../pages/admin/AdminAbout";
import AdminBlog from "../pages/admin/AdminBlog";
import AdminChangePassword from "../pages/admin/AdminChangePassword";
import AdminDepartments from "../pages/admin/AdminDepartments";
import AdminFAQs from "../pages/admin/AdminFAQs";
import AdminGallery from "../pages/admin/AdminGallery";
import AdminHeroSlides from "../pages/admin/AdminHeroSlides";
import AdminMessages from "../pages/admin/AdminMessages";
import AdminPartners from "../pages/admin/AdminPartners";
import AdminPortfolio from "../pages/admin/AdminPortfolio";
import AdminPublicationAccess from "../pages/admin/AdminPublicationAccess";
import AdminPublications from "../pages/admin/AdminPublications";
import AdminServices from "../pages/admin/AdminServices";
import AdminTestimonials from "../pages/admin/AdminTestimonials";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminDashboard from "../pages/AdminDashboard";
import BlogPage from "../pages/BlogPage";
import BlogPostPage from "../pages/BlogPostPage";
import ContactPage from "../pages/ContactPage";
import GalleryPage from "../pages/GalleryPage";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import PortfolioPage from "../pages/PortfolioPage";
import PublicationDetailPage from "../pages/PublicationDetailPage";
import PublicationsPage from "../pages/PublicationsPage";
import ServicesPage from "../pages/ServicesPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes with Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:id" element={<BlogPostPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="publications" element={<PublicationsPage />} />
        <Route path="publications/:id" element={<PublicationDetailPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      {/* Auth Routes - No Layout */}
      <Route path="login" element={<LoginPage />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="admin" element={<DashboardLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="hero-slides" element={<AdminHeroSlides />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="departments" element={<AdminDepartments />} />
          <Route path="portfolio" element={<AdminPortfolio />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="publications" element={<AdminPublications />} />
          <Route path="publication-access" element={<AdminPublicationAccess />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="partners" element={<AdminPartners />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="faqs" element={<AdminFAQs />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="change-password" element={<AdminChangePassword />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Route>
    </Routes>
  );
}
