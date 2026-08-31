import { useEffect, useState } from "react";
import { SectionTitle } from "../common";
import { TrendingResources } from "../library";
import { getBooks } from "../../services";
import defaultResources from "../../data/resources";

export default function BooksPreview() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchResources = async () => {
      try {
        setLoading(true);

        const response = await getBooks();

        /*
         * Backend may return:
         *
         * {
         *   data: [...]
         * }
         *
         * or:
         *
         * {
         *   data: {
         *     books: [...]
         *   }
         * }
         */

        const books = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.data?.books)
              ? response.data.books
              : [];

        if (!mounted) return;

        /*
         * Keep local resources as fallback/additional
         * resources while the API is available.
         */
        const combined = [...defaultResources, ...books];

        /*
         * Give every resource a stable ID.
         */
        const formatted = combined.map((item, index) => ({
          ...item,

          resourceId:
            item._id || item.id || item.resourceId || `${item.title}-${index}`,
        }));

        /*
         * Remove duplicates.
         */
        const unique = Array.from(
          new Map(formatted.map((item) => [item.resourceId, item])).values(),
        );

        setResources(unique);
      } catch (error) {
        console.error("Failed to load library resources:", error);

        /*
         * API failure should not break
         * the homepage.
         */
        if (mounted) {
          setResources(
            defaultResources.map((item, index) => ({
              ...item,

              resourceId:
                item.id || item.resourceId || `${item.title}-${index}`,
            })),
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchResources();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="bg-slate-900 dark:bg-slate-900 py-1">
      <div className="px-6">
        <SectionTitle
          Badge="Digital Library"
          title="Explore Premium Digital Resources"
          subtitle="Access ebooks, guides and learning materials designed to improve your skills."
        />

        {/* Loading */}
        {loading && (
          <div className="mt-1 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-400" />
          </div>
        )}

        {/* Resources */}
        {!loading && resources.length > 0 && (
          <div className="mt-1">
            <TrendingResources resources={resources.slice(0, 6)} />
          </div>
        )}

        {/* Empty state */}
        {!loading && resources.length === 0 && (
          <div className="mt-1 text-center">
            <p className="text-slate-400">
              New digital resources are coming soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
