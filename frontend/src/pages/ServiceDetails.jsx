import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Button, Loader } from "../components/common";
import ServiceInquiryForm from "../components/forms/ServiceInquiryForm";
import { getService } from "../services";
import { submitServiceEnquiry } from "../api/contactApi";

export default function ServiceDetails() {
  const { id } = useParams();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notice, setNotice] = useState({ type: "", message: "" });

  useEffect(() => {
    let mounted = true;

    const fetchService = async () => {
      try {
        const res = await getService(id);

        if (mounted) {
          setService(res?.data || null);
        }
      } catch (error) {
        console.error("Failed to load service:", error);

        if (mounted) {
          setService(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchService();

    return () => {
      mounted = false;
    };
  }, [id]);

  // Close the modal when the user presses Escape.
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !submitting) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, submitting]);

  // Prevent background scrolling while the modal is open.
  useEffect(() => {
    if (!isModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isModalOpen]);

  const openEnquiryModal = () => {
    setNotice({ type: "", message: "" });
    setIsModalOpen(true);
  };

  const closeEnquiryModal = () => {
    if (submitting) return;
    setIsModalOpen(false);
  };

  const handleEnquiry = async (form) => {
    try {
      setSubmitting(true);
      setNotice({ type: "", message: "" });

      const response = await submitServiceEnquiry({
        ...form,
        service: form.service || "",
      });

      setNotice({
        type: "success",
        message:
          response?.message ||
          "Your service enquiry has been submitted successfully.",
      });

      setIsModalOpen(false);
    } catch (error) {
      setNotice({
        type: "error",
        message:
          error?.response?.data?.message ||
          "We couldn't submit your enquiry. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-6">
        <Loader />
      </section>
    );
  }

  if (!service) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-10">
        <Card className="p-12 text-center">
          <h1 className="mb-4 text-3xl font-bold">Service not found</h1>

          <p className="mb-8 text-gray-600 dark:text-slate-400">
            The service you are looking for may have been removed or is no
            longer available.
          </p>

          <Link to="/services">
            <Button>Back to Services</Button>
          </Link>
        </Card>
      </section>
    );
  }

  const features = Array.isArray(service.features)
    ? service.features.filter(Boolean)
    : [];

  return (
    <section className="mx-auto px-6 py-16 lg:px-8">
      <div className="mb-8">
        <Link
          to="/services"
          className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
        >
          ← Back to Services
        </Link>
      </div>

      {/* SERVICE OVERVIEW */}
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
        <div>
          <img
            src={service.image || "/images/service-placeholder.jpg"}
            alt={service.title || "Service"}
            className="w-full rounded-2xl object-cover shadow-xl"
          />
        </div>

        <div>
          {service.category && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
              {service.category}
            </p>
          )}

          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            {service.title}
          </h1>

          {service.description && (
            <p className="mb-8 text-lg leading-8 text-gray-600 dark:text-slate-400">
              {service.description}
            </p>
          )}

          {(service.category || service.duration || service.price) && (
            <Card className="mb-8 p-6">
              <div className="space-y-4">
                {service.category && (
                  <div className="flex items-start justify-between gap-6">
                    <span className="font-medium text-gray-500 dark:text-slate-400">
                      Category
                    </span>

                    <span className="text-right font-semibold">
                      {service.category}
                    </span>
                  </div>
                )}

                {service.duration && (
                  <div className="flex items-start justify-between gap-6">
                    <span className="font-medium text-gray-500 dark:text-slate-400">
                      Delivery Time
                    </span>

                    <span className="text-right font-semibold">
                      {service.duration}
                    </span>
                  </div>
                )}

                {service.price !== undefined &&
                  service.price !== null &&
                  service.price !== "" && (
                    <div className="flex items-start justify-between gap-6">
                      <span className="font-medium text-gray-500 dark:text-slate-400">
                        Starting Price
                      </span>

                      <span className="text-right font-semibold">
                        ₦{Number(service.price).toLocaleString()}
                      </span>
                    </div>
                  )}
              </div>
            </Card>
          )}

          {/* BUTTONS OPEN THE MODAL */}
          <div className="flex flex-wrap gap-4">
            <Button onClick={openEnquiryModal}>Request a Quote</Button>

            <Button variant="secondary" onClick={openEnquiryModal}>
              Book Consultation
            </Button>
          </div>

          {/* SUCCESS MESSAGE AFTER SUBMISSION */}
          {notice.message && (
            <div
              role="status"
              className={`mt-5 rounded-xl border p-4 text-sm ${
                notice.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {notice.message}
            </div>
          )}
        </div>
      </div>

      {/* SERVICE FEATURES */}
      {features.length > 0 && (
        <section className="mt-20">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Service Details
            </p>

            <h2 className="text-3xl font-bold">What's Included</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature, index) => (
              <Card key={`${feature}-${index}`} className="p-6">
                <div className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {index + 1}
                  </span>

                  <p className="leading-7 text-gray-700 dark:text-slate-300">
                    {feature}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* SERVICE ENQUIRY MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEnquiryModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-enquiry-title"
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/20 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-950 sm:p-8"
          >
            {/* MODAL HEADER */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                  Let's Work Together
                </p>

                <h2
                  id="service-enquiry-title"
                  className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl"
                >
                  {service.title
                    ? `Enquire About ${service.title}`
                    : "Submit a Service Enquiry"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Tell us about your project and we'll get back to you.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEnquiryModal}
                disabled={submitting}
                aria-label="Close enquiry form"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
              >
                &times;
              </button>
            </div>

            {/* ENQUIRY FORM */}
            <ServiceInquiryForm onSubmit={handleEnquiry} loading={submitting} />

            <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
              Your project details will be sent securely to our team.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
