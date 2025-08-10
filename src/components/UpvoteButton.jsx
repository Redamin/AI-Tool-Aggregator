"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { toast } from "@/src/components/ui/use-toast";

const UpvoteButton = ({ appId, initialUpvotes = 0, hasUserVoted = false }) => {
  const { data: session } = useSession();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasVoted, setHasVoted] = useState(hasUserVoted);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpvote = async () => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to upvote tools.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/tools/${appId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUpvotes(data.upvotes);
        setHasVoted(data.hasVoted);
        
        toast({
          title: data.hasVoted ? "Upvoted!" : "Vote removed",
          description: data.hasVoted ? "Thanks for your vote!" : "Your vote has been removed.",
        });
      } else {
        throw new Error("Failed to vote");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your vote. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={hasVoted ? "default" : "outline"}
      size="sm"
      onClick={handleUpvote}
      disabled={isLoading}
      className="flex items-center space-x-1"
    >
      <ChevronUp className={`h-4 w-4 ${hasVoted ? "text-white" : "text-gray-600"}`} />
      <span>{upvotes}</span>
    </Button>
  );
};

export default UpvoteButton;