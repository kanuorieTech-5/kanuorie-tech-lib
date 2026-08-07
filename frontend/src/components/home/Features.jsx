import { motion } from "framer-motion";

import {
  Laptop,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Rocket,
  Users,
} from "lucide-react";

import {
  Card,
  SectionTitle,
} from "../common";


const features = [
  {
    icon: Rocket,
    title: "Innovation Driven",
    description:
      "We create modern digital solutions using emerging technologies and creative approaches.",
  },
  {
    icon: Users,
    title: "Experienced Team",
    description:
      "Our developers and digital experts build reliable solutions focused on real business needs.",
  },
  {
    icon: GraduationCap,
    title: "Practical Learning",
    description:
      "Industry-focused courses designed to help learners build real-world technology skills.",
  },
  {
    icon: Laptop,
    title: "Modern Technologies",
    description:
      "We work with powerful technologies to create fast, scalable and maintainable applications.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Solutions",
    description:
      "Applications designed with reliability, performance and future growth in mind.",
  },
  {
    icon: BookOpen,
    title: "Continuous Support",
    description:
      "We provide maintenance, updates and guidance beyond project delivery.",
  },
];


export default function WhyChooseUs() {

  return (
    <section className="bg-slate-950 py-24">

      <div className="mx-auto max-w-7xl px-6 text-center lg:text-left text-white">

        <SectionTitle
          center
          badge="Why Choose Us"
          title="Building Technology That Creates Impact"
          subtitle="We combine innovation, expertise and practical solutions to help businesses and learners grow."
        />


        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {features.map((feature, index) => (

            <motion.div
              key={feature.title}
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.08,
              }}
              viewport={{
                once: true,
              }}
            >

              <Card
                className="
                  h-full
                  border-white/10
                  bg-white/5
                  backdrop-blur-xl
                  hover:border-cyan-400/40
                "
              >

                <feature.icon
                  size={42}
                  className="
                    mb-6
                    text-cyan-400
                  "
                />


                <h3 className="mb-3 text-xl font-semibold text-white">
                  {feature.title}
                </h3>


                <p className="text-slate-400">
                  {feature.description}
                </p>


              </Card>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}