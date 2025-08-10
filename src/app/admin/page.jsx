import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authConfig } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Users, Wrench, MessageSquare, TrendingUp, Eye, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";

async function getDashboardStats() {
  const [
    totalUsers,
    totalTools,
    pendingTools,
    totalMessages,
    unreadMessages,
    totalUpvotes
  ] = await Promise.all([
    prisma.user.count(),
    prisma.app.count(),
    prisma.app.count({ where: { isApproved: false } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.app.aggregate({ _sum: { upvotes: true } })
  ]);

  return {
    totalUsers,
    totalTools,
    pendingTools,
    totalMessages,
    unreadMessages,
    totalUpvotes: totalUpvotes._sum.upvotes || 0
  };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authConfig);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const stats = await getDashboardStats();

  const dashboardCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: "Registered users",
      href: "/admin/users"
    },
    {
      title: "Total Tools",
      value: stats.totalTools,
      icon: Wrench,
      description: "All submitted tools",
      href: "/admin/tools"
    },
    {
      title: "Pending Approval",
      value: stats.pendingTools,
      icon: CheckCircle,
      description: "Tools awaiting review",
      href: "/admin/tools?status=pending"
    },
    {
      title: "Messages",
      value: `${stats.unreadMessages}/${stats.totalMessages}`,
      icon: MessageSquare,
      description: "Unread/Total messages",
      href: "/admin/messages"
    },
    {
      title: "Total Upvotes",
      value: stats.totalUpvotes,
      icon: TrendingUp,
      description: "All tool upvotes",
      href: "/admin/analytics"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {session.user.name}. Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
                <Link href={card.href} className="mt-2 inline-block">
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Manage Tools</CardTitle>
            <CardDescription>
              Review, approve, and manage submitted tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/admin/tools">
                <Button variant="outline" className="w-full justify-start">
                  <Wrench className="h-4 w-4 mr-2" />
                  All Tools
                </Button>
              </Link>
              <Link href="/admin/tools?status=pending">
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Pending Approval ({stats.pendingTools})
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage users and their permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  All Users
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>
              View and respond to user messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/admin/messages">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  All Messages
                </Button>
              </Link>
              {stats.unreadMessages > 0 && (
                <Link href="/admin/messages?status=unread">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Unread ({stats.unreadMessages})
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}