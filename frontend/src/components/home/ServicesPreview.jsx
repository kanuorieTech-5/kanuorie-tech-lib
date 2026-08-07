import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Card,
  Button,
  Loader,
  SectionTitle,
} from "../common";

import {
  Code2,
  Smartphone,
  GraduationCap,
  Cloud,
  Database,
  ShieldCheck,
} from "lucide-react";

import { getServices } from "../../services";


const serviceIcons = [
  Code2,
  Smartphone,
  GraduationCap,
  Cloud,
  Database,
  ShieldCheck,
];


export default function ServicesPreview() {

  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const fetchServices = async () => {

      try {

        const res = await getServices();

        setServices(res.data || []);

      } catch (err) {

        console.error(
          "Failed to load services:",
          err
        );

      } finally {

        setLoading(false);

      }

    };


    fetchServices();

  }, []);



  if (loading) return <Loader />;



  return (

    <section className="bg-slate-950 py-24">


      <div className="mx-auto max-w-7xl px-6">


        <SectionTitle

          badge="Our Services"

          title="Digital Solutions Built For Growth"

          subtitle="From software development to digital transformation, we help businesses build, scale and succeed."

        />



        {services.length === 0 ? (

          <p className="
            mt-12
            text-center
            text-slate-400
          ">

            Services will be available soon.

          </p>

        ) : (


          <div className="
            mt-16
            grid
            gap-8
            md:grid-cols-2
            lg:grid-cols-3
          ">


            {services.slice(0,6).map((service,index)=>{


              const Icon =
                serviceIcons[index % serviceIcons.length];


              return (

                <motion.div

                  key={service._id}

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


                    <Icon

                      className="
                        mb-6
                        h-10
                        w-10
                        text-cyan-400
                      "

                    />



                    <h3 className="
                      mb-4
                      text-2xl
                      font-bold
                      text-white
                    ">

                      {service.title}

                    </h3>




                    <p className="
                      mb-6
                      leading-7
                      text-slate-400
                    ">

                      {
                        service.description
                        ?.slice(0,150)
                        ||
                        "Professional technology solutions designed for modern businesses."
                      }

                      ...

                    </p>




                    <Link
                      to={`/services/${service._id}`}
                    >

                      <Button>

                        Learn More

                      </Button>


                    </Link>



                  </Card>


                </motion.div>

              );


            })}


          </div>


        )}



      </div>


    </section>

  );

}