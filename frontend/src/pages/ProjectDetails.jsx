import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Button,
  Card,
  Loader,
} from "../components/common";

import {
  getProject,
} from "../services";

export default function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const res = await getProject(id);
        setProject(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  if (loading) return <Loader />;

  if (!project) {
    return (
      <div className="py-24 text-center">
        Project not found.
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">

      <div className="grid gap-12 lg:grid-cols-2">

        <img
          src={project.image}
          alt={project.title}
          className="rounded-xl shadow-xl"
        />

        <div>

          <h1 className="mb-5 text-5xl font-bold">
            {project.title}
          </h1>

          <p className="mb-8 leading-8 text-gray-600">
            {project.description}
          </p>

          <Card className="mb-8">

            <h3 className="mb-4 text-xl font-semibold">
              Technologies
            </h3>

            <div className="flex flex-wrap gap-3">

              {project.technologies?.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700"
                >
                  {tech}
                </span>
              ))}

            </div>

          </Card>

          <div className="flex flex-wrap gap-4">

            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button>
                  Live Demo
                </Button>
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary">
                  GitHub
                </Button>
              </a>
            )}

          </div>

        </div>

      </div>

    </section>
  );
}