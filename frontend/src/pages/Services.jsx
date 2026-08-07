import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Card,
  Button,
  Loader,
  Pagination,
} from "../components/common";
import {SearchBar,} from "../components/layout";
import { getServices } from "../services";

const PER_PAGE = 9;

export default function Services() {

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {

    const fetchServices = async () => {

      try {

        const res = await getServices();

        setServices(res.data || []);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    };

    fetchServices();

  }, []);

  const categories = [
    "All",
    ...new Set(
      services
        .map(service => service.category)
        .filter(Boolean)
    ),
  ];

  const filtered = useMemo(() => {

    return services.filter(service => {

      const matchSearch =
        service.title
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchCategory =
        category === "All" ||
        service.category === category;

      return matchSearch && matchCategory;

    });

  }, [services, search, category]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const currentServices = filtered.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  if (loading) return <Loader />;

  return (

    <section className="mx-auto max-w-7xl px-6 py-20">

      <h1 className="mb-8 text-4xl font-bold">
        Our Services
      </h1>

      <div className="mb-8 flex flex-col gap-4 md:flex-row">

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search services..."
        />

        <select
          className="rounded-lg border px-4 py-3"
          value={category}
          onChange={(e)=>{
            setCategory(e.target.value);
            setPage(1);
          }}
        >

          {categories.map(cat => (
            <option key={cat}>
              {cat}
            </option>
          ))}

        </select>

      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

        {currentServices.map(service => (

          <Card key={service._id}>

            <img
              src={service.image}
              alt={service.title}
              className="mb-5 h-56 w-full rounded-lg object-cover"
            />

            <h2 className="mb-3 text-2xl font-bold">
              {service.title}
            </h2>

            <p className="mb-6 text-gray-600">
              {service.description?.slice(0,120)}...
            </p>

            <Link to={`/services/${service._id}`}>
              <Button fullWidth>
                Learn More
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