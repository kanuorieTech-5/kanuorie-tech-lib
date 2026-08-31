import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Search,
  BookOpen,
  BookText,
  Users,
  Star,
  ArrowRight,
} from "lucide-react";

import {
  Card,
  Button,
  Loader,
  Pagination,
  SectionTitle,
  Badge,
} from "../components/common";

import { SearchBar } from "../components/layout";

import { Newsletter, CTA } from "../components/home";

import { getBooks } from "../services";

const BOOKS_PER_PAGE = 9;

const categories = [
  "All",
  "Frontend",
  "Backend",
  "JavaScript",
  "React",
  "Node.js",
  "Database",
  "UI/UX",
  "Career",
];

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await getBooks();

        setBooks(res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title?.toLowerCase().includes(search.toLowerCase()) ||
        book.author?.toLowerCase().includes(search.toLowerCase()) ||
        book.description?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = category === "All" || book.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [books, search, category]);

  const featuredBook = filteredBooks[0];

  const totalPages = Math.ceil(
    Math.max(filteredBooks.length - 1, 0) / BOOKS_PER_PAGE,
  );

  const currentBooks = filteredBooks.slice(
    1 + (page - 1) * BOOKS_PER_PAGE,
    1 + page * BOOKS_PER_PAGE,
  );

  if (loading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center">
        <Loader />
      </section>
    );
  }

  return (
    <>
      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:45px_45px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge>KanuorieTech Library</Badge>

            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight lg:text-7xl">
              Expand Your Knowledge
              <span className="text-blue-400"> One Book </span>
              At A Time.
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              Explore premium ebooks, programming guides, career resources,
              technical documentation, and practical learning materials
              carefully curated by KanuorieTech.
            </p>
          </motion.div>
        </div>
      </section>

      {/* LIBRARY STATS */}

      <section className="-mt-12 pb-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-4">
          <Card className="text-center">
            <BookOpen className="mx-auto text-blue-600" size={34} />

            <h3 className="mt-4 text-3xl font-black">{books.length}+</h3>

            <p className="text-slate-500">Books</p>
          </Card>

          <Card className="text-center">
            <BookText className="mx-auto text-green-600" size={34} />

            <h3 className="mt-4 text-3xl font-black">
              {categories.length - 1}
            </h3>

            <p className="text-slate-500">Categories</p>
          </Card>

          <Card className="text-center">
            <Users className="mx-auto text-purple-600" size={34} />

            <h3 className="mt-4 text-3xl font-black">12K+</h3>

            <p className="text-slate-500">Readers</p>
          </Card>

          <Card className="text-center">
            <Star className="mx-auto text-yellow-500" size={34} />

            <h3 className="mt-4 text-3xl font-black">4.9</h3>

            <p className="text-slate-500">Average Rating</p>
          </Card>
        </div>
      </section>

      {/* SEARCH */}

      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            title="Browse Our Library"
            subtitle="Search thousands of carefully selected learning resources."
          />

          <div className="mt-12">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search books, authors or topics..."
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setCategory(item);
                  setPage(1);
                }}
                className={`rounded-full px-5 py-2 transition ${
                  category === item
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 hover:bg-slate-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED BOOK */}

      {featuredBook && (
        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-6">
            <SectionTitle
              title="Featured Book"
              subtitle="Our editor's top recommendation."
            />

            <motion.div whileHover={{ y: -5 }}>
              <Card className="mt-14 grid gap-10 overflow-hidden lg:grid-cols-2">
                <img
                  src={featuredBook.cover}
                  alt={featuredBook.title}
                  className="h-[520px] w-full rounded-xl object-cover"
                />

                <div className="flex flex-col justify-center">
                  <Badge>{featuredBook.category}</Badge>

                  <h2 className="mt-5 text-4xl font-black">
                    {featuredBook.title}
                  </h2>

                  <p className="mt-4 text-lg text-slate-500">
                    By {featuredBook.author}
                  </p>

                  <p className="mt-8 leading-8 text-slate-600">
                    {featuredBook.description}
                  </p>

                  <Link to={`/books/${featuredBook._id}`} className="mt-10">
                    <Button>
                      Read More
                      <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
      )}
      {/* BOOKS GRID */}

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            title="Library Collection"
            subtitle="Discover programming books, career guides, design resources and software engineering references."
          />

          {currentBooks.length === 0 ? (
            <Card className="mt-16 py-20 text-center">
              <BookOpen size={60} className="mx-auto text-slate-400" />

              <h3 className="mt-6 text-3xl font-bold">No Books Found</h3>

              <p className="mt-4 text-slate-500">
                Try changing your search or selecting another category.
              </p>
            </Card>
          ) : (
            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {currentBooks.map((book) => (
                <motion.div
                  key={book._id}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card className="overflow-hidden p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="h-80 w-full object-cover transition duration-500 hover:scale-105"
                      />

                      <div className="absolute left-4 top-4">
                        <Badge>{book.category}</Badge>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star size={18} fill="currentColor" />

                          <span className="font-semibold">
                            {book.rating || "4.9"}
                          </span>
                        </div>

                        <span className="text-sm text-slate-500">
                          {book.pages || 250} Pages
                        </span>
                      </div>

                      <h3 className="line-clamp-2 text-2xl font-bold">
                        {book.title}
                      </h3>

                      <p className="mt-2 text-slate-500">By {book.author}</p>

                      <p className="mt-5 line-clamp-3 leading-7 text-slate-600">
                        {book.description}
                      </p>

                      <div className="mt-8 flex items-center justify-between">
                        <div>
                          {book.price ? (
                            <span className="text-2xl font-black text-blue-600">
                              ₦{book.price}
                            </span>
                          ) : (
                            <Badge>Free</Badge>
                          )}
                        </div>

                        <Link to={`/books/${book._id}`}>
                          <Button>
                            View Book
                            <ArrowRight className="ml-2" size={18} />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PAGINATION */}

      {totalPages > 1 && (
        <section className="pb-20">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </section>
      )}

      {/* NEWSLETTER */}

      <Newsletter />

      {/* CALL TO ACTION */}

      <CTA />
    </>
  );
}
