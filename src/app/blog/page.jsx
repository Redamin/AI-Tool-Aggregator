import Link from "next/link";
import Image from "next/image";
import { Calendar, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";

// Mock blog posts data - in a real app, this would come from your database
const blogPosts = [
  {
    id: 1,
    title: "The Future of AI in Content Creation",
    excerpt: "Explore how artificial intelligence is revolutionizing the way we create and consume content across different industries.",
    imageUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
    author: "AI Tools Team",
    publishedAt: "2025-01-15",
    slug: "future-of-ai-content-creation",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Top 10 AI Writing Tools for 2025",
    excerpt: "Discover the best AI writing assistants that can help you create better content faster and more efficiently.",
    imageUrl: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800",
    author: "Content Team",
    publishedAt: "2025-01-12",
    slug: "top-10-ai-writing-tools-2025",
    readTime: "8 min read"
  },
  {
    id: 3,
    title: "How to Choose the Right AI Tool for Your Workflow",
    excerpt: "A comprehensive guide to selecting AI tools that fit your specific needs and integrate seamlessly with your existing workflow.",
    imageUrl: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800",
    author: "Tech Team",
    publishedAt: "2025-01-10",
    slug: "choose-right-ai-tool-workflow",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "AI Ethics in Creative Industries",
    excerpt: "Understanding the ethical implications of using AI tools in creative work and how to use them responsibly.",
    imageUrl: "https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=800",
    author: "Ethics Team",
    publishedAt: "2025-01-08",
    slug: "ai-ethics-creative-industries",
    readTime: "7 min read"
  }
];

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Tools Blog
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Stay updated with the latest trends, tips, and insights about AI tools for content creators
        </p>
      </div>

      {/* Featured Post */}
      {blogPosts.length > 0 && (
        <div className="mb-12">
          <Card className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="relative h-64 md:h-full">
                  <Image
                    src={blogPosts[0].imageUrl}
                    alt={blogPosts[0].title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <Badge className="mb-4">Featured</Badge>
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl mb-2">
                    <Link 
                      href={`/blog/${blogPosts[0].slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {blogPosts[0].title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-base">
                    {blogPosts[0].excerpt}
                  </CardDescription>
                </CardHeader>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {blogPosts[0].author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(blogPosts[0].publishedAt).toLocaleDateString()}
                  </div>
                  <span>{blogPosts[0].readTime}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.slice(1).map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription>
                {post.excerpt}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {post.readTime}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Newsletter Signup */}
      <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Stay Updated
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Subscribe to our newsletter to get the latest articles about AI tools and content creation delivered to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}