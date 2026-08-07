import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Card,
  Button,
  Loader,
  Pagination,
} from "../components/common";
import { SearchBar, } from "../components/layout";
import { getProducts } from "../services";

const PER_PAGE = 12;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const totalPages = Math.ceil(filteredProducts.length / PER_PAGE);

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  if (loading) return <Loader />;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <h1 className="mb-8 text-4xl font-bold">
        Products
      </h1>

      <div className="mb-8 flex flex-col gap-4 md:flex-row">

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search products..."
        />

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border px-4 py-3"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

        {paginatedProducts.map((product) => (

          <Card key={product._id}>

            <img
              src={product.image}
              alt={product.title}
              className="mb-5 h-56 w-full rounded-lg object-cover"
            />

            <h2 className="mb-2 text-xl font-bold">
              {product.title}
            </h2>

            <p className="mb-4 text-gray-600">
              {product.description?.slice(0, 90)}...
            </p>

            <p className="mb-6 text-xl font-bold text-blue-600">
              ₦{product.price}
            </p>

            <Link to={`/products/${product._id}`}>
              <Button fullWidth>
                View Product
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