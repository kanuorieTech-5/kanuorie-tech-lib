import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Card,
  Button,
  Loader,
  Pagination,
} from "../components/common";
import { SearchBar, } from "../components/layout"
import { getProjects } from "../services";

const PER_PAGE = 9;

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await getProjects();
        setProjects(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const categories = [
    "All",
    ...new Set(
      projects
        .map((project) => project.category)
        .filter(Boolean)
    ),
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = project.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        project.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [projects, search, category]);

  const totalPages = Math.ceil(
    filteredProjects.length / PER_PAGE
  );

  const currentProjects = filteredProjects.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  if (loading) return <Loader />;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <h1 className="mb-8 text-4xl font-bold">
        Projects
      </h1>

      <div className="mb-8 flex flex-col gap-4 md:flex-row">

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search projects..."
        />

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border px-4 py-3"
        >
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

        {currentProjects.map((project) => (

          <Card key={project._id}>

            <img
              src={project.image}
              alt={project.title}
              className="mb-5 h-56 w-full rounded-lg object-cover"
            />

            <h2 className="mb-3 text-2xl font-bold">
              {project.title}
            </h2>

            <p className="mb-6 text-gray-600">
              {project.description?.slice(0, 120)}...
            </p>

            <Link to={`/projects/${project._id}`}>
              <Button fullWidth>
                View Project
              </Button>
            </Link>

          </Card>

        ))}

      </div>

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

    </section>
  );
}