import { motion } from "framer-motion";
import {
  Lightbulb,
  Target,
  BookOpen,
  Code2,
  ShoppingBag,
  ShieldCheck,
  Users,
  Rocket,
  Heart,
  CheckCircle2,
} from "lucide-react";

import {
  Stats,
  TechStack,
  CTA,
  Newsletter,
} from "../components/home";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We continuously explore better ideas, technologies, and approaches to solving problems while remaining open to new possibilities and emerging technologies.",
  },
  {
    icon: Target,
    title: "Practicality",
    description:
      "We focus on creating solutions that are useful, accessible, reliable, and capable of solving real problems rather than building technology simply for its own sake.",
  },
  {
    icon: BookOpen,
    title: "Continuous Learning",
    description:
      "We believe continuous learning is essential for personal growth, professional development, and technological progress in an increasingly digital world.",
  },
  {
    icon: Heart,
    title: "Meaningful Impact",
    description:
      "We measure success by the value our technology, services, products, and educational resources create for individuals, businesses, and organizations.",
  },
];

const areas = [
  {
    icon: Code2,
    title: "Software & Web Development",
    description:
      "We design and develop modern websites, web applications, dashboards, e-commerce platforms, learning systems, and custom digital solutions.",
  },
  {
    icon: BookOpen,
    title: "Education & Learning",
    description:
      "We provide courses, tutorials, books, notes, guides, and practical learning resources designed to help people develop useful digital and technology skills.",
  },
  {
    icon: ShoppingBag,
    title: "Digital Products",
    description:
      "We create and provide practical digital products, templates, resources, tools, and educational materials designed to save time and improve productivity.",
  },
  {
    icon: Rocket,
    title: "Digital Innovation",
    description:
      "We transform ideas and problems into practical digital projects that demonstrate creativity, technical capability, experimentation, and real-world problem solving.",
  },
  {
    icon: Users,
    title: "Technology Services",
    description:
      "We help businesses, entrepreneurs, organizations, and individuals transform ideas and operational needs into functional digital experiences.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Digital Experiences",
    description:
      "Security, authentication, authorization, controlled access, responsible data handling, and continuous improvement remain important parts of our development process.",
  },
];

const futureGoals = [
  "Expand our educational ecosystem",
  "Develop more practical digital products",
  "Build innovative software solutions",
  "Create opportunities for technology learners",
  "Support businesses and entrepreneurs",
  "Encourage collaboration and knowledge sharing",
];

