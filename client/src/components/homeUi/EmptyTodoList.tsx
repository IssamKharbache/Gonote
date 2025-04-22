import { motion } from "framer-motion";

export const EmptyTodoList = ({ text }: { text: string }) => {
  return (
    <div className="max-w-xl mx-auto mt-12 p-5">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Animated Image */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [-2, 5, -2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <img
            src="/notask.png"
            alt="No tasks found"
            className="w-40 md:w-72"
          />
        </motion.div>

        {/* Text Content */}
        <div className="w-full space-y-3">
          <h1 className="text-4xl font-semibold text-blue-600 dark:text-blue-400">
            TIME TO RELAX!
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default EmptyTodoList;
