import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { Card, Button, Loader, SectionTitle } from "../common";

import {
  Code2,
  Smartphone,
  GraduationCap,
  Cloud,
  Database,
  ShieldCheck,
} from "lucide-react";

import { getServices } from "../../services";

const SERVICE_ICONS = [
  Code2,
  Smartphone,
  GraduationCap,
  Cloud,
  Database,
  ShieldCheck,
];

const FALLBACK_DESCRIPTION =
  "Professional technology solutions designed for modern businesses.";

const getServicesData = (response) => {
  if (Array.isArray(response)) return response;

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.services)) {
    return response.data.services;
  }

  if (Array.isArray(response?.services)) {
    return response.services;
  }

  return [];
};

const getServiceId = (service) =>
  service?._id || service?.id || null;

const getServiceDescription = (service) => {
  const description = service?.description?.trim();

  if (!description) {
    return FALLBACK_DESCRIPTION;
  }

  return description.length > 150
    ? `${description.slice(0, 150).trim()}...`
    : description;
};

export default function ServicesPreview() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);

  /* ==========================================
     RESPONSIVE CARD COUNT
  ========================================== */

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(3);
      } else if (window.innerWidth >= 768) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    };

    updateVisibleCards();

    window.addEventListener("resize", updateVisibleCards);

    return () => {
      window.removeEventListener("resize", updateVisibleCards);
    };
  }, []);

  /* ==========================================
     LOAD SERVICES
  ========================================== */

  useEffect(() => {
    let mounted = true;

    const loadServices = async () => {
      try {
        const response = await getServices();

        const data = getServicesData(response);

        if (mounted) {
          setServices(data);
        }
      } catch (error) {
        console.error("Failed to load services:", error);

        if (mounted) {
          setServices([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      mounted = false;
    };
  }, []);

  const displayedServices = services.filter((service) =>
    getServiceId(service),
  );

  /* ==========================================
     MAX SLIDE INDEX
  ========================================== */

  const maxIndex = Math.max(
    displayedServices.length - visibleCards,
    0,
  );

  /* ==========================================
     KEEP INDEX VALID WHEN RESPONSIVE SIZE CHANGES
  ========================================== */

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  /* ==========================================
     NEXT SLIDE
  ========================================== */

  const nextSlide = () => {
    setCurrentIndex((previous) =>
      previous >= maxIndex ? 0 : previous + 1,
    );
  };

  /* ==========================================
     PREVIOUS SLIDE
  ========================================== */

  const prevSlide = () => {
    setCurrentIndex((previous) =>
      previous <= 0 ? maxIndex : previous - 1,
    );
  };

  /* ==========================================
     AUTO SLIDE
  ========================================== */

  useEffect(() => {
    if (displayedServices.length <= visibleCards) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((previous) =>
        previous >= maxIndex ? 0 : previous + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [
    displayedServices.length,
    visibleCards,
    maxIndex,
  ]);

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <section className="bg-slate-900 py-10 text-white">
        <div className="flex justify-center">
          <Loader />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-900 py-10 text-white">
      <div className="px-6 text-center">

        {/* ==========================================
            HEADER
        ========================================== */}

        <SectionTitle
          Badge="Our Services"
          title="Digital Solutions Built For Growth"
          subtitle="From software development to digital transformation, we help businesses build, scale and succeed."
        />

        {/* ==========================================
            EMPTY STATE
        ========================================== */}

        {displayedServices.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <Code2 className="mx-auto mb-5 h-10 w-10 text-cyan-400" />

            <h3 className="text-xl font-bold">
              Services Coming Soon
            </h3>

            <p className="mx-auto mt-3 max-w-lg text-slate-400">
              We're currently updating our service offerings.
            </p>
          </div>
        ) : (
          <>
            {/* ==========================================
                SLIDER
            ========================================== */}

            <div className="mt-16 overflow-hidden">
              <motion.div
                className="flex"
                animate={{
                  x: `-${currentIndex * (100 / visibleCards)}%`,
                }}
                transition={{
                  duration: 0.7,
                  ease: "easeInOut",
                }}
              >
                {displayedServices.map((service, index) => {
                  const serviceId = getServiceId(service);

                  const Icon =
                    SERVICE_ICONS[
                      index % SERVICE_ICONS.length
                    ];

                  return (
                    <div
                      key={serviceId}
                      className="w-full shrink-0 px-2 md:w-1/2 lg:w-1/3"
                    >
                      <Card
                        className="
                          flex
                          h-full
                          flex-col
                          border-white/10
                          bg-white/5
                          backdrop-blur-xl
                        "
                      >
                        <Icon className="mb-6 h-10 w-10 text-cyan-400" />

                        <h3 className="mb-4 text-2xl font-bold">
                          {service.title ||
                            "Technology Service"}
                        </h3>

                        <p className="mb-8 flex-1 leading-7 text-slate-400">
                          {getServiceDescription(service)}
                        </p>

                        <Link
                          to={`/services/${serviceId}`}
                          className="mt-auto inline-flex"
                        >
                          <Button>
                            Learn More
                          </Button>
                        </Link>
                      </Card>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* ==========================================
                CONTROLS
            ========================================== */}

            {displayedServices.length > visibleCards && (
              <>
                <div className="mt-10 flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="
                      rounded-full
                      border
                      border-white/20
                      px-5
                      py-2
                      transition
                      hover:bg-white/10
                    "
                    aria-label="Previous services"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    onClick={nextSlide}
                    className="
                      rounded-full
                      border
                      border-white/20
                      px-5
                      py-2
                      transition
                      hover:bg-white/10
                    "
                    aria-label="Next services"
                  >
                    →
                  </button>
                </div>

                {/* ==========================================
                    SLIDE INDICATORS
                ========================================== */}

                <div className="mt-5 flex justify-center gap-2">
                  {Array.from({
                    length: maxIndex + 1,
                  }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setCurrentIndex(index)
                      }
                      aria-label={`Go to service slide ${
                        index + 1
                      }`}
                      className={`h-2 rounded-full transition-all ${
                        currentIndex === index
                          ? "w-6 bg-cyan-400"
                          : "w-2 bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* ==========================================
            VIEW ALL
        ========================================== */}

        {services.length > 6 && (
          <div className="mt-12 text-center">
            <Link to="/services">
              <Button variant="secondary">
                View All Services
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