export default function About() {
  return (
    <>
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-28 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:45px_45px]" />

        <div className="relative mx-auto max-w-6xl px-6 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-blue-400">
              About KanuorieTech
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mx-auto mt-8 max-w-5xl text-5xl font-black leading-tight tracking-tight md:text-6xl lg:text-7xl"
          >
            Building Technology.
            <span className="block text-blue-400">
              Creating Opportunities.
            </span>
            Empowering People.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl"
          >
            KanuorieTech is a technology-driven digital ecosystem focused
            on building practical digital solutions, providing technology
            services, creating educational resources, and helping individuals
            and organizations grow through technology.
          </motion.p>
        </div>
      </section>

      {/* =====================================================
          COMPANY OVERVIEW
      ===================================================== */}
      <section className="bg-slate-50 py-24 text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Company Documentation
            </p>

            <h2 className="text-4xl text-black font-bold tracking-tight md:text-5xl">
              Who We Are
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
              A growing technology ecosystem built around innovation,
              education, digital solutions, creativity, and meaningful impact.
            </p>
          </div>

          {/* COMPANY STATS */}
          <div className="mb-20">
            {/* <Stats /> */}
          </div>

          {/* DOCUMENTATION */}
          <article className="space-y-10 text-lg leading-9 text-slate-900">
            <p>
              KanuorieTech was created with a simple but powerful vision:
              to make technology more accessible, practical, useful, and
              impactful for individuals, learners, entrepreneurs, businesses,
              and organizations. Technology continues to transform the way
              people communicate, learn, work, build businesses, access
              information, and solve problems. However, having access to
              technology does not automatically mean having the knowledge or
              resources required to use it effectively. KanuorieTech exists
              to help bridge that gap by combining technology, education,
              digital services, creativity, and practical solutions within
              one growing digital ecosystem.
            </p>

            <p>
              At its core, KanuorieTech is a technology and digital innovation
              company that develops and provides solutions designed around
              real user needs. Our approach is centered on identifying
              problems, understanding the people affected by those problems,
              and using technology to create solutions that are practical,
              scalable, accessible, and easy to use. Rather than building
              technology simply because it is possible, we focus on building
              products and services that have a clear purpose and provide
              meaningful value to users.
            </p>

            <p>
              One of the important areas of KanuorieTech is software and web
              development. We design and develop modern digital experiences
              for businesses, organizations, entrepreneurs, communities, and
              individuals. Our development approach focuses on creating
              responsive, intuitive, secure, and user-friendly applications
              that work effectively across different devices and screen
              sizes. From business websites and landing pages to interactive
              web applications, dashboards, e-commerce platforms, learning
              systems, and other custom digital solutions, KanuorieTech
              approaches every project with attention to functionality,
              usability, performance, and long-term maintainability.
            </p>

            <p>
              KanuorieTech also recognizes that technology is not only about
              software development. A successful digital presence requires a
              combination of good design, clear communication, reliable
              infrastructure, useful content, strategic thinking, and
              continuous improvement. For this reason, our services extend
              beyond writing code. We aim to support clients and users
              throughout their digital journey by helping them transform
              ideas into functional digital products and by providing the
              resources and knowledge required to operate and grow those
              products effectively.
            </p>

            <p>
              Education is another major part of the KanuorieTech ecosystem.
              Technology is constantly evolving, and individuals who want to
              remain relevant need opportunities to continuously learn and
              improve their skills. KanuorieTech is therefore designed to
              serve not only as a technology company but also as a learning
              platform. Through courses, tutorials, books, notes, guides,
              educational resources, and practical learning materials, the
              platform aims to make knowledge more accessible to people at
              different stages of their learning journey.
            </p>

            <p>
              Our educational philosophy is based on practical learning. We
              believe that learning technology should go beyond memorizing
              definitions or watching tutorials without applying the
              knowledge. Learners should have opportunities to understand
              concepts, practice what they have learned, build projects,
              solve problems, make mistakes, debug their work, and gradually
              develop the confidence required to use their skills in
              real-world situations. KanuorieTech therefore aims to encourage
              project-based learning and continuous experimentation as
              important parts of the learning experience.
            </p>

            <p>
              The KanuorieTech e-library and digital resource ecosystem is
              designed to support this educational vision by bringing useful
              learning materials into a centralized environment. Instead of
              requiring users to search through multiple disconnected
              sources, the platform can provide access to books, notes,
              guides, courses, tutorials, and other digital resources through
              an organized system. This structure makes it easier for users
              to discover information, continue learning, and build their
              personal knowledge base over time.
            </p>

            <p>
              KanuorieTech also places importance on digital products.
              Digital products can provide individuals and businesses with
              practical tools that save time, improve productivity, organize
              information, simplify repetitive tasks, or support professional
              development. Through its digital product ecosystem, KanuorieTech
              aims to create and provide useful resources such as templates,
              educational materials, digital tools, guides, and other
              technology-driven products that can provide immediate and
              long-term value to users.
            </p>

            <p>
              Another important component of KanuorieTech is project
              development. Projects provide an opportunity to transform ideas
              into tangible solutions. Every project represents a problem, an
              idea, an experiment, or an opportunity to learn something new.
              Our project ecosystem allows us to showcase digital solutions
              that demonstrate our capabilities, creativity, technical growth,
              and commitment to solving real-world problems through technology.
            </p>

            <p>
              We believe that a strong technology ecosystem should also
              encourage collaboration and community. Technology becomes more
              powerful when people are able to share knowledge, exchange
              ideas, ask questions, collaborate on projects, and learn from
              one another. KanuorieTech is therefore being developed with
              community and user engagement in mind. Our goal is to create an
              environment where learners, developers, entrepreneurs,
              professionals, creators, and technology enthusiasts can
              discover useful information, access resources, develop skills,
              and explore opportunities.
            </p>

            <p>
              Security and responsible technology development are also
              important principles behind the KanuorieTech platform. Modern
              digital applications handle information that users expect to
              remain protected. For this reason, authentication,
              authorization, data protection, secure communication,
              controlled access, and responsible handling of user information
              are considered important parts of the platform's development
              process. As the platform continues to evolve, security remains
              an area that requires continuous attention, improvement, and
              adaptation to emerging technological challenges.
            </p>

            <p>
              KanuorieTech is also built around the principle of continuous
              improvement. Technology changes rapidly, and a platform that
              remains static can quickly become outdated. We therefore
              approach development as an ongoing process rather than a
              one-time activity. New features, improvements, resources,
              services, products, and learning opportunities can continue to
              be introduced as user needs evolve and new technologies become
              available.
            </p>

            <p>
              Our vision extends beyond simply becoming another technology
              platform. KanuorieTech aims to develop into a broader digital
              ecosystem where technology, education, creativity,
              entrepreneurship, and innovation work together. We want the
              platform to become a place where someone can discover a course,
              read a useful book, access a digital resource, learn a technical
              skill, find a technology service, explore a project, purchase a
              useful digital product, or discover an opportunity to improve
              their professional and personal capabilities.
            </p>

            <p>
              For businesses and organizations, KanuorieTech represents a
              technology partner capable of helping transform ideas and
              operational needs into digital experiences. For learners, it
              represents a place to acquire knowledge and develop practical
              skills. For creators and developers, it can serve as an
              environment for experimentation, collaboration, and showcasing
              work. For entrepreneurs, it can provide digital resources and
              technology services that support the development and growth of
              their ideas.
            </p>

            <p>
              Our long-term objective is to build technology that creates
              value beyond the screen. A successful digital solution should
              not simply look good; it should solve a problem, improve an
              experience, save time, provide knowledge, create opportunities,
              or make something easier. This principle influences how we
              think about products, services, educational resources, and
              software development at KanuorieTech.
            </p>

            <p>
              As KanuorieTech continues to grow, our commitment remains
              focused on learning, innovation, accessibility, quality, and
              meaningful impact. We understand that building a technology
              company is a continuous journey that requires experimentation,
              resilience, adaptation, and an openness to learning from both
              successes and failures. Every project, feature, resource, and
              interaction contributes to that journey and provides an
              opportunity to improve what comes next.
            </p>

            <p>
              Ultimately, KanuorieTech exists to demonstrate what is possible
              when technology is combined with knowledge, creativity, and a
              genuine desire to solve problems. Whether through software
              development, digital products, educational resources, technology
              services, project development, or community-driven learning,
              our goal is to contribute to a more digitally capable and
              empowered generation. We are building not just individual
              products, but an ecosystem where people can learn, create,
              connect, solve problems, and grow with technology.
            </p>
          </article>
        </div>
      </section>

      {/* =====================================================
          WHAT WE DO
      ===================================================== */}
      <section className="bg-slate-50 py-4">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Our Ecosystem
            </p>

            <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              What We Do
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              KanuorieTech brings technology, education, digital products,
              services, and innovation together within one growing ecosystem.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {areas.map((area, index) => {
              const Icon = area.icon;

              return (
                <motion.div
                  key={area.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon size={28} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {area.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    {area.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          MISSION & VISION
      ===================================================== */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-slate-950 p-10 text-white"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <Target size={28} />
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                Our Mission
              </p>

              <h2 className="mt-4 text-3xl font-bold">
                Making Technology Practical and Accessible
              </h2>

              <p className="mt-6 leading-8 text-slate-400">
                Our mission is to use technology, education, creativity, and
                practical digital solutions to help individuals,
                entrepreneurs, businesses, and organizations solve problems,
                develop skills, improve their digital capabilities, and
                create meaningful opportunities.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-blue-100 bg-blue-50 p-10"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                <Rocket size={28} />
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Our Vision
              </p>

              <h2 className="mt-4 text-3xl font-bold text-slate-900">
                Building a Digital Ecosystem for Growth
              </h2>

              <p className="mt-6 leading-8 text-slate-600">
                Our vision is to build a broader digital ecosystem where
                technology, education, creativity, entrepreneurship, and
                innovation work together to create opportunities for people
                to learn, create, connect, solve problems, and grow.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CORE VALUES
      ===================================================== */}
      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              What Guides Us
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Our Core Values
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              The principles that influence how we build, teach, serve,
              collaborate, and grow.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-xl font-bold">
                    {value.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      <Stats />
      {/* =====================================================
          FUTURE
      ===================================================== */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Looking Ahead
              </p>

              <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Building What Comes Next
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                KanuorieTech is being developed as a long-term technology
                ecosystem. As technology and user needs evolve, we intend to
                continue improving our products, services, educational
                resources, and digital experiences.
              </p>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Our future is centered around creating useful technology,
                expanding access to knowledge, supporting innovation, and
                creating an environment where people can continuously learn
                and grow.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-950 p-8 text-white md:p-10">
              <h3 className="text-2xl font-bold">
                Our Long-Term Focus
              </h3>

              <div className="mt-8 space-y-5">
                {futureGoals.map((goal) => (
                  <div
                    key={goal}
                    className="flex items-start gap-4"
                  >
                    <CheckCircle2
                      size={22}
                      className="mt-1 shrink-0 text-blue-400"
                    />

                    <span className="leading-7 text-slate-300">
                      {goal}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TECHNOLOGY STACK
      ===================================================== */}
      <TechStack />

      {/* =====================================================
          NEWSLETTER
      ===================================================== */}
      <Newsletter />

      {/* =====================================================
          CTA
      ===================================================== */}
      <CTA />
    </>
  );
}