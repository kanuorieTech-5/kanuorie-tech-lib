import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  Loader,
  Card,
  SectionTitle,
} from "../common";

import { getTeamMembers } from "../../services";


export default function TeamPreview() {

  const [team, setTeam] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const fetchTeam = async () => {

      try {

        const res = await getTeamMembers();

        setTeam(res.data || []);

      } catch (error) {

        console.error(
          "Failed to load team:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    fetchTeam();

  }, []);



  if (loading) return <Loader />;



  return (

    <section className="bg-slate-950 py-24">


      <div className="mx-auto max-w-7xl px-6">


        <SectionTitle

          badge="Our Team"

          title="Meet The People Behind KanuorieTech"

          subtitle="A team of passionate developers, educators and creators building digital solutions for the future."

        />



        {team.length === 0 ? (

          <p className="
            mt-12
            text-center
            text-slate-400
          ">

            Team information coming soon.

          </p>

        ) : (


          <div className="
            mt-16
            grid
            gap-8
            md:grid-cols-2
            lg:grid-cols-4
          ">


            {team.slice(0,4).map((member,index)=>(


              <motion.div

                key={member._id}

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
                    text-center
                    backdrop-blur-xl
                  "

                >


                  <img

                    src={
                      member.image ||
                      "/images/team-placeholder.png"
                    }

                    alt={member.name}

                    className="
                      mb-5
                      h-64
                      w-full
                      rounded-2xl
                      object-cover
                    "

                  />



                  <h3 className="
                    text-xl
                    font-bold
                    text-white
                  ">

                    {member.name}

                  </h3>



                  <p className="
                    mt-2
                    text-cyan-400
                  ">

                    {member.position}

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