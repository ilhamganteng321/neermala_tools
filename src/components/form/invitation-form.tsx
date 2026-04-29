// components/forms/InvitationForm.tsx
import type { InvitationData } from "@/data/types/invitations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  Calendar,
  MapPin,
  MessageSquare,
  Clock,
  Shirt,
  Globe,
  Phone,
} from "lucide-react";

interface InvitationFormProps {
  data: InvitationData;
  onChange: (data: InvitationData) => void;
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center mt-0.5">
        <Icon className="w-4 h-4 text-rose-400" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function FieldWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`group ${className}`}>{children}</div>;
}

function StyledLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <Label
      htmlFor={htmlFor}
      className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block"
    >
      {children}
    </Label>
  );
}

export function InvitationForm({ data, onChange }: InvitationFormProps) {
  const updateField = <K extends keyof InvitationData>(
    section: K,
    field: string,
    value: string,
  ) => {
    onChange({
      ...data,
      [section]: {
        ...data[section],
        [field]: value,
      },
    });
  };

  const inputClass =
    "h-10 text-sm border-3 border-secondary border-border bg-transparent px-2 " +
    "focus-visible:ring-0 focus-visible:border-rose-400 " +
    "placeholder:text-muted-foreground/40 text-foreground transition-colors rounded-md";

  const textareaClass =
    "text-sm border-3 border-secondary border-border rounded-none bg-transparent px-0 " +
    "focus-visible:ring-0 focus-visible:border-rose-400 " +
    "placeholder:text-muted-foreground/40 text-foreground transition-colors resize-none";

  return (
    <div className="space-y-1">
      {/* ── Informasi Mempelai ── */}
      <section className="bg-card rounded-2xl p-6 shadow-sm border border-border">
        <SectionHeader
          icon={Heart}
          title="Informasi Mempelai"
          subtitle="Nama lengkap dan orang tua kedua mempelai"
        />

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            <FieldWrapper>
              <StyledLabel htmlFor="groomName">Nama Lengkap Pria</StyledLabel>
              <Input
                id="groomName"
                value={data.couple.groomName}
                onChange={(e) =>
                  updateField("couple", "groomName", e.target.value)
                }
                placeholder="Ahmad Fathoni"
                className={inputClass}
              />
            </FieldWrapper>
            <FieldWrapper>
              <StyledLabel htmlFor="brideName">Nama Lengkap Wanita</StyledLabel>
              <Input
                id="brideName"
                value={data.couple.brideName}
                onChange={(e) =>
                  updateField("couple", "brideName", e.target.value)
                }
                placeholder="Sarah Azzahra"
                className={inputClass}
              />
            </FieldWrapper>

            <FieldWrapper>
              <StyledLabel htmlFor="groomNickname">Panggilan Pria</StyledLabel>
              <Input
                id="groomNickname"
                value={data.couple.groomNickname}
                onChange={(e) =>
                  updateField("couple", "groomNickname", e.target.value)
                }
                placeholder="Ahmad"
                className={inputClass}
              />
            </FieldWrapper>
            <FieldWrapper>
              <StyledLabel htmlFor="brideNickname">
                Panggilan Wanita
              </StyledLabel>
              <Input
                id="brideNickname"
                value={data.couple.brideNickname}
                onChange={(e) =>
                  updateField("couple", "brideNickname", e.target.value)
                }
                placeholder="Sarah"
                className={inputClass}
              />
            </FieldWrapper>
          </div>

          <div className="border-t border-dashed border-border pt-4">
            <p className="text-[11px] text-muted-foreground/60 uppercase tracking-wider mb-4">
              Nama Orang Tua
            </p>
            <div className="grid grid-cols-2 gap-x-6">
              <FieldWrapper>
                <StyledLabel htmlFor="groomParents">Orang Tua Pria</StyledLabel>
                <Input
                  id="groomParents"
                  value={data.couple.groomParents}
                  onChange={(e) =>
                    updateField("couple", "groomParents", e.target.value)
                  }
                  placeholder="Bp. & Ibu Budi Santoso"
                  className={inputClass}
                />
              </FieldWrapper>
              <FieldWrapper>
                <StyledLabel htmlFor="brideParents">
                  Orang Tua Wanita
                </StyledLabel>
                <Input
                  id="brideParents"
                  value={data.couple.brideParents}
                  onChange={(e) =>
                    updateField("couple", "brideParents", e.target.value)
                  }
                  placeholder="Bp. & Ibu Rizki Firmansyah"
                  className={inputClass}
                />
              </FieldWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* ── Detail Pernikahan ── */}
      <section className="bg-card rounded-2xl p-6 shadow-sm border border-border">
        <SectionHeader
          icon={Calendar}
          title="Detail Pernikahan"
          subtitle="Tanggal, waktu, dan lokasi acara"
        />

        <div className="space-y-5">
          <FieldWrapper>
            <StyledLabel htmlFor="date">Tanggal Pernikahan</StyledLabel>
            <Input
              id="date"
              type="date"
              value={data.wedding.date}
              onChange={(e) => updateField("wedding", "date", e.target.value)}
              className={inputClass}
            />
          </FieldWrapper>

          <div className="grid grid-cols-2 gap-x-6">
            <FieldWrapper>
              <StyledLabel htmlFor="akadTime">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Waktu Akad
                </span>
              </StyledLabel>
              <Input
                id="akadTime"
                type="time"
                value={data.wedding.akadTime}
                onChange={(e) =>
                  updateField("wedding", "akadTime", e.target.value)
                }
                className={inputClass}
              />
            </FieldWrapper>
            <FieldWrapper>
              <StyledLabel htmlFor="receptionTime">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Waktu Resepsi
                </span>
              </StyledLabel>
              <Input
                id="receptionTime"
                type="time"
                value={data.wedding.receptionTime}
                onChange={(e) =>
                  updateField("wedding", "receptionTime", e.target.value)
                }
                className={inputClass}
              />
            </FieldWrapper>
          </div>

          <FieldWrapper>
            <StyledLabel htmlFor="location">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3" /> Lokasi
              </span>
            </StyledLabel>
            <Textarea
              id="location"
              value={data.wedding.location}
              onChange={(e) =>
                updateField("wedding", "location", e.target.value)
              }
              placeholder="Hotel Indonesia Kempinski, Jakarta"
              rows={2}
              className={textareaClass}
            />
          </FieldWrapper>

          <FieldWrapper>
            <StyledLabel htmlFor="locationUrl">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3 h-3" /> URL Google Maps
              </span>
            </StyledLabel>
            <Input
              id="locationUrl"
              value={data.wedding.locationUrl}
              onChange={(e) =>
                updateField("wedding", "locationUrl", e.target.value)
              }
              placeholder="https://maps.google.com/..."
              className={inputClass}
            />
          </FieldWrapper>

          <FieldWrapper>
            <StyledLabel htmlFor="dressCode">
              <span className="flex items-center gap-1.5">
                <Shirt className="w-3 h-3" /> Dress Code
              </span>
            </StyledLabel>
            <Input
              id="dressCode"
              value={data.wedding.dressCode}
              onChange={(e) =>
                updateField("wedding", "dressCode", e.target.value)
              }
              placeholder="Formal / Batik / Kasual"
              className={inputClass}
            />
          </FieldWrapper>
        </div>
      </section>

      {/* ── Informasi RSVP ── */}
      <section className="bg-card rounded-2xl p-6 shadow-sm border border-border">
        <SectionHeader
          icon={MessageSquare}
          title="Informasi RSVP"
          subtitle="Kontak untuk konfirmasi kehadiran tamu"
        />

        <div className="space-y-5">
          <FieldWrapper>
            <StyledLabel htmlFor="whatsappNumber">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3 h-3" /> Nomor WhatsApp (RSVP)
              </span>
            </StyledLabel>
            <Input
              id="whatsappNumber"
              value={data.rsvp.whatsappNumber}
              onChange={(e) =>
                updateField("rsvp", "whatsappNumber", e.target.value)
              }
              placeholder="+62 812 3456 7890"
              className={inputClass}
            />
          </FieldWrapper>

          <FieldWrapper>
            <StyledLabel htmlFor="weddingWebsite">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3 h-3" /> URL Website Pernikahan
              </span>
            </StyledLabel>
            <Input
              id="weddingWebsite"
              value={data.rsvp.weddingWebsite}
              onChange={(e) =>
                updateField("rsvp", "weddingWebsite", e.target.value)
              }
              placeholder="https://www.weddingwebsite.com/..."
              className={inputClass}
            />
          </FieldWrapper>
        </div>
      </section>
    </div>
  );
}
