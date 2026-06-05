import { useState } from "react";
import { HiArrowRightOnRectangle, HiBars3, HiBookOpen, HiDocumentText, HiEnvelope, HiHome, HiInformationCircle, HiLockClosed, HiOutlinePhoto, HiQuestionMarkCircle, HiStar, HiUserGroup, HiXMark } from "react-icons/hi2";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../app/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Logo from "../assets/pplogo.png";

const menuItems = [
  { icon: HiHome, label: "Dashboard", to: "/admin/dashboard" },
  { icon: HiInformationCircle, label: "About", to: "/admin/about" },
  { icon: HiDocumentText, label: "Services", to: "/admin/services" },
  { icon: HiDocumentText, label: "Portfolio", to: "/admin/portfolio" },
  { icon: HiDocumentText, label: "Blog Posts", to: "/admin/blog" },
  { icon: HiBookOpen, label: "Publications", to: "/admin/publications" },
  { icon: HiOutlinePhoto, label: "Gallery", to: "/admin/gallery" },
  { icon: HiUserGroup, label: "Partners", to: "/admin/partners" },
  { icon: HiStar, label: "Testimonials", to: "/admin/testimonials" },
  { icon: HiQuestionMarkCircle, label: "FAQs", to: "/admin/faqs" },
  { icon: HiEnvelope, label: "Messages", to: "/admin/messages" },
  { icon: HiLockClosed, label: "Change Password", to: "/admin/change-password" },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-secondary-200">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex lg:flex-col border-r border-secondary-300/20 bg-primary-800 transition-all duration-300 ${
          isCollapsed ? "lg:w-20" : "lg:w-64"
        }`}
      >
        {/* Logo & Collapse Button */}
        <div className="flex h-16 items-center justify-between border-b border-secondary-300/20 px-4">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <img src={Logo} alt="Logo" className="h-10 w-10 rounded-full" />
              <span className="text-lg font-semibold text-secondary-200">
                Admin Panel
              </span>
            </div>
          )}
          {isCollapsed && (
            <img src={Logo} alt="Logo" className="mx-auto h-10 w-10 rounded-full" />
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-secondary-400 transition hover:text-secondary-200"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            <HiBars3 className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-primary-600 text-secondary-200"
                        : "text-secondary-400 hover:bg-primary-700 hover:text-secondary-200"
                    } ${isCollapsed ? "justify-center" : ""}`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="border-t border-secondary-300/20 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-secondary-400 transition hover:bg-primary-700 hover:text-secondary-200"
            title={isCollapsed ? "Logout" : undefined}
          >
            <HiArrowRightOnRectangle className="h-5 w-5" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-secondary-100/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-secondary-300/20 bg-primary-800 transition-transform duration-300 lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-secondary-300/20 px-4">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Logo" className="h-10 w-10 rounded-full" />
            <span className="text-lg font-semibold text-secondary-200">
              Admin Panel
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-secondary-400 hover:text-secondary-200"
          >
            <HiXMark className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-primary-600 text-secondary-200"
                        : "text-secondary-400 hover:bg-primary-700 hover:text-secondary-200"
                    }`
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="border-t border-secondary-300/20 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-secondary-400 transition hover:bg-primary-700 hover:text-secondary-200"
          >
            <HiArrowRightOnRectangle className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-secondary-300/20 bg-secondary-200 px-4 shadow-sm lg:px-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-secondary-100 lg:hidden"
          >
            <HiBars3 className="h-6 w-6" />
          </button>

          {/* Empty div for spacing on desktop when sidebar toggle is hidden */}
          <div className="hidden lg:block" />

          <div className="ml-auto flex items-center gap-4">
            {user && (
              <span className="hidden text-sm font-medium text-secondary-100 lg:block">
                {user.name}
              </span>
            )}
            <button
              onClick={() => navigate("/")}
              className="text-sm font-medium text-primary-700 transition hover:text-primary-600"
            >
              View Site
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-secondary-200 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
