import { HiChartBar, HiDocumentText, HiEnvelope, HiEye } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useGetBlogsQuery } from "../app/api/blog";
import { useGetMessagesQuery } from "../app/api/messages";
import { useGetPortfolioItemsQuery } from "../app/api/portfolio";
import { useGetServicesQuery } from "../app/api/services";
import { Button } from "../components";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { data: servicesData } = useGetServicesQuery();
  const { data: portfolioData } = useGetPortfolioItemsQuery();
  const { data: blogsData } = useGetBlogsQuery();
  const { data: messagesData } = useGetMessagesQuery();

  const services = servicesData?.data ?? [];
  const portfolio = portfolioData?.data ?? [];
  const blogs = blogsData?.data ?? [];
  const messages = messagesData?.data ?? [];

  const unreadMessages = messages.filter((m) => !m.read).length;

  const stats = [
    {
      icon: HiDocumentText,
      label: "Services",
      value: services.length,
      bgColor: "bg-secondary-200",
      iconColor: "text-secondary-300",
    },
    {
      icon: HiChartBar,
      label: "Portfolio",
      value: portfolio.length,
      bgColor: "bg-secondary-200",
      iconColor: "text-secondary-300",
    },
    {
      icon: HiEye,
      label: "Blog Posts",
      value: blogs.length,
      bgColor: "bg-secondary-200",
      iconColor: "text-secondary-300",
    },
    {
      icon: HiEnvelope,
      label: "Messages",
      value: messages.length,
      bgColor: "bg-primary-500",
      iconColor: "text-secondary-200",
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
  ];

  // Recent content: latest 4 items across services, portfolio, blogs
  const recentContent = [
    ...services.slice(0, 2).map((s) => ({
      name: s.name,
      type: "Service",
      status: "Active",
      date: s.createdAt,
    })),
    ...portfolio.slice(0, 2).map((p) => ({
      name: p.title,
      type: "Portfolio",
      status: p.featured ? "Featured" : "Published",
      date: p.createdAt,
    })),
    ...blogs.slice(0, 2).map((b) => ({
      name: b.title,
      type: "Blog Post",
      status: b.published ? "Published" : "Draft",
      date: b.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  // Recent messages: latest 4
  const recentMessages = messages.slice(0, 4);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
      case "Active":
      case "Featured":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Content distribution percentages for the visual chart
  const total = services.length + portfolio.length + blogs.length || 1;
  const servicesPct = Math.round((services.length / total) * 100);
  const portfolioPct = Math.round((portfolio.length / total) * 100);
  const blogsPct = 100 - servicesPct - portfolioPct;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-lg ${stat.bgColor} p-6 shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${stat.bgColor === "bg-primary-500" ? "text-secondary-200" : "text-secondary-300"}`}>
                  {stat.label}
                </p>
                <div className="mt-2 flex items-end gap-2">
                  <h3 className={`text-4xl font-bold ${stat.bgColor === "bg-primary-500" ? "text-secondary-200" : "text-secondary-100"}`}>
                    {stat.value}
                  </h3>
                  {stat.badge && (
                    <span className="mb-1 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                      {stat.badge} new
                    </span>
                  )}
                </div>
              </div>
              <div className={`flex h-16 w-16 items-center justify-center rounded-full ${stat.bgColor === "bg-primary-500" ? "bg-primary-600" : "bg-secondary-300/20"}`}>
                <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Content Distribution */}
        <div className="rounded-lg border border-secondary-300/30 bg-secondary-200 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
          <h3 className="mb-6 text-lg font-semibold text-secondary-100">Content Distribution</h3>
          <div className="flex h-64 items-center justify-center">
            <div className="w-full space-y-4">
              {[
                { label: "Services", count: services.length, pct: servicesPct, color: "bg-primary-600" },
                { label: "Portfolio", count: portfolio.length, pct: portfolioPct, color: "bg-primary-400" },
                { label: "Blog Posts", count: blogs.length, pct: blogsPct, color: "bg-custom-300" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-secondary-100">{item.label}</span>
                    <span className="font-semibold text-secondary-100">{item.count} <span className="font-normal text-secondary-300">({item.pct}%)</span></span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-secondary-300/20">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-700`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-2 border-t border-secondary-300/20">
                <p className="text-center text-sm text-secondary-300">
                  Total: <span className="font-semibold text-secondary-100">{services.length + portfolio.length + blogs.length}</span> items
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Overview */}
        <div className="rounded-lg border border-secondary-300/30 bg-secondary-200 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
          <h3 className="mb-6 text-lg font-semibold text-secondary-100">Messages Overview</h3>
          <div className="flex h-64 flex-col justify-center space-y-4">
            {[
              { label: "Total Messages", value: messages.length, color: "text-secondary-100", bg: "bg-secondary-300/10" },
              { label: "Unread", value: messages.filter((m) => !m.read).length, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Read", value: messages.filter((m) => m.read).length, color: "text-green-600", bg: "bg-green-50" },
            ].map((item) => (
              <div key={item.label} className={`flex items-center justify-between rounded-lg ${item.bg} px-5 py-4`}>
                <span className="text-sm font-medium text-secondary-100">{item.label}</span>
                <span className={`text-2xl font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
            <button
              onClick={() => navigate("/admin/messages")}
              className="mt-2 w-full rounded-lg border border-primary-700/30 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-700/5"
            >
              View All Messages →
            </button>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Content */}
        <div className="rounded-lg border border-secondary-300/30 bg-secondary-200 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between border-b border-secondary-300/30 p-6">
            <h3 className="text-lg font-semibold text-secondary-100">Recent Content</h3>
            <Button onClick={() => navigate("/admin/services")} variant="ghost" className="text-sm text-primary-700">
              View All
            </Button>
          </div>
          <div className="p-6">
            {recentContent.length === 0 ? (
              <p className="py-8 text-center text-sm text-secondary-300">No content yet. Start by adding services or portfolio items.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-300/20 text-left">
                    <th className="pb-3 text-sm font-semibold text-secondary-300">Name</th>
                    <th className="pb-3 text-sm font-semibold text-secondary-300">Type</th>
                    <th className="pb-3 text-sm font-semibold text-secondary-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentContent.map((item, index) => (
                    <tr key={index} className="border-b border-secondary-300/10">
                      <td className="py-4 text-sm text-secondary-100 max-w-[140px] truncate">{item.name}</td>
                      <td className="py-4 text-sm text-secondary-300">{item.type}</td>
                      <td className="py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="rounded-lg border border-secondary-300/30 bg-secondary-200 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between border-b border-secondary-300/30 p-6">
            <h3 className="text-lg font-semibold text-secondary-100">Recent Messages</h3>
            <Button onClick={() => navigate("/admin/messages")} variant="ghost" className="text-sm text-primary-700">
              View All
            </Button>
          </div>
          <div className="p-6">
            {recentMessages.length === 0 ? (
              <p className="py-8 text-center text-sm text-secondary-300">No messages yet.</p>
            ) : (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="flex items-center gap-4 border-b border-secondary-300/10 pb-4 last:border-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-500 text-lg font-semibold text-secondary-200">
                      {message.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-secondary-100">{message.name}</p>
                      <p className="truncate text-xs text-secondary-300">{message.email}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-xs text-secondary-300">{formatDate(message.createdAt)}</span>
                      {!message.read && (
                        <span className="h-2 w-2 rounded-full bg-blue-500" title="Unread" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
