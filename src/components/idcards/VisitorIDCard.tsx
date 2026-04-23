import { User } from "lucide-react";
import { format } from "date-fns";
import { QRCodeSVG } from "qrcode.react";
import type { VisitorVisit } from "@/hooks/useVisitors";
import type { Visitor } from "@/hooks/useVisitors";

interface VisitorIDCardProps {
  visit?: VisitorVisit;
  visitor?: Visitor;
  schoolName: string;
  schoolLogoUrl?: string;
  isRTL?: boolean;
  variant: "day-pass" | "reusable";
}

export const VISITOR_CARD_WIDTH = 540;
export const VISITOR_CARD_HEIGHT = 340;

export const VisitorIDCard = ({
  visit,
  visitor,
  schoolName,
  schoolLogoUrl,
  isRTL = false,
  variant,
}: VisitorIDCardProps) => {
  const name = visit?.visitor_name || visitor?.full_name || "—";
  const phone = visit?.visitor_phone || visitor?.phone || "";
  const photo = visit?.visitor_photo_url || visitor?.photo_url || "";
  const badge = visit?.badge_number || (visitor ? `V-${visitor.id.slice(0, 6).toUpperCase()}` : "—");
  const purpose = visit?.purpose || "";
  const host = visit?.host_name || "";

  const accent = variant === "day-pass" ? "hsl(25 95% 50%)" : "hsl(217 91% 45%)";
  const accentDark = variant === "day-pass" ? "hsl(25 95% 35%)" : "hsl(217 91% 30%)";

  const validDate = variant === "day-pass" ? new Date() : new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  const labels = isRTL
    ? {
        title: variant === "day-pass" ? "تصريح زيارة يوم واحد" : "بطاقة زائر",
        name: "الاسم",
        badge: "رقم البطاقة",
        purpose: "الغرض",
        host: "المضيف",
        phone: "الهاتف",
        validUntil: variant === "day-pass" ? "صالحة اليوم" : "صالحة حتى",
        return: "هذه البطاقة ملك للمدرسة. يجب إعادتها عند المغادرة.",
      }
    : {
        title: variant === "day-pass" ? "VISITOR DAY PASS" : "VISITOR ID CARD",
        name: "Name",
        badge: "Badge",
        purpose: "Purpose",
        host: "Host",
        phone: "Phone",
        validUntil: variant === "day-pass" ? "Valid Today" : "Valid Until",
        return: "Property of the school. Please return on exit.",
      };

  const qrPayload = JSON.stringify({
    type: "visitor",
    badge,
    visit_id: visit?.id,
    visitor_id: visitor?.id,
  });

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        width: VISITOR_CARD_WIDTH,
        height: VISITOR_CARD_HEIGHT,
        borderRadius: 14,
        border: `2px solid ${accent}`,
        background: "white",
        color: "#0f172a",
        fontFamily: isRTL
          ? "'Cairo', 'Tajawal', 'Noto Naskh Arabic', sans-serif"
          : "'Inter', 'Cairo', sans-serif",
        overflow: "hidden",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        position: "relative",
      }}
    >
      <div
        style={{
          height: 60,
          background: `linear-gradient(135deg, ${accent} 0%, ${accentDark} 100%)`,
          color: "white",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 12,
        }}
      >
        {schoolLogoUrl ? (
          <img
            src={schoolLogoUrl}
            alt="logo"
            crossOrigin="anonymous"
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              background: "white",
              objectFit: "contain",
              padding: 3,
            }}
          />
        ) : (
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            {schoolName.charAt(0)}
          </div>
        )}
        <div style={{ flex: 1, lineHeight: 1.15, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {schoolName}
          </div>
          <div style={{ fontSize: 9, opacity: 0.95, letterSpacing: 1.2, fontWeight: 600 }}>
            {labels.title}
          </div>
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            background: "rgba(255,255,255,0.18)",
            padding: "4px 10px",
            borderRadius: 6,
          }}
        >
          {badge}
        </div>
      </div>

      <div style={{ display: "flex", padding: 14, gap: 14, height: VISITOR_CARD_HEIGHT - 60 }}>
        <div
          style={{
            width: 120,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          {photo ? (
            <img
              src={photo}
              alt={name}
              crossOrigin="anonymous"
              style={{
                width: 110,
                height: 130,
                objectFit: "cover",
                borderRadius: 8,
                border: `2px solid ${accent}`,
              }}
            />
          ) : (
            <div
              style={{
                width: 110,
                height: 130,
                background: "#e2e8f0",
                borderRadius: 8,
                border: `2px solid ${accent}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={56} color="#94a3b8" />
            </div>
          )}
          <div style={{ background: "white", padding: 4, borderRadius: 6, border: "1px solid #e2e8f0" }}>
            <QRCodeSVG value={qrPayload} size={62} level="M" />
          </div>
        </div>

        <div style={{ flex: 1, fontSize: 12, lineHeight: 1.5, minWidth: 0 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: accentDark,
              marginBottom: 4,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </div>
          <div style={{ fontSize: 10, color: "#64748b", marginBottom: 8 }}>
            {visitor?.company || ""}
          </div>

          <Row label={labels.badge} value={badge} isRTL={isRTL} mono />
          {purpose && <Row label={labels.purpose} value={purpose} isRTL={isRTL} />}
          {host && <Row label={labels.host} value={host} isRTL={isRTL} />}
          {phone && <Row label={labels.phone} value={phone} isRTL={isRTL} accent />}

          <div style={{ marginTop: 10, fontSize: 10, color: "#64748b" }}>
            {labels.validUntil}:{" "}
            <span style={{ fontWeight: 700, color: "#0f172a" }}>
              {format(validDate, variant === "day-pass" ? "EEE dd MMM yyyy" : "MMM yyyy")}
            </span>
          </div>

          <div style={{ marginTop: 8, fontSize: 9, color: "#64748b", lineHeight: 1.3 }}>
            {labels.return}
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({
  label,
  value,
  mono,
  accent,
  isRTL,
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
  isRTL?: boolean;
}) => (
  <div style={{ display: "flex", marginBottom: 3, gap: 6 }}>
    <span
      style={{
        width: 70,
        color: "#64748b",
        fontWeight: 600,
        flexShrink: 0,
        textAlign: isRTL ? "right" : "left",
      }}
    >
      {label}:
    </span>
    <span
      style={{
        flex: 1,
        fontFamily: mono ? "monospace" : undefined,
        color: accent ? "#dc2626" : "#0f172a",
        fontWeight: accent ? 700 : 600,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </span>
  </div>
);
