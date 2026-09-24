import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  ExternalLink,
  FileText,
  Github,
  Globe,
  Star,
  Users,
} from "lucide-react";

import { Badge, Button, Card, Loader } from "../components/common";
import { getProduct } from "../services";

const PRODUCT_PLACEHOLDER = "/images/product-placeholder.png";

const getPricingLabel = (product) => {
  const pricingType = product?.pricingType || "Free";

  const price = Number(product?.price);

  if (pricingType === "Paid" && Number.isFinite(price) && price > 0) {
    return `${product?.currency || "USD"} ${price.toLocaleString()}`;
  }

  return pricingType;
};

const getPricingClass = (pricingType) => {
  if (pricingType === "Paid") {
    return "bg-blue-50 text-blue-700";
  }

  if (pricingType === "Freemium") {
    return "bg-purple-50 text-purple-700";
  }

  if (pricingType === "Open Source") {
    return "bg-orange-50 text-orange-700";
  }

  return "bg-emerald-50 text-emerald-700";
};

const getProductData = (response) => {
  if (response?.data?.product) {
    return response.data.product;
  }

  if (response?.data) {
    return response.data;
  }

  if (response?.product) {
    return response.product;
  }

  return null;
};

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProduct(id);

        const data = getProductData(response);

        if (mounted) {
          setProduct(data);
        }
      } catch (err) {
        console.error("Failed to load product:", err);

        if (mounted) {
          setProduct(null);
          setError("We couldn't load this product right now.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadProduct();
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
          px-6
        "
      >
        <Loader />
      </section>
    );
  }

  if (!product) {
    return (
      <section
        className="
          mx-auto
          max-w-4xl
          px-6
          py-16
          lg:py-24
        "
      >
        <Card className="p-10 text-center">
          <div
            className="
              mx-auto
              mb-6
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-slate-100
              text-slate-500
            "
          >
            <BookOpen size={28} />
          </div>

          <h1
            className="
              mb-4
              text-3xl
              font-bold
              text-slate-900
            "
          >
            Product not found
          </h1>

          <p className="mb-8 text-slate-600">
            {error ||
              "The product you're looking for may have been removed or is no longer available."}
          </p>

          <Link to="/products">
            <Button>
              <ArrowLeft size={16} className="mr-2" />
              Back to Products
            </Button>
          </Link>
        </Card>
      </section>
    );
  }

  const pricingType = product.pricingType || "Free";

  const pricingLabel = getPricingLabel(product);

  const pricingClass = getPricingClass(pricingType);

  const technologies = Array.isArray(product.technologies)
    ? product.technologies.filter(Boolean)
    : [];

  const gallery = Array.isArray(product.gallery)
    ? product.gallery.filter(Boolean)
    : [];

  const image = product.image || gallery[0] || PRODUCT_PLACEHOLDER;

  const rating = Number(product.rating) || 0;

  const totalRatings = Number(product.totalRatings) || 0;

  const views = Number(product.views) || 0;

  return (
    <>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-gradient-to-br
          from-slate-950
          via-slate-900
          to-blue-950
          py-12
          text-white
          lg:py-20
        "
      >
        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)]
            bg-[size:45px_45px]
          "
          aria-hidden="true"
        />

        <div
          className="
            relative
            mx-auto
            max-w-7xl
            px-6
            lg:px-8
          "
        >
          <Link
            to="/products"
            className="
              mb-8
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-300
              transition
              hover:text-white
            "
          >
            <ArrowLeft size={16} />
            Back to Product Hub
          </Link>

          <div
            className="
              grid
              items-center
              gap-10
              lg:grid-cols-[1.1fr_.9fr]
              lg:gap-16
            "
          >
            {/* Product information */}

            <motion.div
              initial={{
                opacity: 0,
                x: -30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.6,
              }}
            >
              <div
                className="
                  mb-5
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    rounded-full
                    bg-blue-500/10
                    px-4
                    py-1.5
                    text-sm
                    font-semibold
                    text-blue-300
                    ring-1
                    ring-inset
                    ring-blue-400/20
                  "
                >
                  {product.category || "Other"}
                </span>

                {product.featured && (
                  <span
                    className="
                      rounded-full
                      bg-yellow-400
                      px-4
                      py-1.5
                      text-sm
                      font-bold
                      text-slate-950
                    "
                  >
                    Featured
                  </span>
                )}
              </div>

              <h1
                className="
                  text-4xl
                  font-black
                  leading-tight
                  sm:text-5xl
                  lg:text-6xl
                "
              >
                {product.name || "Developer Tool"}
              </h1>

              <p
                className="
                  mt-6
                  max-w-3xl
                  text-lg
                  leading-8
                  text-slate-300
                "
              >
                {product.excerpt ||
                  product.description ||
                  "Explore this technology and learn how it can support your work."}
              </p>

              {/* Quick information */}

              <div
                className="
                  mt-8
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    rounded-full
                    bg-white/10
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    backdrop-blur
                  "
                >
                  {pricingLabel}
                </span>

                {views > 0 && (
                  <span
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-full
                      bg-white/5
                      px-4
                      py-2
                      text-sm
                      text-slate-300
                    "
                  >
                    <Users size={15} />
                    {views.toLocaleString()} views
                  </span>
                )}

                {rating > 0 && (
                  <span
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-full
                      bg-white/5
                      px-4
                      py-2
                      text-sm
                      text-slate-300
                    "
                  >
                    <Star size={15} className="fill-current" />

                    {rating.toFixed(1)}

                    {totalRatings > 0 && ` (${totalRatings})`}
                  </span>
                )}
              </div>

              {/* Main actions */}

              <div
                className="
                  mt-8
                  flex
                  flex-wrap
                  gap-3
                "
              >
                {product.websiteUrl && (
                  <a
                    href={product.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button>
                      <Globe size={17} className="mr-2" />
                      Visit Official Website
                      <ArrowUpRight size={15} className="ml-2" />
                    </Button>
                  </a>
                )}

                {product.documentationUrl && (
                  <a
                    href={product.documentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/15
                      bg-white/5
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-white/10
                    "
                  >
                    <FileText size={17} className="mr-2" />
                    Documentation
                  </a>
                )}

                {product.githubUrl && (
                  <a
                    href={product.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/15
                      bg-white/5
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-white/10
                    "
                  >
                    <Github size={17} className="mr-2" />
                    GitHub
                  </a>
                )}
              </div>
            </motion.div>

            {/* Product image */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.6,
                delay: 0.1,
              }}
              className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-white/5
                p-2
                shadow-2xl
                backdrop-blur-xl
              "
            >
              <img
                src={image}
                alt={product.name || "Product"}
                className="
                  aspect-video
                  w-full
                  rounded-2xl
                  object-cover
                "
                onError={(event) => {
                  if (event.currentTarget.src.includes(PRODUCT_PLACEHOLDER)) {
                    return;
                  }

                  event.currentTarget.src = PRODUCT_PLACEHOLDER;
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          DETAILS
      ===================================================== */}

      <section
        className="
          bg-slate-50
          px-6
          py-16
          lg:px-8
          lg:py-20
        "
      >
        <div
          className="
            mx-auto
            grid
            max-w-7xl
            gap-8
            lg:grid-cols-[1fr_360px]
          "
        >
          {/* Main content */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
            }}
          >
            <Card className="p-6 sm:p-8">
              <div className="mb-8">
                <p
                  className="
                    mb-2
                    text-sm
                    font-semibold
                    uppercase
                    tracking-wider
                    text-blue-600
                  "
                >
                  About this technology
                </p>

                <h2
                  className="
                    text-3xl
                    font-bold
                    text-slate-900
                  "
                >
                  {product.name}
                </h2>
              </div>

              <div
                className="
                  whitespace-pre-line
                  text-base
                  leading-8
                  text-slate-600
                "
              >
                {product.description ||
                  "No detailed description has been provided yet."}
              </div>

              {/* Technologies */}

              {technologies.length > 0 && (
                <div className="mt-10">
                  <h3
                    className="
                      mb-4
                      text-lg
                      font-bold
                      text-slate-900
                    "
                  >
                    Technologies & Tags
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {technologies.map((technology) => (
                      <span
                        key={technology}
                        className="
                            rounded-full
                            bg-slate-100
                            px-3
                            py-1.5
                            text-sm
                            font-medium
                            text-slate-700
                          "
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Sidebar */}

          <motion.aside
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
              delay: 0.1,
            }}
            className="space-y-6"
          >
            {/* Pricing card */}

            <Card className="p-6">
              <p
                className="
                  mb-2
                  text-sm
                  font-medium
                  text-slate-500
                "
              >
                Pricing
              </p>

              <div
                className="
                  mb-4
                  text-3xl
                  font-black
                  text-slate-900
                "
              >
                {pricingLabel}
              </div>

              <span
                className={`
                  inline-flex
                  rounded-full
                  px-3
                  py-1
                  text-sm
                  font-semibold
                  ${pricingClass}
                `}
              >
                {pricingType}
              </span>

              <p
                className="
                  mt-4
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                Pricing information is provided for reference. Visit the
                official website for current plans and terms.
              </p>
            </Card>

            {/* Links card */}

            <Card className="p-6">
              <h3
                className="
                  mb-5
                  text-lg
                  font-bold
                  text-slate-900
                "
              >
                Useful Links
              </h3>

              <div className="space-y-3">
                {product.websiteUrl && (
                  <a
                    href={product.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-xl
                      border
                      border-slate-200
                      p-3
                      text-sm
                      font-medium
                      text-slate-700
                      transition
                      hover:border-blue-300
                      hover:bg-blue-50
                      hover:text-blue-700
                    "
                  >
                    <span className="flex items-center gap-3">
                      <Globe size={17} />
                      Official Website
                    </span>

                    <ExternalLink size={15} />
                  </a>
                )}

                {product.documentationUrl && (
                  <a
                    href={product.documentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-xl
                      border
                      border-slate-200
                      p-3
                      text-sm
                      font-medium
                      text-slate-700
                      transition
                      hover:border-blue-300
                      hover:bg-blue-50
                      hover:text-blue-700
                    "
                  >
                    <span className="flex items-center gap-3">
                      <FileText size={17} />
                      Documentation
                    </span>

                    <ExternalLink size={15} />
                  </a>
                )}

                {product.githubUrl && (
                  <a
                    href={product.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-xl
                      border
                      border-slate-200
                      p-3
                      text-sm
                      font-medium
                      text-slate-700
                      transition
                      hover:border-blue-300
                      hover:bg-blue-50
                      hover:text-blue-700
                    "
                  >
                    <span className="flex items-center gap-3">
                      <Github size={17} />
                      GitHub Repository
                    </span>

                    <ExternalLink size={15} />
                  </a>
                )}

                {!product.websiteUrl &&
                  !product.documentationUrl &&
                  !product.githubUrl && (
                    <p className="text-sm text-slate-500">
                      No external links have been added yet.
                    </p>
                  )}
              </div>
            </Card>

            {/* Category card */}

            <Card className="p-6">
              <p
                className="
                  mb-3
                  text-sm
                  text-slate-500
                "
              >
                Category
              </p>

              <Badge>{product.category || "Other"}</Badge>

              <Link
                to={`/products?category=${encodeURIComponent(
                  product.category || "Other",
                )}`}
                className="
                  mt-5
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-blue-600
                  transition
                  hover:text-blue-700
                "
              >
                Explore similar tools
                <ArrowUpRight size={15} />
              </Link>
            </Card>
          </motion.aside>
        </div>
      </section>
    </>
  );
}
