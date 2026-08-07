import { motion } from "framer-motion";

export default function Partners() {
  const technologies = [
    "React",
    "Node.js",
    "MongoDB",
    "AWS",
    "Microsoft",
    "Google Cloud",
  ];

  return (
    <section className="border-y border-white/10 bg-slate-950 py-16">

      <div className="mx-auto max-w-7xl px-6">

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400"
        >
          Technologies We Build With
        </motion.p>


        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">

          {technologies.map((tech, index) => (

            <motion.div
              key={tech}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.08,
              }}
              viewport={{ once: true }}
              className="
                rounded-2xl
                border border-white/10
                bg-white/5
                p-6
                text-center
                font-semibold
                text-yellow-300
                backdrop-blur-lg
                transition
                hover:border-cyan-400/40
                hover:bg-white/10
                hover:text-white
              "
            >
              {tech}
            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}