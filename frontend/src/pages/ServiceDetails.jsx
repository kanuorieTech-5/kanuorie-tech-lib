import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Card,
  Button,
  Loader,
} from "../components/common";

import { getService } from "../services";

export default function ServiceDetails() {

  const { id } = useParams();

  const [service, setService] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchService = async () => {

      try {

        const res = await getService(id);

        setService(res.data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    };

    fetchService();

  }, [id]);

  if (loading) return <Loader />;

  if (!service)
    return (
      <div className="py-24 text-center">
        Service not found.
      </div>
    );

  return (

    <section className="mx-auto max-w-6xl px-6 py-20">

      <div className="grid gap-12 lg:grid-cols-2">

        <img
          src={service.image}
          alt={service.title}
          className="rounded-xl shadow-xl"
        />

        <div>

          <h1 className="mb-5 text-5xl font-bold">
            {service.title}
          </h1>

          <p className="mb-8 leading-8 text-gray-600">
            {service.description}
          </p>

          <Card className="mb-8">

            <div className="space-y-3">

              <p>

                <strong>Category:</strong>{" "}
                {service.category}

              </p>

              <p>

                <strong>Delivery Time:</strong>{" "}
                {service.duration}

              </p>

              <p>

                <strong>Starting Price:</strong>{" "}
                ₦{service.price}

              </p>

            </div>

          </Card>

          <div className="flex flex-wrap gap-4">

            <Button>
              Request Quote
            </Button>

            <Button variant="secondary">
              Book Consultation
            </Button>

          </div>

        </div>

      </div>

      {service.features?.length > 0 && (

        <section className="mt-20">

          <h2 className="mb-8 text-3xl font-bold">
            What's Included
          </h2>

          <div className="space-y-4">

            {service.features.map((item, index) => (

              <Card key={index}>
                {item}
              </Card>

            ))}

          </div>

        </section>

      )}

    </section>

  );

}