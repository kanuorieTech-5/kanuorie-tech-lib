import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Image as ImageIcon,
  User,
  Layers3,
  CheckCircle2,
} from "lucide-react";

import { Button, Card, Loader } from "../components/common";
import { getProject } from "../services";

export default function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const res = await getProject(id);

        const data = res?.data || null;

        setProject(data);

        if (data?.image) {
          setActiveImage(data.image);
        }
      } catch (error) {
        console.error("Failed to load project:", error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  if (loading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-6">
        <Loader />
      </section>
    );
  }

  if (!project) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
        <Card className="p-10 text-center sm:p-14">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Layers3 size={30} />
          </div>

          <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
            Project not found
          </h1>

          <p className="mx-auto mb-8 max-w-xl leading-7 text-gray-600">
            The project you are looking for may have been removed or is no
            longer available.
          </p>

          <Link to="/projects">
            <Button>
              <ArrowLeft size={18} />
              Back to Projects
            </Button>
          </Link>
        </Card>
      </section>
    );
  }

  const technologies = Array.isArray(project.technologies)
    ? project.technologies.filter(Boolean)
    : typeof project.technologies === "string"
      ? project.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean)
      : [];

  /*
   * Supports gallery data whether your backend returns:
   *
   * gallery
   * galleryUrls
   * images
   *
   * This makes the page more resilient.
   */
  const gallerySource =
    project.gallery || project.galleryUrls || project.images || [];

  const gallery = Array.isArray(gallerySource)
    ? gallerySource.filter(Boolean)
    : typeof gallerySource === "string"
      ? gallerySource
          .split(/\r?\n|,/)
          .map((image) => image.trim())
          .filter(Boolean)
      : [];

  const allImages = [
    ...(project.image ? [project.image] : []),
    ...gallery.filter((image) => image !== project.image),
  ];

  const mainImage =
    activeImage || project.image || "/images/project-placeholder.jpg";

  return (
    <main className="bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
          <Link
            to="/projects"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            <ArrowLeft size={17} />
            Back to Projects
          </Link>

          <div className="max-w-4xl">
            {project.category && (
              <div className="mb-4 inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                {project.category}
              </div>
            )}

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>

            {project.description && (
              <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
                {project.description}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr]">
          <div>
            {/* Main Image */}
            <div className="group overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 shadow-xl">
              <img
                src={mainImage}
                alt={project.title || "Project preview"}
                className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.01]"
                onError={(event) => {
                  event.currentTarget.src = "/images/project-placeholder.jpg";
                }}
              />
            </div>

            {/* Gallery */}
            {allImages.length > 1 && (
              <div className="mt-5">
                <div className="mb-4 flex items-center gap-2">
                  <ImageIcon size={18} className="text-blue-600" />

                  <h2 className="text-lg font-bold text-gray-900">
                    Project Gallery
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {allImages.map((image, index) => {
                    const isActive = image === mainImage;

                    return (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setActiveImage(image)}
                        className={`group overflow-hidden rounded-2xl border-2 bg-gray-50 transition ${
                          isActive
                            ? "border-blue-600 ring-2 ring-blue-100"
                            : "border-transparent hover:border-blue-200"
                        }`}
                        aria-label={`View project image ${index + 1}`}
                      >
                        <img
                          src={image}
                          alt={`${project.title} gallery ${index + 1}`}
                          className="aspect-video w-full object-cover transition duration-300 group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.src =
                              "/images/project-placeholder.jpg";
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            {/* Project Overview */}
            <Card className="overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-xl font-bold text-gray-900">
                  Project Overview
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {/* Category */}
                {project.category && (
                  <div className="flex items-start gap-4 px-6 py-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Layers3 size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Category
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {project.category}
                      </p>
                    </div>
                  </div>
                )}

                {/* Client */}
                {project.client && (
                  <div className="flex items-start gap-4 px-6 py-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <User size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Client
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {project.client}
                      </p>
                    </div>
                  </div>
                )}

                {/* Technologies Count */}
                {technologies.length > 0 && (
                  <div className="flex items-start gap-4 px-6 py-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <CheckCircle2 size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Technologies
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {technologies.length}{" "}
                        {technologies.length === 1
                          ? "Technology"
                          : "Technologies"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Technologies */}
            {technologies.length > 0 && (
              <Card className="p-6">
                <h2 className="mb-5 text-xl font-bold text-gray-900">
                  Technologies Used
                </h2>

                <div className="flex flex-wrap gap-2.5">
                  {technologies.map((tech, index) => (
                    <span
                      key={`${tech}-${index}`}
                      className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-100"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Actions */}
            {(project.demoUrl || project.githubUrl) && (
              <Card className="p-6">
                <h2 className="mb-5 text-xl font-bold text-gray-900">
                  Explore This Project
                </h2>

                <div className="flex flex-col gap-3">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full justify-center">
                        <ExternalLink size={18} />
                        View Live Demo
                      </Button>
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button
                        variant="secondary"
                        className="w-full justify-center"
                      >
                        <Github size={18} />
                        View Source Code
                      </Button>
                    </a>
                  )}
                </div>
              </Card>
            )}
          </aside>
        </div>
      </section>

      {project.description && (
        <section className="border-t border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
            <div className="max-w-4xl">
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-blue-600">
                About the Project
              </p>

              <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900">
                Project Details
              </h2>

              <p className="text-lg leading-8 text-gray-600">
                {project.description}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-700"
          >
            <ArrowLeft size={18} />
            Explore More Projects
          </Link>
        </div>
      </section>
    </main>
  );
}
