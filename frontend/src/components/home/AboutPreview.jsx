import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo.jpeg";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  BookOpen,
  Briefcase,
} from "lucide-react";

import {
  Card,
  Button,
  SectionTitle,
} from "../common";


const highlights = [
  "Custom Software Development",
  "Digital Learning Platform",
  "Professional IT Consulting",
  "Modern Web & Mobile Applications",
];


const stats = [
  {
    icon: Briefcase,
    value: "120+",
    label: "Projects",
  },
  {
    icon: BookOpen,
    value: "350+",
    label: "Books",
  },
  {
    icon: Code2,
    value: "40+",
    label: "Courses",
  },
];

export default function AboutPreview() {

  return (
    <section className="bg-slate-950 py-10">
      <div className="px-6">
        <SectionTitle
          Badge="About KanuorieTech"
          title="Building Technology That Solves Real Problems"
          subtitle="We create digital solutions for businesses while empowering the next generation of developers through practical learning."
        />
        <div className="mt-16 grid items-center gap-16 lg:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="
              rounded-3xl
              border
              border-white/10
              bg-white/5
              p-3
              backdrop-blur-xl
            ">

              <img
                src={logo}
                alt="KanuorieTech"
                className="
                  rounded-2xl
                  shadow-2xl
                "
              />

            </div>
            <Card
              className="
                absolute
                -bottom-6
                -right-6
                hidden
                w-64
                border-white/10
                bg-white/10
                backdrop-blur-xl
                lg:block
              "
            >

              <p className="text-4xl font-bold text-cyan-400">
                98%
              </p>

              <p className="mt-2 text-slate-300">
                Client Satisfaction
              </p>

            </Card>
          </motion.div>
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="
              rounded-full
              border
              border-cyan-400/20
              bg-cyan-400/10
              px-4
              py-2
              text-sm
              font-semibold
              text-cyan-300
            ">
              Innovation • Quality • Growth
            </span>
            <h3 className="
              mt-6
              text-4xl
              font-bold
              text-white
            ">
              Building Solutions That Matter
            </h3>
            <p className="
              mt-6
              leading-8
              text-slate-400
            ">
              KanuorieTech is a technology company focused on
              developing scalable software, digital products,
              and practical learning experiences. We combine
              technology and creativity to help businesses and
              individuals succeed in the digital economy.
            </p>
            <div className="mt-8 space-y-4">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2
                    className="
                      h-5
                      w-5
                      text-cyan-400
                    "
                  />
                  <span className="text-slate-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats */}

            <div className="
              mt-10
              grid
              grid-cols-3
              gap-4
            ">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={stat.label}
                    className="
                      border-white/10
                      bg-white/5

                      text-center
                      backdrop-blur-xl
                    "
                  >
                    <Icon
                      className="
                        mx-auto
                        h-6
                        w-6
                        text-cyan-400
                      "
                    />
                    <h4 className="
                      mt-3
                      text-2xl
                      font-bold
                      text-white
                    ">
                      {stat.value}
                    </h4>
                    <p className="text-sm text-slate-400">
                      {stat.label}
                    </p>
                  </Card>
                );
              })}
            </div>
            {/* Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/about">
                <Button>
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button variant="outline" className="text-blue-300">
                  View Portfolio
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}