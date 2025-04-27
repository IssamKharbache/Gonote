import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function HowItWorksSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="py-20 bg-blue-50 dark:bg-blue-900/20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h2 className="text-4xl font-bold text-blue-900 dark:text-blue-100 mb-6">
              <span className="text-blue-600 dark:text-blue-400">Minimal</span>{" "}
              Interface,{" "}
              <span className="text-blue-600 dark:text-blue-400">Maximum</span>{" "}
              Impact
            </h2>
            <p className="text-xl text-blue-700 dark:text-blue-300 mb-8">
              Our interface disappears when you need to focus, with thoughtful
              details that appear exactly when you need them.
            </p>

            <motion.div
              className="flex gap-4 mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex-1 bg-white dark:bg-blue-800 p-6 rounded-xl border border-blue-100 dark:border-blue-700">
                <div className="text-blue-600 dark:text-blue-400 text-2xl mb-2">
                  ✓
                </div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Dark Mode
                </h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Easy on the eyes, day or night
                </p>
              </div>
              <div className="flex-1 bg-white dark:bg-blue-800 p-6 rounded-xl border border-blue-100 dark:border-blue-700">
                <div className="text-blue-600 dark:text-blue-400 text-2xl mb-2">
                  ✓
                </div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Quick Entry
                </h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Add tasks in seconds
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-blue-800 bg-white dark:bg-slate-900">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400 opacity-10 dark:opacity-20"></div>
              <div className="relative h-96 p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-blue-900 dark:text-blue-100 font-bold text-xl">
                    Task tide
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <div className="w-3 h-3 rounded-full bg-blue-300"></div>
                    <div className="w-3 h-3 rounded-full bg-blue-200"></div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 1, body: "Finish project proposal", completed: true },
                    { id: 2, body: "Buy groceries", completed: false },
                    { id: 3, body: "Call mom", completed: false },
                    { id: 4, body: "Schedule team meeting", completed: true },
                    { id: 5, body: "Read new book", completed: false },
                  ].map((task) => (
                    <motion.div
                      key={task.id}
                      whileHover={{
                        backgroundColor: "rgba(241, 245, 249, 0.5)",
                      }}
                      className={`border rounded-2xl p-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300 w-full ${
                        task.completed ? "opacity-70" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-5 flex-1">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => {}}
                              className="appearance-none w-5 h-5 border-2 border-gray-300 rounded cursor-pointer checked:border-none checked:bg-blue-500 transition-colors duration-200"
                            />
                            {task.completed && (
                              <motion.svg
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute w-4 h-4 text-white pointer-events-none"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </motion.svg>
                            )}
                          </div>

                          <button className="flex-1 hover:underline cursor-pointer text-left p-0 border-none bg-transparent">
                            <div className="relative">
                              <motion.span
                                className={`block transition-opacity text-lg space-x-3 line-clamp-2 text-start ${
                                  task.completed
                                    ? "opacity-50 text-gray-400 dark:text-gray-500"
                                    : "text-black dark:text-white"
                                }`}
                              >
                                {task.body}
                              </motion.span>
                              {task.completed && (
                                <motion.div
                                  className="absolute left-0 top-1/2 h-0.5 bg-gray-400 origin-left"
                                  initial={{ scaleX: 0 }}
                                  animate={{ scaleX: 1 }}
                                  style={{ width: "calc(100% - 20px)" }}
                                />
                              )}
                            </div>
                          </button>
                        </div>

                        {!task.completed ? (
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        ) : (
                          <div className="bg-green-400 px-3 py-1 rounded-full text-xs uppercase text-white">
                            Done
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute bottom-6 left-6 right-6 bg-blue-600 dark:bg-blue-700 text-white p-4 rounded-lg shadow-lg"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold">New Task Added!</span>
                        <button className="text-blue-200 hover:text-white">
                          Dismiss
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="absolute -bottom-5 -right-5 bg-blue-600 dark:bg-blue-700 text-white p-3 rounded-full shadow-xl"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              className="absolute -bottom-5 -right-5 bg-blue-600 dark:bg-blue-700 text-white p-3 rounded-full shadow-xl"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
