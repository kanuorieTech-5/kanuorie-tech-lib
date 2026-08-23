import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

import {
  Loader,
  Card,
  SectionTitle,
} from "../common";

import { getTestimonials } from "../../services";

const FALLBACK_TESTIMONIALS = [
  {
    _id: "fallback-1",
    name: "Startup Founder",
    message:
      "Professional execution and outstanding communication.",
    position: "Startup Founder",
  },
  {
    _id: "fallback-2",
    name: "Product Designer",
    message:
      "Modern experience and strong delivery.",
    position: "Product Designer",
  },
  {
    _id: "fallback-3",
    name: "Business Owner",
    message:
      "KanuorieTech transformed our digital presence.",
    position: "Business Owner",
  },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  /*
  ==========================================
  FETCH TESTIMONIALS
  ==========================================
  */

  useEffect(() => {
    let mounted = true;

    const fetchTestimonials = async () => {
      try {
        const response = await getTestimonials();

        const data = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.testimonials)
          ? response.data.testimonials
          : [];

        if (mounted) {
          setTestimonials(data);
        }
      } catch (error) {
        console.error(
          "Failed to load testimonials:",
          error
        );

        if (mounted) {
          setTestimonials([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchTestimonials();

    return () => {
      mounted = false;
    };
  }, []);

  /*
  ==========================================
  ITEMS
  ==========================================
  */

  const items =
    testimonials.length > 0
      ? testimonials.slice(0, 6)
      : FALLBACK_TESTIMONIALS;

  /*
  ==========================================
  KEEP INDEX VALID
  ==========================================
  */

  useEffect(() => {
    if (items.length === 0) {
      setCurrentIndex(0);
      return;
    }

    if (currentIndex >= items.length) {
      setCurrentIndex(0);
    }
  }, [items.length, currentIndex]);

  /*
  ==========================================
  AUTO SLIDE
  ==========================================
  */

  useEffect(() => {
    if (items.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((previous) =>
        previous >= items.length - 1
          ? 0
          : previous + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length]);

  /*
  ==========================================
  CONTROLS
  ==========================================
  */

  const nextSlide = () => {
    setCurrentIndex((previous) =>
      previous >= items.length - 1
        ? 0
        : previous + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((previous) =>
      previous === 0
        ? items.length - 1
        : previous - 1
    );
  };

  /*
  ==========================================
  LOADING
  ==========================================
  */

  if (loading) {
    return (
      <section className="py-20">
        <Loader />
      </section>
    );
  }

  return (
    <section className="bg-slate-950 py-20 text-white">
      <div className="mx-auto max-w-7xl px-6">

        <SectionTitle
          title="What Our Clients Say"
          subtitle="Real experiences from people and businesses we've worked with."
          light
        />

        <div className="relative mt-12 overflow-hidden">

          <motion.div
            className="flex"
            animate={{
              x: `-${currentIndex * 100}%`,
            }}
            transition={{
              duration: 0.7,
              ease: "easeInOut",
            }}
          >
            {items.map((item, index) => (
              <div
                key={
                  item._id ||
                  item.id ||
                  `${item.name}-${index}`
                }
                className="min-w-full px-2"
              >
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                >
                  <Card
                    className="
                      mx-auto
                      max-w-3xl
                      border-white/10
                      bg-white/5
                      p-8
                      backdrop-blur-xl
                    "
                  >
                    <Quote
                      className="
                        mb-6
                        h-10
                        w-10
                        text-cyan-400
                      "
                      aria-hidden="true"
                    />

                    <p
                      className="
                        mb-8
                        leading-7
                        italic
                        text-slate-300
                      "
                    >
                      "{item.message || item.quote}"
                    </p>

                    <div>
                      <h4 className="font-bold text-white">
                        {item.name}
                      </h4>

                      {(item.position || item.role) && (
                        <p className="mt-1 text-sm text-slate-400">
                          {item.position || item.role}
                        </p>
                      )}
                    </div>
                  </Card>
                </motion.div>
              </div>
            ))}
          </motion.div>

        </div>

        {/* ========================================
            CONTROLS
        ======================================== */}

        {items.length > 1 && (
          <div className="mt-8 flex justify-center gap-4">

            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous testimonial"
              className="
                rounded-full
                border
                border-white/20
                px-5
                py-2
                text-white
                transition
                hover:bg-white/10
              "
            >
              ←
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next testimonial"
              className="
                rounded-full
                border
                border-white/20
                px-5
                py-2
                text-white
                transition
                hover:bg-white/10
              "
            >
              →
            </button>

          </div>
        )}

        {/* ========================================
            INDICATORS
        ======================================== */}

        {items.length > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {items.map((item, index) => (
              <button
                key={
                  item._id ||
                  item.id ||
                  `indicator-${index}`
                }
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to testimonial ${
                  index + 1
                }`}
                className={`
                  h-2
                  rounded-full
                  transition-all
                  ${
                    currentIndex === index
                      ? "w-8 bg-cyan-400"
                      : "w-2 bg-white/30"
                  }
                `}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}