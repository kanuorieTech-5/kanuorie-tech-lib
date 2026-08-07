import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Loader,
  Card,
  Button,
  SectionTitle,
} from "../common";

import { getBlogs } from "../../services";


export default function BlogPreview() {

  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const fetchBlogs = async () => {

      try {

        const res = await getBlogs();

        setBlogs(res.data || []);

      } catch (error) {

        console.error(
          "Failed to load blogs:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    fetchBlogs();

  }, []);



  if (loading) return <Loader />;



  return (

    <section className="bg-slate-950 py-24">


      <div className="mx-auto max-w-7xl px-6">


        <SectionTitle

          badge="Knowledge Hub"

          title="Latest Technology Insights"

          subtitle="Explore tutorials, company updates and industry insights from KanuorieTech."

        />



        {blogs.length === 0 ? (

          <p className="
            mt-12
            text-center
            text-slate-400
          ">

            Articles coming soon.

          </p>

        ) : (


          <div className="
            mt-16
            grid
            gap-8
            lg:grid-cols-3
          ">


            {blogs.slice(0,3).map((blog,index)=>(


              <motion.div

                key={blog._id}

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
                      blog.image ||
                      "/images/blog-placeholder.png"
                    }

                    alt={blog.title}

                    className="
                      mb-5
                      h-56
                      w-full
                      rounded-2xl
                      object-cover
                    "

                  />



                  <h3 className="
                    mb-4
                    text-xl
                    font-bold
                    text-white
                  ">

                    {blog.title}

                  </h3>




                  <p className="
                    mb-6
                    leading-7
                    text-slate-400
                  ">

                    {
                      blog.excerpt
                      ?.slice(0,120)
                      ||
                      "Read the latest insights from KanuorieTech."
                    }

                    ...

                  </p>




                  <Link
                    to={`/blog/${blog._id}`}
                  >

                    <Button>

                      Read More

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