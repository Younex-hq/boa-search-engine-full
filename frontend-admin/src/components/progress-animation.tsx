import * as ProgressPrimitive from "@radix-ui/react-progress";
import { useEffect, useState } from "react";

export default function ProgressAnimation() {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-[60%]">
      <style>
        {`@keyframes progress {
            to {
              left: calc(100% - 2rem);
            }
          }
          .progress {
            transform-origin: center;
            animation: progress 1.25s ease-in-out infinite;
          }
          `}
      </style>
      <ProgressPrimitive.Root className="bg-primary/20 relative h-2 w-full overflow-hidden rounded-full">
        <ProgressPrimitive.Indicator
          className="bg-primary relative h-full w-full flex-1 transition-all"
          style={{ transform: `translateX(-${100 - (progress || 0)}%)` }}
        >
          <div className="bg-primary-foreground progress absolute inset-y-0 left-0 h-full w-6 blur-[10px]" />
        </ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>
    </div>
  );
}
