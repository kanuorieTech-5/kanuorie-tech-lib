import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function LibraryCard({ title, desc, link }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white shadow-md rounded-2xl p-6 border"
    >
      <BookOpen className="text-purple-600 mb-4" />

      <h3 className="font-semibold text-lg">{title}</h3>

      <p className="text-gray-500 text-sm mt-2">{desc}</p>

      <a
        href={link}
        target=""
        rel="noopener noreferrer"
      >
        <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-xl text-sm w-full">
          Open
        </button>
      </a>
    </motion.div>
    
  );
}