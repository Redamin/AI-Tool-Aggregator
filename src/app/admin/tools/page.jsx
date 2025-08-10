import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authConfig } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { CheckCircle, XCircle, Eye, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

async function getTools(status) {
  let whereCondition = {};
  
  if (status === "pending") {
    whereCondition.isApproved = false;
  } else if (status === "approved") {
    whereCondition.isApproved = true;
  }

  const tools = await prisma.app.findMany({
    where: whereCondition,
    include: {
      categories: true,
      submittedBy: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          votes: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return tools;
}

export default async function AdminToolsPage({ searchParams }) {
  const session = await getServerSession(authConfig);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const status = searchParams?.status || "all";
  const tools = await getTools(status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Tools</h1>
          <p className="text-gray-600 mt-2">
            Review and manage all submitted tools
          </p>
        </div>
        <div className="flex space-x-2">
          <Link href="/admin/tools">
            <Button variant={status === "all" ? "default" : "outline"}>
              All Tools
            </Button>
          </Link>
          <Link href="/admin/tools?status=pending">
            <Button variant={status === "pending" ? "default" : "outline"}>
              Pending
            </Button>
          </Link>
          <Link href="/admin/tools?status=approved">
            <Button variant={status === "approved" ? "default" : "outline"}>
              Approved
            </Button>
          </Link>
        </div>
      </div>

      {/* Tools List */}
      <div className="space-y-6">
        {tools.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No tools found.</p>
            </CardContent>
          </Card>
        ) : (
          tools.map((tool) => (
            <Card key={tool.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Tool Image */}
                  <div className="flex-shrink-0">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <Image
                        src={tool.imageUrl || "/placeholder-tool.png"}
                        alt={tool.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Tool Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {tool.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {tool.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>Submitted by: {tool.submittedBy?.name || "Unknown"}</span>
                          <span>•</span>
                          <span>{tool.upvotes} upvotes</span>
                          <span>•</span>
                          <span>{new Date(tool.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant={tool.isApproved ? "default" : "secondary"}>
                          {tool.isApproved ? "Approved" : "Pending"}
                        </Badge>
                        <Badge variant="outline">
                          {tool.pricing.toLowerCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {tool.categories.map((category) => (
                        <Badge key={category.id} variant="outline" className="text-xs">
                          {category.name.replace('_', ' ').toLowerCase()}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 mt-4">
                      <Link href={`/tools/${tool.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      
                      {!tool.isApproved && (
                        <form action={`/api/admin/tools/${tool.id}/approve`} method="POST">
                          <Button size="sm" variant="default">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </form>
                      )}
                      
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}