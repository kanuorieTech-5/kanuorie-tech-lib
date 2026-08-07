import { useEffect, useState } from "react";

import {
  Loader,
} from "../components/common";

import { getFAQs } from "../services";

export default function FAQ() {

  const [faqs, setFaqs] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchFAQs = async () => {

      try {

        const res = await getFAQs();

        setFaqs(res.data || []);

      } finally {

        setLoading(false);

      }

    };

    fetchFAQs();

  }, []);

  if (loading) return <Loader />;

  return (

    <section className="mx-auto max-w-4xl px-6 py-20">

      <h1 className="mb-12 text-center text-5xl font-bold">

        Frequently Asked Questions

      </h1>

      <div className="space-y-6">

        {faqs.map(faq => (

          <details
            key={faq._id}
            className="rounded-xl border p-6"
          >

            <summary className="cursor-pointer text-xl font-semibold">

              {faq.question}

            </summary>

            <p className="mt-4 text-gray-600">

              {faq.answer}

            </p>

          </details>

        ))}

      </div>

    </section>

  );

}