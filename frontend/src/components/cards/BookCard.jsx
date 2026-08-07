import { Link } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
} from "../ui";

export default function BookCard({
  book,
}) {
  return (
    <Card className="overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <img
        src={
          book.coverImage ||
          "/images/book-placeholder.png"
        }
        alt={book.title}
        className="h-64 w-full object-cover"
      />

      <div className="space-y-4 p-5">
        <Badge>
          {book.category}
        </Badge>

        <h3 className="line-clamp-2 text-xl font-semibold">
          {book.title}
        </h3>

        <p className="text-sm text-gray-500">
          {book.author}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">
            ${book.price}
          </span>

          <Button
            as={Link}
            to={`/books/${book._id}`}
            size="sm"
          >
            View
          </Button>
        </div>
      </div>
    </Card>
  );
}