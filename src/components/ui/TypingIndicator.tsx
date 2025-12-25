import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-primary"
          initial={{ opacity: 0.4, scale: 0.6 }}
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: i * 0.16,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
