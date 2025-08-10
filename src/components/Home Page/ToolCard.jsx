import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "@/src/components/ui/aspect-ratio";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import UpvoteButton from "@/src/components/UpvoteButton";
import { getServerSession } from "next-auth";
import { authConfig } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";

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

const ToolCard = async ({ tool }) => {
  const session = await getServerSession(authConfig);
  const hasUserVoted = await checkUserVote(tool.id, session?.user?.id);

  return (
    <Card className="w-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="w-full px-0 pt-0">
        <AspectRatio ratio={16 / 9}>
          <Image
            src={tool.imageUrl}
            alt={`image for ${tool.title}`}
            fill
            className="object-cover rounded-t-lg"
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg">
            <Link 
              href={`/tools/${tool.id}`}
              className="hover:text-primary transition-colors"
            >
              {tool.title}
            </Link>
          </CardTitle>
          <UpvoteButton
            appId={tool.id}
            initialUpvotes={tool.upvotes}
            hasUserVoted={hasUserVoted}
          />
        </div>
        <CardDescription className="flex-1 mb-3">
          {tool.description}
        </CardDescription>
        <div className="flex flex-wrap gap-1 mb-3">
          {tool.categories?.slice(0, 2).map((category) => (
            <Badge key={category.id} variant="secondary" className="text-xs">
              {category.name.replace('_', ' ').toLowerCase()}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <Badge variant="outline">{tool.pricing.toLowerCase()}</Badge>
        <a 
          href={tool.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;