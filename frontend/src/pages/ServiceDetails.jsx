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
  const [notice, setNotice] = useState({ type: "", message: "" });

  useEffect(() => {
    let mounted = true;

    const fetchService = async () => {
      try {
        const res = await getService(id);
        if (mounted) setService(res?.data || null);
      } catch (error) {
        console.error("Failed to load service:", error);
        if (mounted) setService(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchService();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleEnquiry = async (form) => {
    try {
      setSubmitting(true);
      setNotice({ type: "", message: "" });

      const response = await submitServiceEnquiry(form);

      setNotice({
        type: "success",
        message:
          response?.message ||
          "Your service enquiry has been submitted successfully.",
      });
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
          <p className="mb-8 text-gray-600">
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
            <p className="mb-8 text-lg leading-8 text-gray-600">
              {service.description}
            </p>
          )}

          {(service.category || service.duration || service.price) && (
            <Card className="mb-8 p-6">
              <div className="space-y-4">
                {service.category && (
                  <div className="flex items-start justify-between gap-6">
                    <span className="font-medium text-gray-500">Category</span>
                    <span className="text-right font-semibold">
                      {service.category}
                    </span>
                  </div>
                )}

                {service.duration && (
                  <div className="flex items-start justify-between gap-6">
                    <span className="font-medium text-gray-500">
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
                      <span className="font-medium text-gray-500">
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

          <div className="flex flex-wrap gap-4">
            <a href="#service-enquiry">
              <Button>Request a Quote</Button>
            </a>
            <a href="#service-enquiry">
              <Button variant="secondary">Book Consultation</Button>
            </a>
          </div>
        </div>
      </div>

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
                  <p className="leading-7 text-gray-700">{feature}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section id="service-enquiry" className="mx-auto mt-20 max-w-3xl scroll-mt-24">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Let's Work Together
          </p>
          <h2 className="text-3xl font-bold">Enquire About This Service</h2>
          <p className="mt-3 text-gray-600">
            Tell us about your project and we'll follow up with you.
          </p>
        </div>

        {notice.message && (
          <div
            role="status"
            className={`mb-5 rounded-xl border p-4 text-sm ${
              notice.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {notice.message}
          </div>
        )}

        <ServiceInquiryForm onSubmit={handleEnquiry} loading={submitting} />
      </section>
    </section>
  );
}

