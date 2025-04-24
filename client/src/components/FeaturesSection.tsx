import { motion } from "framer-motion";

const features = [
  {
    title: "Intelligent Task Sorting",
    description: "Automatically organizes tasks by priority and due date",
    icon: "🧠",
  },
  {
    title: "Seamless Sync",
    description: "Real-time updates across all your devices",
    icon: "⚡",
  },
  {
    title: "Focus Mode",
    description: "Minimalist interface that helps you concentrate",
    icon: "🎯",
  },
  {
    title: "Natural Language",
    description: "Create tasks by typing like you talk",
    icon: "💬",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white dark:bg-blue-950/50 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-bold text-blue-900 dark:text-blue-100 mb-4">
            Designed for{" "}
            <span className="text-blue-600 dark:text-blue-400">Deep Work</span>
          </h2>
          <p className="text-xl text-blue-700 dark:text-blue-300 max-w-2xl mx-auto">
            Every feature crafted to minimize friction and maximize focus
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-blue-50/50 dark:bg-blue-900/30 p-8 rounded-2xl border border-blue-100 dark:border-blue-800 hover:shadow-lg transition-all"
            >
              <div className="text-5xl mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-900 dark:text-blue-100">
                {feature.title}
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
