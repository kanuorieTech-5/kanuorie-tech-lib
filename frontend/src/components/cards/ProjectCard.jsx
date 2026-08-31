import { Link } from "react-router-dom";
import { Badge, Button, Card } from "../ui";

export default function ProjectCard({ project }) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <img
        src={project.image || "/images/project-placeholder.jpg"}
        alt={project.name}
        className="h-60 w-full object-cover"
      />

      <div className="space-y-4 p-6">
        <Badge>{project.technology}</Badge>

        <h3 className="text-xl font-semibold">{project.name}</h3>

        <p className="line-clamp-3 text-gray-500">{project.description}</p>

        <div className="flex justify-between">
          <Button as={Link} to={`/projects/${project._id}`} size="sm">
            Details
          </Button>

          {project.liveDemo && (
            <Button
              as="a"
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="sm"
            >
              Live Demo
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
