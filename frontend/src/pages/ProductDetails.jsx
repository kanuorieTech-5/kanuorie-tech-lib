import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Button,
  Card,
  Loader,
} from "../components/common";

import {
  getProduct,
} from "../services";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await getProduct(id);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const addToCart = () => {
    toast.success("Added to cart.");
  };

  if (loading) return <Loader />;

  if (!product) {
    return (
      <div className="py-24 text-center">
        Product not found.
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <div className="grid gap-12 lg:grid-cols-2">

        <img
          src={product.image}
          alt={product.title}
          className="rounded-xl shadow-lg"
        />

        <div>

          <h1 className="mb-5 text-5xl font-bold">
            {product.title}
          </h1>

          <p className="mb-8 text-gray-600 leading-8">
            {product.description}
          </p>

          <p className="mb-8 text-3xl font-bold text-blue-600">
            ₦{product.price}
          </p>

          <div className="flex gap-4">

            <Button onClick={addToCart}>
              Add To Cart
            </Button>

            <Button variant="secondary">
              Buy Now
            </Button>

          </div>

        </div>

      </div>

      {product.features?.length > 0 && (

        <section className="mt-20">

          <h2 className="mb-8 text-3xl font-bold">
            Features
          </h2>

          <div className="space-y-4">

            {product.features.map((feature, index) => (

              <Card key={index}>
                {feature}
              </Card>

            ))}

          </div>

        </section>

      )}

    </section>
  );
}