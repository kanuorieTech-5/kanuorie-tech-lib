import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";


const images = [
  {
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGV2ZWxvcGVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    caption: "Empowering learners through practical technology education",
  },
  {
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=60",
    caption: "Building digital solutions through collaboration",
  },
  {
    src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=60",
    caption: "Coding and problem solving",
  },
  {
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=60",
    caption: "Accessing knowledge through digital resources",
  },
  {
    src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=60",
    caption: "Innovative products designed for the digital age",
  },
  { src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=60",
    caption: "Empowering learners through practical technology education" 
  },
  {
    src: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=60",
    caption: "Building digital solutions through collaboration"
  },
  {
    src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=60",
    caption: "Innovative products designed for the digital age"
  },
  {
    src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=60",
    caption: "Accessing knowledge through digital resources"
  },
  {
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=60",
    caption: "Coding and problem solving"
  },
];


export default function ImageSlider() {

  const [currentIndex,setCurrentIndex] = useState(0);

  const [paused,setPaused] = useState(false);

  const touchStartX = useRef(null);



  const nextSlide = () => {

    setCurrentIndex(
      (prev)=>
        (prev + 1) % images.length
    );

  };



  const prevSlide = () => {

    setCurrentIndex(
      (prev)=>
        prev === 0
        ? images.length - 1
        : prev - 1
    );

  };



  useEffect(()=>{

    if(paused) return;


    const timer=setInterval(
      nextSlide,
      5000
    );


    return ()=>clearInterval(timer);


  },[paused]);



  return (

    <section className="py-24 bg-slate-950">


      <div className="
        mx-auto
        max-w-6xl
        px-6
      ">


        <div className="
          mb-12
          text-center
        ">


          <span className="
            rounded-full
            bg-blue-500/10
            px-4
            py-2
            text-sm
            font-semibold
            text-cyan-400
          ">

            KanuorieTech Experience

          </span>



          <h2 className="
            mt-6
            text-4xl
            font-bold
            text-white
          ">

            Learn. Build. Innovate.

          </h2>


          <p className="
            mt-4
            text-slate-400
          ">

            A glimpse into our technology, learning and innovation ecosystem.

          </p>


        </div>




        <div

          className="
            relative
            overflow-hidden
            rounded-3xl
            shadow-2xl
          "

          onMouseEnter={() =>
            setPaused(true)
          }

          onMouseLeave={() =>
            setPaused(false)
          }

        >



          <motion.div

            className="flex"

            animate={{
              x:`-${currentIndex * 100}%`
            }}

            transition={{
              duration:0.7
            }}

          >


            {images.map((item)=>(


              <div

                key={item.caption}

                className="
                  relative
                  w-full
                  flex-shrink-0
                  h-[220px]
                  sm:h-[500px]
                  md:h-[600px]
                  flex-shrink-0
                "

              >
                <img

                  src={item.src}

                  alt={item.caption}

                  loading="lazy"

                  className="
                    h-[220px]
                    w-full
                    object-cover
                    sm:h-[450px]
                  "

                />
                <div className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/80
                  via-black/20
                  to-transparent
                "/>
                <div className="
                  absolute
                  bottom-8
                  left-8
                  right-8
                ">
                  <h3 className="
                    max-w-3xl
                    text-2xl
                    font-bold
                    text-white
                    md:text-4xl
                  ">

                    {item.caption}

                  </h3>


                </div>


              </div>


            ))}


          </motion.div>





          <button
            onClick={prevSlide}
            className="
              absolute
              left-5
              top-1/2
              rounded-full
              bg-black/40
              px-4
              py-3
              text-white
            "
          >
            ←
          </button>



          <button
            onClick={nextSlide}
            className="
              absolute
              right-5
              top-1/2
              rounded-full
              bg-black/40
              px-4
              py-3
              text-white
            "
          >
            →
          </button>



        </div>


      </div>


    </section>

  );

}