import { Link } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
} from "../ui";

export default function CourseCard({
  course,
}) {
  return (
    <Card className="overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <img
        src={
          course.thumbnail ||
          "/images/course-placeholder.jpg"
        }
        alt={course.title}
        className="h-56 w-full object-cover"
      />

      <div className="space-y-4 p-5">
        <Badge>
          {course.level}
        </Badge>

        <h3 className="line-clamp-2 text-xl font-semibold">
          {course.title}
        </h3>

        <p className="text-gray-500">
          {course.instructor}
        </p>

        <div className="flex justify-between">
          <span className="font-bold">
            ${course.price}
          </span>

          <Button
            as={Link}
            to={`/courses/${course._id}`}
            size="sm"
          >
            Learn More
          </Button>
        </div>
      </div>
    </Card>
  );
}