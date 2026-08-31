import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ChevronDown, HelpCircle } from "lucide-react";

import { Loader, Card } from "../components/common";

import { getFAQs } from "../services";

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await getFAQs();

        const data = res?.data;

        setFaqs(
          Array.isArray(data)
            ? data
            : Array.isArray(data?.faqs)
              ? data.faqs
              : [],
        );
      } catch (error) {
        console.error("Failed to load FAQs:", error);

        toast.error("Unable to load FAQs. Please try again.");

        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-6">
        <Loader />
      </section>
    );
  }

  return (
    <main className="bg-white text-gray-900 transition-colors dark:bg-slate-950 dark:text-white">
      {/* ==========================================
          HERO
      ========================================== */}

      <section className="border-b border-gray-200 bg-slate-50 py-20 dark:border-white/10 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <HelpCircle size={30} />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Help Center
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Frequently Asked Questions
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
            Find answers to some of the most common questions about
            KanuorieTech, our courses, digital resources, products, and
            services.
          </p>
        </div>
      </section>

      {/* ==========================================
          FAQ CONTENT
      ========================================== */}

      <section className="mx-auto max-w-4xl px-6 py-16 lg:py-20">
        {faqs.length === 0 ? (
          <Card className="border-gray-200 bg-white p-12 text-center dark:border-white/10 dark:bg-white/5">
            <HelpCircle className="mx-auto mb-5 h-12 w-12 text-gray-400" />

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              No FAQs available yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-600 dark:text-gray-400">
              We're currently preparing answers to common questions. Please
              check back soon.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq._id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-lg font-semibold text-gray-900 dark:text-white sm:px-8 sm:py-6">
                  <span>{faq.question}</span>

                  <ChevronDown className="h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 group-open:rotate-180" />
                </summary>

                <div className="border-t border-gray-100 px-6 pb-6 pt-5 dark:border-white/10 sm:px-8">
                  <p className="leading-7 text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
