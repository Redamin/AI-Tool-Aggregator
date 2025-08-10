import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/src/lib/auth";

export const POST = async (req, { params }) => {
  const session = await getServerSession(authConfig);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const userId = session.user.id;

    // Check if user has already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_appId: {
          userId: userId,
          appId: id,
        },
      },
    });

    let hasVoted;
    let upvotes;

    if (existingVote) {
      // Remove vote
      await prisma.vote.delete({
        where: {
          id: existingVote.id,
        },
      });

      // Decrease upvote count
      const updatedApp = await prisma.app.update({
        where: { id },
        data: {
          upvotes: {
            decrement: 1,
          },
        },
      });

      hasVoted = false;
      upvotes = updatedApp.upvotes;
    } else {
      // Add vote
      await prisma.vote.create({
        data: {
          userId: userId,
          appId: id,
        },
      });

      // Increase upvote count
      const updatedApp = await prisma.app.update({
        where: { id },
        data: {
          upvotes: {
            increment: 1,
          },
        },
      });

      hasVoted = true;
      upvotes = updatedApp.upvotes;
    }

    return NextResponse.json({
      hasVoted,
      upvotes,
    });
  } catch (error) {
    console.error("Vote error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
};