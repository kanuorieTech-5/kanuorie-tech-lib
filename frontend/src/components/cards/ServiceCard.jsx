import { Link } from "react-router-dom";
import {
  Button,
  Card,
} from "../ui";

export default function ServiceCard({
  service,
}) {
  return (
    <Card className="p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-5 text-5xl">
        {service.icon}
      </div>

      <h3 className="mb-3 text-2xl font-semibold">
        {service.title}
      </h3>

      <p className="mb-6 line-clamp-3 text-gray-500">
        {service.description}
      </p>

      <Button
        as={Link}
        to={`/services/${service._id}`}
      >
        Learn More
      </Button>
    </Card>
  );
}