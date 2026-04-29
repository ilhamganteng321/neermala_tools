// components/preview/FrontCover.tsx
import type { InvitationData, ThemeType } from "@/data/types/invitations";
import { getThemeStyles } from "@/lib/theme-style";
import { formatDate } from "@/lib/utils";

interface FrontCoverProps {
  data: InvitationData;
  theme: ThemeType;
}

export function FrontCover({ data, theme }: FrontCoverProps) {
  const styles = getThemeStyles(theme);
  const formattedDate = formatDate(data.wedding.date);

  return (
    <div
      className={`w-full h-full rounded-xl shadow-2xl overflow-hidden ${styles.background}`}
    >
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-repeat" style={styles.pattern}></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
        {/* Decorative Border */}
        <div className="absolute inset-4 border border-current opacity-20 rounded-lg pointer-events-none"></div>

        {/* Initials */}
        <div className="mb-8">
          <span
            className={`font-script text-5xl md:text-6xl ${styles.textColor}`}
          >
            {data.couple.groomNickname.charAt(0)} &{" "}
            {data.couple.brideNickname.charAt(0)}
          </span>
        </div>

        {/* "&" symbol */}
        <div className={`font-serif text-2xl ${styles.accentColor} mb-4`}>
          &
        </div>

        {/* Couple Names (Nicknames) */}
        <div className="mb-8">
          <div
            className={`font-serif text-2xl md:text-3xl ${styles.textColor}`}
          >
            {data.couple.groomNickname}
          </div>
          <div
            className={`font-serif text-2xl md:text-3xl ${styles.textColor}`}
          >
            {data.couple.brideNickname}
          </div>
        </div>

        {/* Wedding Invitation Text */}
        <div className="mb-6">
          <p
            className={`font-sans text-xs tracking-widest ${styles.textColor} opacity-70 mb-2`}
          >
            INVITATION TO
          </p>
          <p
            className={`font-sans text-sm tracking-wider ${styles.textColor} opacity-90`}
          >
            OUR WEDDING CELEBRATION
          </p>
        </div>

        {/* Date */}
        <div className="mt-6">
          <div className={`font-serif text-lg ${styles.accentColor} mb-1`}>
            {formattedDate.split(",")[0]}
          </div>
          <div className={`font-sans text-sm ${styles.textColor} opacity-70`}>
            {formattedDate.split(",")[1]?.trim()}
          </div>
        </div>

        {/* Floral Decoration */}
        <div className="absolute bottom-8 left-0 right-0">
          <div className={`text-2xl ${styles.accentColor} opacity-30`}>
            ✿ ❀ ✿
          </div>
        </div>
      </div>
    </div>
  );
}
