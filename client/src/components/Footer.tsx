import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const socials = [
  {
    name: "X",
    icon: FaXTwitter,
  },
  {
    name: "Github",
    icon: FaGithub,
  },
  {
    name: "Linkedin",
    icon: FaLinkedin,
  },
  {
    name: "Linkedin",
    icon: FaYoutube,
  },
];
export default function Footer() {
  return (
    <footer className="bg-blue-400 dark:bg-blue-950 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-4xl font-bold mb-3">TaskTide</h3>

            <p className="text-blue-100 mb-4">
              The most elegant todo app for professionals and creatives alike.
            </p>
            <div className="flex gap-4">
              {socials.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={idx}
                    href="#"
                    whileHover={{ y: -3 }}
                    className="text-blue-300 hover:text-white transition-colors"
                  >
                    <Icon />
                  </motion.a>
                );
              })}
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
                      className="text-blue-200 hover:text-white transition-colors"
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
                      className="text-blue-200 hover:text-white transition-colors"
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
                    className="text-blue-200 hover:text-white transition-colors"
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
