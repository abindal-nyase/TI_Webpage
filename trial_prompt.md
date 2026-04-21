You are given a task to integrate an existing React component in the codebase

The codebase should support:

- shadcn project structure
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles.
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:

```tsx
hyper-text-with-decryption.tsx
"use client";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Configuration ---
const SCRAMBLE_SPEED = 10; // Faster for a snappier feel
const CYCLES_PER_LETTER = 3; // More cycles for a "computational" look
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+"; // Uppercase + Symbols looks cleaner

interface HyperTextProps {
  text: string;
  className?: string;
  highlightWords?: string[];
}

interface WordProps {
  children: string;
  isDimmed: boolean; // True when another word is hovered
  isHighlightable: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

const Word = ({
  children,
  isDimmed,
  isHighlightable,
  onHoverStart,
  onHoverEnd,
}: WordProps) => {
  const [displayText, setDisplayText] = useState(children);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const scramble = useCallback(() => {
    let pos = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const scrambled = children
        .split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) return char;
          const randomChar = CHARS[Math.floor(Math.random() * CHARS.length)];
          return randomChar;
        })
        .join("");

      setDisplayText(scrambled);
      pos++;

      if (pos >= children.length * CYCLES_PER_LETTER) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(children);
      }
    }, SCRAMBLE_SPEED);
  }, [children]);

  const stopScramble = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayText(children);
  }, [children]);

  const handleMouseEnter = () => {
    if (isHighlightable) {
      setIsHovered(true);
      onHoverStart();
      scramble();
    }
  };

  const handleMouseLeave = () => {
    if (isHighlightable) {
      setIsHovered(false);
      onHoverEnd();
      stopScramble();
    }
  };

  return (
    <motion.span
      className={`
        relative inline-block font-mono font-medium whitespace-nowrap
        ${isHighlightable ? "cursor-pointer" : "cursor-default"}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        // Visual Logic:
        // 1. Hovered: Scale up, move up slightly
        // 2. Dimmed: Blur out, lower opacity
        // 3. Default: Normal
        scale: isHovered ? 1.1 : 1,
        y: isHovered ? -4 : 0,
        opacity: isDimmed && !isHovered ? 0.3 : 1,
        filter: isDimmed && !isHovered ? "blur(2px)" : "blur(0px)",
        color: isHovered ? "#FFFFFF" : isHighlightable ? "#2563eb" : "#1f2937", // White on hover, Blue if interactive, Gray default
        zIndex: isHovered ? 20 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Background Pill (Only Visible on Hover) */}
      <AnimatePresence>
        {isHovered && (
          <motion.span
            className="absolute -inset-2 rounded-lg bg-black z-[-1]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            layoutId="hover-bg"
            // High-quality shadow for depth
            style={{
              boxShadow:
                "0px 10px 25px -5px rgba(37, 99, 235, 0.4), 0px 8px 10px -6px rgba(0, 0, 0, 0.1)",
            }}
          />
        )}
      </AnimatePresence>

      {/* The Text Content */}
      <span className="relative z-10 px-1">{displayText}</span>

      {/* Decorative 'Tech' Corners (Only on Hover) */}
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full z-20"
            />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-500 rounded-full z-20"
            />
          </>
        )}
      </AnimatePresence>
    </motion.span>
  );
};

export default function HyperTextParagraph({
  text,
  className = "",
  highlightWords = [],
}: HyperTextProps) {
  const [isParagraphHovered, setIsParagraphHovered] = useState(false);

  const words = text.split(" ");

  // Clean helper for word matching
  const clean = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");

  return (
    <div className={`leading-relaxed tracking-wide ${className}`}>
      {words.map((word, i) => {
        const isHighlightable = highlightWords.some(
          (hw) => clean(hw) === clean(word)
        );

        return (
          <React.Fragment key={i}>
            <Word
              isDimmed={isParagraphHovered}
              isHighlightable={isHighlightable}
              onHoverStart={() => setIsParagraphHovered(true)}
              onHoverEnd={() => setIsParagraphHovered(false)}
            >
              {word}
            </Word>
            <span className="inline-block whitespace-pre"> </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}


demo.tsx
"use client";
import HyperTextParagraph from "@/components/ui/hyper-text-with-decryption";
import { motion } from "framer-motion";

export default function DemoOne() {
  const bio =
    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae, rerum.";

  // Key words to trigger the effect
  const triggers = ["ipsum", "amet", "adipisicing", "rerum"];

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-[120px]" />
        {/* Subtle Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl w-full relative z-10"
      >
        {/* Header Pill */}
        <div className="flex justify-center mb-8">
          <div className="bg-white border border-gray-200 shadow-sm px-4 py-1.5 rounded-full flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">
              Interactive Bio
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 md:p-16">
          <HyperTextParagraph
            text={bio}
            highlightWords={triggers}
            className="text-2xl md:text-4xl text-gray-800 font-normal leading-[1.6]"
          />
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-gray-400 text-sm font-mono">
          Hover highlighted keywords to decrypt
        </p>
      </motion.div>
    </div>
  );
}

```

Install NPM dependencies:

```bash
framer-motion
```

Implementation Guidelines

1. Analyze the component structure and identify all required dependencies
2. Review the component's argumens and state
3. Identify any required context providers or hooks and install them
4. Questions to Ask

- What data/props will be passed to this component?
- Are there any specific state management requirements?
- Are there any required assets (images, icons, etc.)?
- What is the expected responsive behavior?
- What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories

1. Install external dependencies
2. Fill image assets with Unsplash stock images you know exist
3. Use lucide-react icons for svgs or logos if component requires them/t
