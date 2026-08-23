import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";

export default function LatestBooks({ books = [] }) {
  const latestBooks = Array.isArray(books) ? books.slice(0, 5) : [];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <BookOpen size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Latest Books
            </h2>
            <p className="text-sm text-slate-500">
              Recently added books
            </p>
          </div>
        </div>

        <Link
          to="/admin/books"
          className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View all
          <ArrowRight size={16} />
        </Link>
      </div>

      {latestBooks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
          <BookOpen className="mx-auto mb-3 text-slate-400" size={32} />

          <p className="font-medium text-slate-700">
            No books yet
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Recently added books will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {latestBooks.map((book, index) => {
            const id = book._id || book.id || index;

            const title =
              book.title ||
              book.name ||
              "Untitled Book";

            const author =
              book.author?.name ||
              book.author ||
              book.authorName ||
              "Unknown Author";

            const cover =
              book.coverImage ||
              book.cover ||
              book.image ||
              book.thumbnail ||
              null;

            return (
              <div
                key={id}
                className="flex items-center gap-4 py-4"
              >
                {cover ? (
                  <img
                    src={cover}
                    alt={title}
                    className="h-14 w-11 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                    <BookOpen size={20} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">
                    {title}
                  </p>

                  <p className="truncate text-sm text-slate-500">
                    {author}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                  Book
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
