import { useAuthStore } from "@/zustand/store";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function HeroSection() {
  const { isAuthenticated } = useAuthStore();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <section className="relative h-screen overflow-hidden flex items-center justify-center font-manrope">
      <motion.div
        className="absolute inset-0 z-0 opacity-20 dark:opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          y: backgroundY,
        }}
      />

      <div className="container mx-auto px-6 z-10 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-blue-900 dark:text-blue-100 mb-6 "
            style={{ y: textY }}
          >
            <span className="block">Ride the</span>
            <span className="relative inline-block">
              <span className="relative z-10">Productivity Wave</span>
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="absolute bottom-0 left-0 h-4 bg-blue-400 dark:bg-blue-600 opacity-40 z-0"
              />
            </span>
          </motion.h1>
          <p className="text-xl md:text-2xl text-blue-700 dark:text-blue-300 mb-10 max-w-3xl mx-auto">
            The most elegant way to manage your tasks. Dark mode included by
            default.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to={isAuthenticated ? "/todos/create" : "/login"}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-all cursor-pointer"
            >
              Start For Free
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          className="w-10 h-10 text-blue-600 dark:text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </section>
  );
}

export default HeroSection;
