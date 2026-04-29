// components/preview/BackCover.tsx
import { getThemeStyles } from "@/lib/theme-style";
import { QRCodeSVG } from "qrcode.react";
import { Calendar, MapPin, Clock, Phone, Globe, Users } from "lucide-react";
import type { InvitationData, ThemeType } from "@/data/types/invitations";

interface BackCoverProps {
  data: InvitationData;
  theme: ThemeType;
}

export function BackCover({ data, theme }: BackCoverProps) {
  const styles = getThemeStyles(theme);
  const qrValue = data.wedding.locationUrl || "https://maps.google.com";

  return (
    <div
      className={`w-full h-full rounded-xl shadow-2xl overflow-hidden ${styles.background} overflow-y-auto`}
    >
      <div className="relative h-full p-6">
        {/* Decorative Border */}
        <div className="absolute inset-4 border border-current opacity-20 rounded-lg pointer-events-none"></div>

        {/* Content */}
        <div className="relative h-full flex flex-col">
          {/* Couple Full Names */}
          <div className="text-center mb-6">
            <div
              className={`font-serif text-xl md:text-2xl ${styles.textColor} mb-1`}
            >
              {data.couple.groomName}
            </div>
            <div className={`font-serif text-lg ${styles.accentColor} mb-1`}>
              &
            </div>
            <div
              className={`font-serif text-xl md:text-2xl ${styles.textColor}`}
            >
              {data.couple.brideName}
            </div>
          </div>

          {/* Parents */}
          {(data.couple.groomParents || data.couple.brideParents) && (
            <div className="text-center mb-6 text-xs">
              <p className={`${styles.textColor} opacity-60`}>
                Putra dari {data.couple.groomParents}
              </p>
              <p className={`${styles.textColor} opacity-60`}>
                Putri dari {data.couple.brideParents}
              </p>
            </div>
          )}

          {/* Divider */}
          <div
            className={`w-12 h-px ${styles.accentColor} opacity-40 mx-auto my-4`}
          ></div>

          {/* Event Details */}
          <div className="space-y-3 mb-6">
            {/* Date */}
            <div className="flex items-start gap-3">
              <Calendar className={`w-4 h-4 ${styles.accentColor} mt-0.5`} />
              <div>
                <p
                  className={`font-sans text-xs font-semibold ${styles.textColor}`}
                >
                  DATE
                </p>
                <p
                  className={`font-serif text-sm ${styles.textColor} opacity-80`}
                >
                  {new Date(data.wedding.date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Times */}
            <div className="flex items-start gap-3">
              <Clock className={`w-4 h-4 ${styles.accentColor} mt-0.5`} />
              <div>
                <p
                  className={`font-sans text-xs font-semibold ${styles.textColor}`}
                >
                  TIME
                </p>
                <p
                  className={`font-sans text-sm ${styles.textColor} opacity-80`}
                >
                  Akad: {data.wedding.akadTime} WIB
                </p>
                <p
                  className={`font-sans text-sm ${styles.textColor} opacity-80`}
                >
                  Resepsi: {data.wedding.receptionTime} WIB
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <MapPin className={`w-4 h-4 ${styles.accentColor} mt-0.5`} />
              <div>
                <p
                  className={`font-sans text-xs font-semibold ${styles.textColor}`}
                >
                  LOCATION
                </p>
                <p
                  className={`font-sans text-sm ${styles.textColor} opacity-80`}
                >
                  {data.wedding.location}
                </p>
              </div>
            </div>

            {/* Dress Code */}
            {data.wedding.dressCode && (
              <div className="flex items-start gap-3">
                <Users className={`w-4 h-4 ${styles.accentColor} mt-0.5`} />
                <div>
                  <p
                    className={`font-sans text-xs font-semibold ${styles.textColor}`}
                  >
                    DRESS CODE
                  </p>
                  <p
                    className={`font-sans text-sm ${styles.textColor} opacity-80`}
                  >
                    {data.wedding.dressCode}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* QR Code */}
          <div className="flex justify-center my-4">
            <div className="bg-white p-2 rounded-lg shadow-md">
              <QRCodeSVG value={qrValue} size={120} />
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 -mt-2 mb-4">
            Scan for location
          </p>

          {/* RSVP & Website */}
          <div className="text-center space-y-2 mt-auto mb-2">
            {data.rsvp.whatsappNumber && (
              <div className="flex items-center justify-center gap-2">
                <Phone className={`w-3 h-3 ${styles.accentColor}`} />
                <p
                  className={`font-sans text-xs ${styles.textColor} opacity-80`}
                >
                  RSVP: {data.rsvp.whatsappNumber}
                </p>
              </div>
            )}

            {data.rsvp.weddingWebsite && (
              <div className="flex items-center justify-center gap-2">
                <Globe className={`w-3 h-3 ${styles.accentColor}`} />
                <p
                  className={`font-sans text-xs ${styles.textColor} opacity-80`}
                >
                  {data.rsvp.weddingWebsite}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-4">
            <p
              className={`font-script text-xs ${styles.accentColor} opacity-60`}
            >
              With love & blessings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
