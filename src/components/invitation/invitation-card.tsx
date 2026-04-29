// components/preview/InvitationCard.tsx
import { useState } from "react";
import { FrontCover } from "./invitation-front";
import { BackCover } from "./invitation-back";
import type { InvitationData, ThemeType } from "@/data/types/invitations";

interface InvitationCardProps {
  data: InvitationData;
  theme: ThemeType;
}

export function InvitationCard({ data, theme }: InvitationCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center">
      {/* Card Container with 3D Flip */}
      <div
        className="relative w-full max-w-md aspect-3/4 cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}
        >
          {/* Front Side */}
          <div className="absolute w-full h-full backface-hidden">
            <FrontCover data={data} theme={theme} />
          </div>

          {/* Back Side */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <BackCover data={data} theme={theme} />
          </div>
        </div>
      </div>

      {/* Flip Instruction */}
      <p className="mt-4 text-sm text-gray-500">
        {isFlipped ? "Tap to see front" : "Tap to see back"}
      </p>
    </div>
  );
}
