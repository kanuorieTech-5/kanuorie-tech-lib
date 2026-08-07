import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Card,
  Button,
  Loader,
  SectionTitle,
} from "../common";

import { getProjects } from "../../services";


export default function ProjectsPreview() {

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const fetchProjects = async () => {

      try {

        const res = await getProjects();

        setProjects(res.data || []);

      } catch (err) {

        console.error(
          "Failed to load projects:",
          err
        );

      } finally {

        setLoading(false);

      }

    };


    fetchProjects();

  }, []);



  if (loading) return <Loader />;



  return (

    <section className="bg-slate-950 py-24">


      <div className="mx-auto max-w-7xl px-6">


        <SectionTitle

          badge="Our Portfolio"

          title="Projects That Create Real Impact"

          subtitle="Explore some of the digital solutions, platforms and products we have built."

        />



        {projects.length === 0 ? (

          <p className="
            mt-12
            text-center
            text-slate-400
          ">

            Projects coming soon.

          </p>

        ) : (


          <div className="
            mt-16
            grid
            gap-8
            md:grid-cols-2
            lg:grid-cols-3
          ">


            {projects.slice(0,3).map((project,index)=>(


              <motion.div

                key={project._id}

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
                      project.image ||
                      "/images/project-placeholder.png"
                    }

                    alt={project.title}

                    className="
                      mb-5
                      h-60
                      w-full
                      rounded-2xl
                      object-cover
                    "

                  />



                  <h3 className="
                    mb-3
                    text-2xl
                    font-bold
                    text-white
                  ">

                    {project.title}

                  </h3>




                  <p className="
                    mb-6
                    leading-7
                    text-slate-400
                  ">

                    {
                      project.description
                      ?.slice(0,120)
                      ||
                      "A technology solution designed to solve real-world challenges."
                    }

                    ...

                  </p>




                  <Link
                    to={`/projects/${project._id}`}
                  >

                    <Button>

                      View Project

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