import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "Gonote has transformed how I work. The dark mode is perfect for late-night productivity sessions.",
    author: "Alex Rivera",
    role: "Software Engineer",
    stars: 5,
  },
  {
    quote:
      "I've tried every todo app out there. None come close to the elegance and simplicity of Gonote.",
    author: "Sophie Chen",
    role: "Product Designer",
    stars: 5,
  },
  {
    quote:
      "The perfect balance between powerful features and beautiful design. My productivity has never been higher.",
    author: "James Wilson",
    role: "Entrepreneur",
    stars: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-white dark:bg-blue-950/50 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-blue-900 dark:text-blue-100 mb-4">
            Loved by{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Productivity
            </span>{" "}
            Enthusiasts
          </h2>
          <p className="text-xl text-blue-700 dark:text-blue-300 max-w-2xl mx-auto">
            Join thousands who have transformed their workflow
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-blue-50/50 dark:bg-blue-900/30 p-8 rounded-2xl border border-blue-100 dark:border-blue-800"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-blue-700 dark:text-blue-300 mb-6 italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-200 dark:bg-blue-700 mr-4 flex items-center justify-center text-blue-800 dark:text-blue-200 font-bold">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                    {testimonial.author}
                  </h4>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
