import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-20 bg-blue-500 dark:bg-blue-900   rounded-t-full">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to <span className="text-blue-200">transform</span> your
            productivity?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands who have already streamlined their workflow with
            Gonote.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-10 py-5 rounded-full text-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Get Started - It's Free
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
