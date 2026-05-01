// src/components/funfact/funfact-preview.tsx
import type { FunFact } from "@/data/types/funfact";
import { forwardRef } from "react";

interface FunFactPreviewProps {
  funfactHook: {
    funfact: FunFact;
  };
}

export const FunFactPreview = forwardRef<HTMLDivElement, FunFactPreviewProps>(
  ({ funfactHook }, ref) => {
    const { funfact } = funfactHook;

    return (
      // ref menunjuk ke outer wrapper — clone technique di container akan handle sisanya
      <div
        ref={ref}
        id="funfact-card"
        className="bg-white p-6 w-115 rounded-2xl"
      >
        <div className="bg-linear-to-br from-orange-100 via-amber-50 to-teal-50 p-3 rounded-2xl shadow-2xl">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200">
            {/* macOS Top Bar */}
            <div className="h-10 bg-zinc-100 flex items-center px-3 border-b rounded-t-xl">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 text-center text-[10px] font-medium text-gray-500 tracking-wide">
                FUN FACT
              </div>
            </div>

            {/* Content — NO overflow, NO maxHeight di sini */}
            <div className="p-4 bg-white rounded-b-xl">
              {/* Image */}
              <div className="mb-4">
                <div className="w-[70%] mx-auto aspect-square bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl border border-gray-100 relative overflow-hidden">
                  {funfact.image ? (
                    <img
                      src={funfact.image}
                      alt="Fun Fact Illustration"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-white/80 backdrop-blur rounded-xl flex items-center justify-center shadow-inner text-3xl">
                          🧠
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2">
                          Gambar Otak
                        </p>
                      </div>
                    </div>
                  )}
                  {/* Sparkles */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute text-yellow-300 text-lg"
                        style={{
                          left: `${10 + i * 15}%`,
                          top: `${10 + (i % 3) * 15}%`,
                        }}
                      >
                        ✨
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slider bar */}
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full mx-2">
                  <div className="h-full w-1/3 bg-orange-400 rounded-full" />
                </div>
              </div>

              {/* Text */}
              <div className="space-y-2">
                <div className="uppercase tracking-wider text-orange-500 text-[10px] font-bold">
                  {funfact.label}
                </div>
                <h1 className="text-lg font-bold leading-tight text-gray-900">
                  {funfact.title}
                </h1>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-xs">
                  {funfact.description}
                </div>
                <p className="text-[10px] text-teal-600 font-medium pt-2 border-t mt-2">
                  Bagikan fakta menarik ini ke teman-temanmu!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

FunFactPreview.displayName = "FunFactPreview";
