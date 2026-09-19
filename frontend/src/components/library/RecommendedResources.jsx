import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { ResourceCard } from ".";

export default function RecommendedResources({
  resources,
  savedIds,
  savingId,
  onSave,

}) {
  if (!resources.length) return null;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 25,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="mb-10 px-4">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700"
          >
            <Sparkles size={16} />
            Recommended For You
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-4 text-3xl font-bold text-slate-900"
          >
            You Might Also Like
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="mt-2 max-w-2xl text-gray-600"
          >
            Based on the resources you've already saved, you may also like
            these.
          </motion.p>
        </div>

        <Link
          to="/Books"
          className="hidden items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-700 md:flex"
        >
          All
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* Resource Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.1,
        }}
        className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
      >
        {resources.slice(0, 4).map((resource) => (
          <motion.div
            key={resource.resourceId}
            variants={cardVariants}
            whileTap={{ scale: 0.97 }}
            className="min-w-0"
          >
            <ResourceCard
              resource={resource}
              isSaved={savedIds.includes(resource.resourceId)}
              saving={savingId === resource.resourceId}
              onSave={onSave}
            
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}