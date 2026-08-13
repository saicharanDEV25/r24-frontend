import { motion } from "framer-motion";

// Fades/slides content up as it scrolls into view, once per element.
function ScrollReveal({ children, delay = 0, y = 40, className }) {
  return (
    <motion.div
      className={className}
      style={{ height: "100%" }}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default ScrollReveal;
