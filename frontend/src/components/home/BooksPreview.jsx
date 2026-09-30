import { useEffect, useState } from "react";
import { SectionTitle } from "../common";
import { TrendingResources } from "../library";
import { getLearningResources } from "../../services";
import defaultResources from "../../data/resources";

export default function libraryPreview() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchResources = async () => {
      try {
        setLoading(true);

        const response = await getLearningResources({
          params: {
            limit: 6,
          },
        });

        const learningResources = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.data?.resources)
              ? response.data.resources
              : Array.isArray(response?.resources)
                ? response.resources
                : [];

        if (!mounted) return;

        const combined = [...defaultResources, ...learningResources];

        const formatted = combined.map((item, index) => ({
          ...item,
          resourceId:
            item._id ||
            item.id ||
            item.resourceId ||
            `${item.title || "resource"}-${index}`,
        }));

        const unique = Array.from(
          new Map(
            formatted.map((item) => [item.resourceId, item]),
          ).values(),
        );

        setResources(unique);
      } catch (error) {
        console.error(
          "Failed to load learning resources:",
          error,
        );

        if (mounted) {
          setResources(
            defaultResources.map((item, index) => ({
              ...item,
              resourceId:
                item.id ||
                item.resourceId ||
                `${item.title || "resource"}-${index}`,
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
    <section className="bg-slate-900 py-15 dark:bg-slate-900">
      <div className="px-6 text-center text-white">
        <SectionTitle
          Badge="Digital Library"
          title="Explore Premium Digital Resources"
          subtitle="Access ebooks, guides and learning materials designed to improve your skills."
        />

        {loading && (
          <div className="mt-1 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-400" />
          </div>
        )}

        {!loading && resources.length > 0 && (
          <div className="mt-1">
            <TrendingResources
              resources={resources.slice(0, 6)}
            />
          </div>
        )}

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
