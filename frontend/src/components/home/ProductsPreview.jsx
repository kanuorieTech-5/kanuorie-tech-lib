import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Globe, Sparkles } from "lucide-react";

import { Card, Button, Loader, SectionTitle } from "../common";
import { getProducts } from "../../services";

const PRODUCT_PLACEHOLDER = "/images/product-placeholder.png";

const getProductsData = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.products)) {
    return response.data.products;
  }

  if (Array.isArray(response?.products)) {
    return response.products;
  }

  return [];
};

const getPricingLabel = (product) => {
  const pricingType = product?.pricingType || "Free";
  const price = Number(product?.price);

  if (pricingType === "Paid" && Number.isFinite(price) && price > 0) {
    return `${product?.currency || "USD"} ${price.toLocaleString()}`;
  }

  return pricingType;
};

export default function ProductsPreview() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderRef = useRef(null);

  const visibleProducts = products.slice(0, 4);

  /* ==========================================
     AUTOPLAY MOBILE CAROUSEL
  ========================================== */

  useEffect(() => {
    if (visibleProducts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((previous) => {
        const next =
          previous + 1 >= visibleProducts.length
            ? 0
            : previous + 1;

        const slides = sliderRef.current?.children;

        if (slides?.[next]) {
          slides[next].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }

        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [visibleProducts.length]);

  /* ==========================================
     LOAD PRODUCTS
  ========================================== */

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        const response = await getProducts({
          limit: 8,
        });

        const data = getProductsData(response);

        if (mounted) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to load products:", error);

        if (mounted) {
          setProducts([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  /* ==========================================
     GO TO SLIDE
  ========================================== */

  const goToSlide = (index) => {
    setCurrentSlide(index);

    const slides = sliderRef.current?.children;

    if (slides?.[index]) {
      slides[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <section className="bg-slate-950 py-16">
        <div className="mx-auto flex max-w-7xl justify-center px-6">
          <Loader />
        </div>
      </section>
    );
  }

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-slate-950
        py-16
        text-white
        lg:py-24
      "
    >
      {/* Background glow */}

      <div
        className="
          absolute
          left-1/2
          top-0
          h-96
          w-96
          -translate-x-1/2
          rounded-full
          bg-blue-500/10
          blur-3xl
        "
        aria-hidden="true"
      />

      <div
        className="
          absolute
          bottom-0
          right-0
          h-72
          w-72
          rounded-full
          bg-yellow-400/5
          blur-3xl
        "
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}

        <div className="mb-12">
          <SectionTitle
            Badge="Developer & Business Products"
            title="Tools Worth Knowing"
            subtitle="Explore a curated collection of technologies, platforms and software that developers and businesses can use to build, launch and grow."
          />
        </div>

        {/* Empty state */}

        {products.length === 0 ? (
          <div
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/5
              px-6
              py-16
              text-center
              backdrop-blur-xl
            "
          >
            <Sparkles
              className="
                mx-auto
                mb-5
                h-10
                w-10
                text-blue-400
              "
            />

            <h3 className="mb-3 text-2xl font-bold">
              Product Hub coming soon
            </h3>

            <p className="mx-auto max-w-xl text-slate-400">
              We're building a curated directory of useful tools and
              technologies for developers, creators and businesses.
            </p>
          </div>
        ) : (
          <>
            {/* ==========================================
                MOBILE CAROUSEL
            ========================================== */}

            <div className="sm:hidden">

              <div
                ref={sliderRef}
                className="
                  flex
                  snap-x
                  snap-mandatory
                  gap-5
                  overflow-x-auto
                  pb-4
                  scrollbar-hide
                "
              >
                {visibleProducts.map((product, index) => {
                  const productId =
                    product?._id || product?.id;

                  return (
                    <motion.div
                      key={
                        productId ||
                        `mobile-product-${index}`
                      }
                      initial={{
                        opacity: 0,
                        x: 25,
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        duration: 0.45,
                        delay: Math.min(
                          index * 0.08,
                          0.3
                        ),
                      }}
                      viewport={{
                        once: true,
                        amount: 0.1,
                      }}
                      className="
                        w-[88%]
                        shrink-0
                        snap-center
                      "
                    >
                      <Card
                        className="
                          group
                          flex
                          h-full
                          flex-col
                          overflow-hidden
                          border-white/10
                          bg-white/5
                          p-0
                          text-white
                          backdrop-blur-xl
                          transition
                          duration-300
                        "
                      >

                        {/* Image */}

                        <Link
                          to={
                            productId
                              ? `/products/${productId}`
                              : "/products"
                          }
                          className="
                            relative
                            block
                            overflow-hidden
                          "
                        >
                          <img
                            src={
                              product?.image ||
                              PRODUCT_PLACEHOLDER
                            }
                            alt={
                              product?.name ||
                              "Developer tool"
                            }
                            loading="lazy"
                            className="
                              h-52
                              w-full
                              object-cover
                              transition
                              duration-500
                              group-hover:scale-105
                            "
                            onError={(event) => {
                              if (
                                event.currentTarget.src.includes(
                                  PRODUCT_PLACEHOLDER
                                )
                              ) {
                                return;
                              }

                              event.currentTarget.src =
                                PRODUCT_PLACEHOLDER;
                            }}
                          />

                          {product?.featured && (
                            <span
                              className="
                                absolute
                                left-4
                                top-4
                                rounded-full
                                bg-yellow-400
                                px-3
                                py-1
                                text-xs
                                font-bold
                                text-slate-950
                              "
                            >
                              Featured
                            </span>
                          )}
                        </Link>

                        {/* Content */}

                        <div
                          className="
                            flex
                            flex-1
                            flex-col
                            p-5
                          "
                        >

                          {/* Category */}

                          <div
                            className="
                              mb-3
                              flex
                              items-center
                              justify-between
                              gap-3
                            "
                          >
                            <span
                              className="
                                rounded-full
                                bg-blue-500/10
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                text-blue-300
                              "
                            >
                              {product?.category ||
                                "Other"}
                            </span>

                            <span
                              className="
                                text-xs
                                font-bold
                                text-emerald-400
                              "
                            >
                              {getPricingLabel(product)}
                            </span>
                          </div>

                          {/* Name */}

                          <Link
                            to={
                              productId
                                ? `/products/${productId}`
                                : "/products"
                            }
                          >
                            <h3
                              className="
                                line-clamp-2
                                text-xl
                                font-bold
                                transition
                                group-hover:text-blue-400
                              "
                            >
                              {product?.name ||
                                "Developer Tool"}
                            </h3>
                          </Link>

                          {/* Description */}

                          <p
                            className="
                              mt-3
                              line-clamp-3
                              text-sm
                              leading-6
                              text-slate-400
                            "
                          >
                            {product?.excerpt ||
                              product?.description ||
                              "A useful technology for modern digital work."}
                          </p>

                          {/* Technologies */}

                          {Array.isArray(
                            product?.technologies
                          ) &&
                            product.technologies.length >
                              0 && (
                              <div
                                className="
                                  mt-4
                                  flex
                                  flex-wrap
                                  gap-2
                                "
                              >
                                {product.technologies
                                  .slice(0, 2)
                                  .map(
                                    (technology) => (
                                      <span
                                        key={technology}
                                        className="
                                          rounded-full
                                          bg-white/5
                                          px-2.5
                                          py-1
                                          text-xs
                                          text-slate-400
                                        "
                                      >
                                        {technology}
                                      </span>
                                    )
                                  )}
                              </div>
                            )}

                          {/* Actions */}

                          <div
                            className="
                              mt-auto
                              flex
                              items-center
                              gap-2
                              pt-5
                            "
                          >
                            <Link
                              to={
                                productId
                                  ? `/products/${productId}`
                                  : "/products"
                              }
                              className="flex-1"
                            >
                              <Button
                                fullWidth
                                size="sm"
                              >
                                Explore
                                <ArrowUpRight
                                  size={15}
                                  className="ml-1"
                                />
                              </Button>
                            </Link>

                            {product?.websiteUrl && (
                              <a
                                href={
                                  product.websiteUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Visit ${product.name} website`}
                                title="Official Website"
                                className="
                                  flex
                                  h-9
                                  w-9
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-lg
                                  border
                                  border-white/10
                                  text-slate-400
                                  transition
                                  hover:border-blue-400
                                  hover:text-blue-400
                                "
                              >
                                <Globe size={16} />
                              </a>
                            )}

                            {product?.githubUrl && (
                              <a
                                href={
                                  product.githubUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${product.name} GitHub`}
                                title="GitHub"
                                className="
                                  flex
                                  h-9
                                  w-9
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-lg
                                  border
                                  border-white/10
                                  text-slate-400
                                  transition
                                  hover:border-white/30
                                  hover:text-white
                                "
                              >
                                <Github size={16} />
                              </a>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Carousel indicators */}

              {visibleProducts.length > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                  {visibleProducts.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        goToSlide(index)
                      }
                      aria-label={`Go to product ${
                        index + 1
                      }`}
                      aria-current={
                        currentSlide === index
                      }
                      className={`
                        h-2
                        rounded-full
                        transition-all
                        duration-300
                        ${
                          currentSlide === index
                            ? "w-6 bg-blue-400"
                            : "w-2 bg-white/20"
                        }
                      `}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ==========================================
                TABLET / DESKTOP GRID
            ========================================== */}

            <div
              className="
                hidden
                gap-6
                sm:grid
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >
              {visibleProducts.map((product, index) => {
                const productId =
                  product?._id || product?.id;

                return (
                  <motion.div
                    key={
                      productId ||
                      `desktop-product-${index}`
                    }
                    initial={{
                      opacity: 0,
                      y: 25,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(
                        index * 0.08,
                        0.3
                      ),
                    }}
                    viewport={{
                      once: true,
                      amount: 0.15,
                    }}
                    className="h-full"
                  >
                    <Card
                      className="
                        group
                        flex
                        h-full
                        flex-col
                        overflow-hidden
                        border-white/10
                        bg-white/5
                        p-0
                        text-white
                        backdrop-blur-xl
                        transition
                        duration-300
                        hover:-translate-y-1
                        hover:border-blue-400/30
                        hover:shadow-2xl
                      "
                    >

                      {/* Image */}

                      <Link
                        to={
                          productId
                            ? `/products/${productId}`
                            : "/products"
                        }
                        className="
                          relative
                          block
                          overflow-hidden
                        "
                      >
                        <img
                          src={
                            product?.image ||
                            PRODUCT_PLACEHOLDER
                          }
                          alt={
                            product?.name ||
                            "Developer tool"
                          }
                          loading="lazy"
                          className="
                            h-52
                            w-full
                            object-cover
                            transition
                            duration-500
                            group-hover:scale-105
                          "
                          onError={(event) => {
                            if (
                              event.currentTarget.src.includes(
                                PRODUCT_PLACEHOLDER
                              )
                            ) {
                              return;
                            }

                            event.currentTarget.src =
                              PRODUCT_PLACEHOLDER;
                          }}
                        />

                        {product?.featured && (
                          <span
                            className="
                              absolute
                              left-4
                              top-4
                              rounded-full
                              bg-yellow-400
                              px-3
                              py-1
                              text-xs
                              font-bold
                              text-slate-950
                            "
                          >
                            Featured
                          </span>
                        )}
                      </Link>

                      {/* Content */}

                      <div
                        className="
                          flex
                          flex-1
                          flex-col
                          p-5
                        "
                      >
                        <div
                          className="
                            mb-3
                            flex
                            items-center
                            justify-between
                            gap-3
                          "
                        >
                          <span
                            className="
                              rounded-full
                              bg-blue-500/10
                              px-3
                              py-1
                              text-xs
                              font-semibold
                              text-blue-300
                            "
                          >
                            {product?.category ||
                              "Other"}
                          </span>

                          <span
                            className="
                              text-xs
                              font-bold
                              text-emerald-400
                            "
                          >
                            {getPricingLabel(product)}
                          </span>
                        </div>

                        <Link
                          to={
                            productId
                              ? `/products/${productId}`
                              : "/products"
                          }
                        >
                          <h3
                            className="
                              line-clamp-2
                              text-xl
                              font-bold
                              transition
                              group-hover:text-blue-400
                            "
                          >
                            {product?.name ||
                              "Developer Tool"}
                          </h3>
                        </Link>

                        <p
                          className="
                            mt-3
                            line-clamp-3
                            text-sm
                            leading-6
                            text-slate-400
                          "
                        >
                          {product?.excerpt ||
                            product?.description ||
                            "A useful technology for modern digital work."}
                        </p>

                        {Array.isArray(
                          product?.technologies
                        ) &&
                          product.technologies.length >
                            0 && (
                            <div
                              className="
                                mt-4
                                flex
                                flex-wrap
                                gap-2
                              "
                            >
                              {product.technologies
                                .slice(0, 2)
                                .map(
                                  (technology) => (
                                    <span
                                      key={technology}
                                      className="
                                        rounded-full
                                        bg-white/5
                                        px-2.5
                                        py-1
                                        text-xs
                                        text-slate-400
                                      "
                                    >
                                      {technology}
                                    </span>
                                  )
                                )}
                            </div>
                          )}

                        <div
                          className="
                            mt-auto
                            flex
                            items-center
                            gap-2
                            pt-5
                          "
                        >
                          <Link
                            to={
                              productId
                                ? `/products/${productId}`
                                : "/products"
                            }
                            className="flex-1"
                          >
                            <Button
                              fullWidth
                              size="sm"
                            >
                              Explore
                              <ArrowUpRight
                                size={15}
                                className="ml-1"
                              />
                            </Button>
                          </Link>

                          {product?.websiteUrl && (
                            <a
                              href={
                                product.websiteUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Visit ${product.name} website`}
                              title="Official Website"
                              className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-white/10
                                text-slate-400
                                transition
                                hover:border-blue-400
                                hover:text-blue-400
                              "
                            >
                              <Globe size={16} />
                            </a>
                          )}

                          {product?.githubUrl && (
                            <a
                              href={
                                product.githubUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${product.name} GitHub`}
                              title="GitHub"
                              className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-white/10
                                text-slate-400
                                transition
                                hover:border-white/30
                                hover:text-white
                              "
                            >
                              <Github size={16} />
                            </a>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* ==========================================
                VIEW ALL
            ========================================== */}

            <div className="mt-12 text-center">
              <Link to="/products">
                <Button
                  variant="outline"
                  className="
                    border-white/20
                    bg-white/5
                    text-white
                    hover:bg-white/10
                  "
                >
                  Explore Product Hub
                  <ArrowUpRight
                    size={16}
                    className="ml-2"
                  />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}