import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

import {
  Loader,
  Card,
  SectionTitle,
} from "../common";

import { getTestimonials } from "../../services";


export default function Testimonials() {

  const [testimonials, setTestimonials] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const fetchTestimonials = async () => {

      try {

        const res = await getTestimonials();

        setTestimonials(res.data || []);

      } catch (error) {

        console.error(
          "Failed to load testimonials:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    fetchTestimonials();

  }, []);



  if (loading) return <Loader />;



  return (

    <section className="bg-slate-950 py-24">


      <div className="mx-auto max-w-7xl px-6">


        <SectionTitle

          badge="Testimonials"

          title="Trusted By Learners And Businesses"

          subtitle="Hear from people who have experienced our solutions and learning programs."

        />



        {testimonials.length === 0 ? (

          <p className="
            mt-12
            text-center
            text-slate-400
          ">

            Testimonials coming soon.

          </p>

        ) : (


          <div className="
            mt-16
            grid
            gap-8
            lg:grid-cols-3
          ">


            {testimonials.slice(0,3).map((item,index)=>(


              <motion.div

                key={item._id}

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
                    h-full
                    border-white/10
                    bg-white/5
                    backdrop-blur-xl
                  "

                >


                  <Quote

                    className="
                      mb-6
                      h-10
                      w-10
                      text-cyan-400
                    "

                  />



                  <p className="
                    mb-8
                    leading-7
                    italic
                    text-slate-300
                  ">

                    "{item.message}"

                  </p>



                  <h4 className="
                    font-bold
                    text-white
                  ">

                    {item.name}

                  </h4>



                  <p className="
                    mt-1
                    text-sm
                    text-slate-400
                  ">

                    {item.position}

                  </p>


                </Card>


              </motion.div>


            ))}


          </div>


        )}


      </div>


    </section>

  );

}