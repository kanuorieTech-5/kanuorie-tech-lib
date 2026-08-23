import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Card,
  Button,
  Loader,
  SectionTitle,
} from "../common";

import { getProducts } from "../../services";

export default function ProductsPreview() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();

        /*
         * Support the common API response formats:
         *
         * 1. { data: [...] }
         * 2. [...]
         * 3. { data: { products: [...] } }
         */

        const data = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.data?.products)
              ? response.data.products
              : [];

        setProducts(data);
      } catch (error) {
        console.error(
          "Failed to load products:",
          error
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /*
   * Loading state
   */
  if (loading) {
    return (
      <section className="bg-slate-950 py-24">
        <div className="mx-auto flex max-w-7xl justify-center px-6">
          <Loader />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-950 py-24">
      <div className=" px-6">
        <SectionTitle
          Badge="Digital Products"
          title="Tools Built To Help You Grow"
          subtitle="Explore premium digital resources, templates and products created by KanuorieTech."
        />

        {products.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 px-6 py-16 text-center backdrop-blur-xl">
            <p className="text-slate-400">
              Products coming soon.
            </p>
          </div>
        ) : (
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product, index) => (
              <motion.div
                key={product._id || product.id}
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
                  delay: index * 0.1,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
              >
                <Card
                  className="
                    h-full
                    overflow-hidden
                    border-white/10
                    bg-white/5
                    backdrop-blur-xl
                  "
                >
                  <img
                    src={
                      product.image ||
                      product.coverImage ||
                      "/images/product-placeholder.png"
                    }
                    alt={product.title || "Digital product"}
                    className="
                      mb-5
                      h-56
                      w-full
                      rounded-2xl
                      object-cover
                    "
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src =
                        "/images/product-placeholder.png";
                    }}
                  />

                  <div className="flex h-[calc(100%-14rem)] flex-col">
                    <h3 className="mb-3 text-xl font-semibold text-white">
                      {product.title}
                    </h3>

                    <p className="mb-5 line-clamp-3 leading-6 text-slate-400">
                      {product.description ||
                        "Premium digital products designed for modern users."}
                    </p>

                    <p className="mb-6 mt-auto text-lg font-bold text-cyan-400">
                      ₦
                      {Number(product.price || 0).toLocaleString()}
                    </p>

                    <Link
                      to={`/products/${product._id || product.id}`}
                    >
                      <Button fullWidth>
                        View Product
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {products.length > 4 && (
          <div className="mt-12 text-center">
            <Link to="/products">
              <Button variant="secondary">
                View All Products
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
