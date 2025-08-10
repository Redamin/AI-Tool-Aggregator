import { notFound } from "next/navigation";
import prisma from "@/src/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/src/lib/auth";
import Image from "next/image";
import { ExternalLink, Calendar, Tag } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import UpvoteButton from "@/src/components/UpvoteButton";
import Link from "next/link";

async function getTool(id) {
  const tool = await prisma.app.findUnique({
    where: { id },
    include: {
      categories: true,
      votes: true,
      submittedBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return tool;
}

async function checkUserVote(toolId, userId) {
  if (!userId) return false;

  const vote = await prisma.vote.findUnique({
    where: {
      userId_appId: {
        userId: userId,
        appId: toolId,
      },
    },
  });

  return !!vote;
}

export default async function ToolPage({ params }) {
  const { id } = params;
  const session = await getServerSession(authConfig);
  
  const tool = await getTool(id);

  if (!tool) {
    notFound();
  }

  const hasUserVoted = await checkUserVote(id, session?.user?.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{tool.title}</h1>
              <UpvoteButton
                appId={tool.id}
                initialUpvotes={tool.upvotes}
                hasUserVoted={hasUserVoted}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {tool.categories.map((category) => (
                <Badge key={category.id} variant="secondary">
                  <Tag className="w-3 h-3 mr-1" />
                  {category.name.replace('_', ' ').toLowerCase()}
                </Badge>
              ))}
              <Badge variant="outline">
                {tool.pricing.toLowerCase()}
              </Badge>
            </div>

            <p className="text-lg text-gray-600 mb-6">{tool.description}</p>

            <div className="flex items-center space-x-4 mb-6">
              <Button asChild size="lg">
                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Tool
                </a>
              </Button>
            </div>
          </div>

          {/* Tool Image */}
          {tool.imageUrl && (
            <div className="mb-8">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={tool.imageUrl}
                  alt={tool.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Tool Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Pricing</h4>
                <Badge variant="outline">{tool.pricing.toLowerCase()}</Badge>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-1">Categories</h4>
                <div className="flex flex-wrap gap-1">
                  {tool.categories.map((category) => (
                    <Badge key={category.id} variant="secondary" className="text-xs">
                      {category.name.replace('_', ' ').toLowerCase()}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-1">Upvotes</h4>
                <p className="text-2xl font-bold text-primary">{tool.upvotes}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-1">Added</h4>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(tool.createdAt).toLocaleDateString()}
                </div>
              </div>

              {tool.submittedBy && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Submitted by</h4>
                  <p className="text-sm text-gray-600">{tool.submittedBy.name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related Tools */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>More Tools</CardTitle>
              <CardDescription>
                Explore similar tools in the same categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/tools">Browse All Tools</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}