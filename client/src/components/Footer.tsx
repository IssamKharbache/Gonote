import { motion } from "framer-motion";
export default function Footer() {
  return (
    <footer className="bg-blue-600 dark:bg-blue-950 text-blue-100 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-4xl font-bold mb-3">TaskTide</h3>

            <p className="text-blue-300 mb-4">
              The most elegant todo app for professionals and creatives alike.
            </p>
            <div className="flex gap-4">
              {["twitter", "github", "linkedin", "figma"].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ y: -3 }}
                  className="text-blue-300 hover:text-white transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {["Features", "Pricing", "Integrations", "Updates"].map(
                (item) => (
                  <motion.li key={item} whileHover={{ x: 5 }}>
                    <a
                      href="#"
                      className="text-blue-300 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </motion.li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {["Documentation", "Tutorials", "Blog", "Community"].map(
                (item) => (
                  <motion.li key={item} whileHover={{ x: 5 }}>
                    <a
                      href="#"
                      className="text-blue-300 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </motion.li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {["About", "Careers", "Privacy", "Terms"].map((item) => (
                <motion.li key={item} whileHover={{ x: 5 }}>
                  <a
                    href="#"
                    className="text-blue-300 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} TaskTide. All rights reserved.
          </p>
          <p className="ml-4">
            Made with ❤️ by
            <a
              href="https://kharbache.vercel.app/"
              className="underline font-semibold"
            >
              {" "}
              Issam Kharbache{" "}
            </a>
            &middot; © {new Date().getFullYear()}
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-blue-300 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-blue-300 hover:text-white transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-blue-300 hover:text-white transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
