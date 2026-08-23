import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  Button,
  Card,
  Loader,
} from "../components/common";

import { getProject } from "../services";

export default function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ==========================================
     LOAD PROJECT
  ========================================== */

  useEffect(() => {
    const loadProject = async () => {
      try {
        const res = await getProject(id);

        setProject(res?.data || null);
      } catch (error) {
        console.error(
          "Failed to load project:",
          error
        );

        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  /* ==========================================
     LOADING STATE
  ========================================== */

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-6">
        <Loader />
      </section>
    );
  }

  /* ==========================================
     NOT FOUND
  ========================================== */

  if (!project) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-20">

        <Card className="p-12 text-center">

          <h1 className="mb-4 text-3xl font-bold">
            Project not found
          </h1>

          <p className="mb-8 text-gray-600">
            The project you are looking for may
            have been removed or is no longer
            available.
          </p>

          <Link to="/projects">
            <Button>
              Back to Projects
            </Button>
          </Link>

        </Card>

      </section>
    );
  }

  const technologies = Array.isArray(
    project.technologies
  )
    ? project.technologies.filter(Boolean)
    : [];

  /* ==========================================
     PAGE
  ========================================== */

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

      {/* BACK LINK */}
      <div className="mb-8">

        <Link
          to="/projects"
          className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
        >
          ← Back to Projects
        </Link>

      </div>

      {/* MAIN PROJECT */}
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">

        {/* PROJECT IMAGE */}
        <div>

          <img
            src={
              project.image ||
              "/images/project-placeholder.jpg"
            }
            alt={
              project.title ||
              "Project"
            }
            className="w-full rounded-2xl object-cover shadow-xl"
          />

        </div>

        {/* PROJECT INFORMATION */}
        <div>

          {/* CATEGORY */}
          {project.category && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
              {project.category}
            </p>
          )}

          {/* TITLE */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            {project.title}
          </h1>

          {/* DESCRIPTION */}
          {project.description && (
            <p className="mb-8 text-lg leading-8 text-gray-600">
              {project.description}
            </p>
          )}

          {/* TECHNOLOGIES */}
          {technologies.length > 0 && (
            <Card className="mb-8 p-6">

              <h2 className="mb-4 text-xl font-semibold">
                Technologies Used
              </h2>

              <div className="flex flex-wrap gap-3">

                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700"
                  >
                    {tech}
                  </span>
                ))}

              </div>

            </Card>
          )}

          {/* ACTIONS */}
          {(project.demoUrl ||
            project.githubUrl) && (
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
                    View on GitHub
                  </Button>
                </a>
              )}

            </div>
          )}

        </div>

      </div>

    </section>
  );
}
