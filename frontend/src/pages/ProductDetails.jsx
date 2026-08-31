import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { Button, Card, Loader } from "../components/common";

import { getProduct } from "../services";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ==========================================
     LOAD PRODUCT
  ========================================== */

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await getProduct(id);

        setProduct(res?.data || null);
      } catch (error) {
        console.error("Failed to load product:", error);

        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  /* ==========================================
     ADD TO CART
  ========================================== */

  const addToCart = () => {
    if (!product) return;

    /*
      Temporary behavior.

      Once the global cart/store is connected,
      this function should add the complete
      product object to the cart.
    */

    toast.success(`${product.title} added to cart.`);
  };

  /* ==========================================
     BUY NOW
  ========================================== */

  const handleBuyNow = () => {
    if (!product) return;

    /*
      Checkout/payment flow will be connected
      here once the cart/payment system is ready.
    */

    toast.success("Checkout will be available soon.");
  };

  /* ==========================================
     LOADING STATE
  ========================================== */

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-6">
        <Loader />
      </section>
    );
  }

  /* ==========================================
     NOT FOUND
  ========================================== */

  if (!product) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-20">
        <Card className="p-12 text-center">
          <h1 className="mb-4 text-3xl font-bold">Product not found</h1>

          <p className="mb-8 text-gray-600">
            The product you are looking for may have been removed or is no
            longer available.
          </p>

          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </Card>
      </section>
    );
  }

  /* ==========================================
     PRODUCT DATA
  ========================================== */

  const features = Array.isArray(product.features)
    ? product.features.filter(Boolean)
    : [];

  const price = Number(product.price);

  /* ==========================================
     PAGE
  ========================================== */

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      {/* BACK LINK */}

      <div className="mb-8">
        <Link
          to="/products"
          className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
        >
          ← Back to Products
        </Link>
      </div>

      {/* PRODUCT */}

      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
        {/* PRODUCT IMAGE */}

        <div>
          <img
            src={product.image || "/images/product-placeholder.jpg"}
            alt={product.title || "Product"}
            className="w-full rounded-2xl object-cover shadow-xl"
          />
        </div>

        {/* PRODUCT INFORMATION */}

        <div>
          {/* CATEGORY */}

          {product.category && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
              {product.category}
            </p>
          )}

          {/* TITLE */}

          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            {product.title}
          </h1>

          {/* DESCRIPTION */}

          {product.description && (
            <p className="mb-8 text-lg leading-8 text-gray-600">
              {product.description}
            </p>
          )}

          {/* PRICE */}

          <p className="mb-8 text-3xl font-bold text-blue-600">
            {Number.isFinite(price)
              ? `₦${price.toLocaleString()}`
              : "Price unavailable"}
          </p>

          {/* ACTIONS */}

          <div className="flex flex-wrap gap-4">
            <Button onClick={addToCart}>Add to Cart</Button>

            <Button variant="secondary" onClick={handleBuyNow}>
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      {/* FEATURES */}

      {features.length > 0 && (
        <section className="mt-20">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Product Information
            </p>

            <h2 className="text-3xl font-bold">Features</h2>
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
    </section>
  );
}
