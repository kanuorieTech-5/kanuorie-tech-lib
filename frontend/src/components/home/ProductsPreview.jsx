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

        const res = await getProducts();

        setProducts(res.data || []);

      } catch (err) {

        console.error(
          "Failed to load products:",
          err
        );

      } finally {

        setLoading(false);

      }

    };


    fetchProducts();

  }, []);



  if (loading) return <Loader />;



  return (

    <section className="bg-slate-950 py-24">


      <div className="mx-auto max-w-7xl px-6">


        <SectionTitle

          badge="Digital Products"

          title="Tools Built To Help You Grow"

          subtitle="Explore premium digital resources, templates and products created by KanuorieTech."

        />



        {products.length === 0 ? (

          <p className="
            mt-12
            text-center
            text-slate-400
          ">

            Products coming soon.

          </p>

        ) : (


          <div className="
            mt-16
            grid
            gap-8
            md:grid-cols-2
            lg:grid-cols-4
          ">


            {products.slice(0,4).map((product,index)=>(


              <motion.div

                key={product._id}

                initial={{
                  opacity:0,
                  y:30
                }}

                whileInView={{
                  opacity:1,
                  y:0
                }}

                transition={{
                  delay:index * 0.1
                }}

                viewport={{
                  once:true
                }}

              >


                <Card

                  className="
                    overflow-hidden
                    border-white/10
                    bg-white/5
                    backdrop-blur-xl
                  "

                >


                  <img

                    src={
                      product.image ||
                      "/images/product-placeholder.png"
                    }

                    alt={product.title}

                    className="
                      mb-5
                      h-56
                      w-full
                      rounded-2xl
                      object-cover
                    "

                  />



                  <h3 className="
                    mb-3
                    text-xl
                    font-semibold
                    text-white
                  ">

                    {product.title}

                  </h3>



                  <p className="
                    mb-5
                    leading-6
                    text-slate-400
                  ">

                    {
                      product.description
                      ?.slice(0,90)
                      ||
                      "Premium digital products designed for modern users."
                    }

                    ...

                  </p>



                  <p className="
                    mb-6
                    text-lg
                    font-bold
                    text-cyan-400
                  ">

                    ₦
                    {Number(product.price)
                      .toLocaleString()
                    }

                  </p>




                  <Link
                    to={`/products/${product._id}`}
                  >

                    <Button fullWidth>

                      View Product

                    </Button>


                  </Link>



                </Card>


              </motion.div>


            ))}


          </div>


        )}



      </div>


    </section>

  );

}