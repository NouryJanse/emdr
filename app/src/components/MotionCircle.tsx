import React, { ReactElement, useEffect, useState } from "react";
import { motion } from "framer-motion";

type MotionCircleProps = {
  isAnimating: any;
  size: any;
  speed: any;
  color: any;
  hideAnimation: any;
};

const MotionCircle: React.FC<MotionCircleProps> = ({
  isAnimating,
  size,
  speed,
  color,
  hideAnimation,
}): ReactElement => {
  const [key, setKey] = useState<number>(Date.now());

  // rerenders the animation on change of speed input
  useEffect(() => {
    setKey(Date.now());
  }, [speed]);

  return (
    <div className="flex flex-col h-full justify-center overflow-hidden">
      {isAnimating && size && speed && color && !hideAnimation && (
        <>
          <div className="">
            <motion.div
              key={key}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                borderRadius: "50%",
              }}
              initial={{ x: "-100%" }}
              animate={{ x: "100vw" }}
              transition={{
                duration: speed / 20,
                ease: "linear",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            ></motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default MotionCircle;
