import { Link } from "react-router-dom";
import { Badge, Button, Card } from "../ui";

export default function ProductCard({ product }) {
  return (
    <Card className="overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <img
        src={product.image || "/images/product-placeholder.jpg"}
        alt={product.name}
        className="h-60 w-full object-cover"
      />

      <div className="space-y-4 p-5">
        <Badge>{product.category}</Badge>

        <h3 className="line-clamp-2 text-xl font-semibold">{product.name}</h3>

        <p className="line-clamp-2 text-sm text-gray-500">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">${product.price}</span>

          <Button as={Link} to={`/products/${product._id}`} size="sm">
            Buy
          </Button>
        </div>
      </div>
    </Card>
  );
}
