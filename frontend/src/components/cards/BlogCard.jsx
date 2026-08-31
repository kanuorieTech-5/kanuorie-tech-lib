import { Link } from "react-router-dom";
import { Badge, Button, Card } from "../ui";

export default function BlogCard({ post }) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <img
        src={post.coverImage || "/images/blog-placeholder.jpg"}
        alt={post.title}
        className="h-56 w-full object-cover"
      />

      <div className="space-y-4 p-6">
        <Badge>{post.category}</Badge>

        <h3 className="line-clamp-2 text-xl font-semibold">{post.title}</h3>

        <p className="line-clamp-3 text-gray-500">{post.excerpt}</p>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">{post.createdAt}</span>

          <Button as={Link} to={`/blog/${post._id}`} size="sm">
            Read More
          </Button>
        </div>
      </div>
    </Card>
  );
}
