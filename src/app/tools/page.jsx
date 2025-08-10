import { Suspense } from "react";
import prisma from "@/src/lib/prisma";
import ToolCard from "@/src/components/Home Page/ToolCard";
import SearchBar from "@/src/components/search/SearchBar";
import { ScrollArea } from "@/src/components/ui/scroll-area";

async function getAllTools() {
  const tools = await prisma.app.findMany({
    where: {
      isApproved: true,
    },
    include: {
      categories: true,
      votes: true,
    },
    orderBy: {
      upvotes: 'desc',
    },
  });

  return tools;
}

export default async function ToolsPage({ searchParams }) {
  const query = searchParams?.query || "";
  const category = searchParams?.category || "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          All AI Tools
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Discover the complete collection of AI tools for content creators
        </p>
        <SearchBar category={category} />
      </div>

      <Suspense fallback={<div>Loading tools...</div>}>
        <ToolsGrid query={query} category={category} />
      </Suspense>
    </div>
  );
}

async function ToolsGrid({ query, category }) {
  let searchCondition = {
    isApproved: true,
  };

  if (query) {
    searchCondition.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  if (category) {
    searchCondition.categories = {
      some: { name: category },
    };
  }

  const tools = await prisma.app.findMany({
    where: searchCondition,
    include: {
      categories: true,
      votes: true,
    },
    orderBy: {
      upvotes: 'desc',
    },
  });

  if (tools.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No tools found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}