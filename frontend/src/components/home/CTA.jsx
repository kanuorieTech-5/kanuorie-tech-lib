import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  Button,
  SectionTitle,
} from "../common";


export default function CTA() {

  const stats = [
    {
      value: "Growing",
      label: "Tech Community",
    },
    {
      value: "Modern",
      label: "Digital Solutions",
    },
    {
      value: "Practical",
      label: "Learning Experience",
    },
  ];


  return (

    <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 py-24">

      {/* Background Glow */}

      <div className="absolute inset-0 opacity-10">

        <div className="absolute
          -left-20 top-0 h-72
          w-72
          rounded-full
          bg-white
          blur-3xl
        " />


        <div className="
          absolute
          bottom-0
          right-0
          h-96
          w-96
          rounded-full
          bg-cyan-300
          blur-3xl
        " />


      </div>




      <motion.div

        initial={{
          opacity:0,
          y:40
        }}

        whileInView={{
          opacity:1,
          y:0
        }}

        viewport={{
          once:true
        }}

        className="
          relative
          mx-auto
          max-w-6xl
          px-6
        "

      >


        <div className="
          rounded-3xl
          border
          border-white/10
          bg-white/5
          p-10
          backdrop-blur-xl
          lg:p-16
        ">


          <SectionTitle

            centered

            light

            Badge="Get Started"

            title="Ready To Build Something Amazing?"

            subtitle="Whether you want to build a digital product, improve your technical skills, or access quality resources, KanuorieTech is ready to help."

          />




          <div className="
            mt-10
            flex
            flex-col
            items-center
            justify-center
            gap-5
            sm:flex-row
          ">


            <Link to="/contact">

              <Button size="lg">

                Start Your Project

              </Button>

            </Link>



            <Link to="/courses">

              <Button

                variant="outline"

                size="lg"

                className="
                  border-white
                  text-white
                  hover:bg-white
                  hover:text-slate-900
                "

              >

                Explore Academy

              </Button>


            </Link>


          </div>




          <div className="
            mt-12
            grid
            grid-cols-1
            gap-8
            border-t
            border-white/10
            pt-10
            text-center
            md:grid-cols-3
          ">


            {stats.map((stat)=>(

              <div key={stat.label}>


                <h3 className="
                  text-3xl
                  font-bold
                  text-white
                ">

                  {stat.value}

                </h3>



                <p className="
                  mt-2
                  text-blue-100
                ">

                  {stat.label}

                </p>


              </div>

            ))}


          </div>


        </div>


      </motion.div>


    </section>

  );
}