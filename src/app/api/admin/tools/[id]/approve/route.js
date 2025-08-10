import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/src/lib/auth";

export const POST = async (req, { params }) => {
  const session = await getServerSession(authConfig);
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;

    const updatedTool = await prisma.app.update({
      where: { id },
      data: {
        isApproved: true,
      },
    });

    return NextResponse.json({
      message: "Tool approved successfully",
      tool: updatedTool,
    });
  } catch (error) {
    console.error("Approval error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
};