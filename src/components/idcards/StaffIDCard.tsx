import { Staff } from "@/hooks/useStaff";
import { User } from "lucide-react";
import { format } from "date-fns";
import { QRCodeSVG } from "qrcode.react";
import Barcode from "react-barcode";
import { IdCardSettings } from "@/hooks/useIdCardSettings";

interface StaffIDCardProps {
  staff: Staff;
  schoolName: string;
  isRTL?: boolean;
  side: "front" | "back";
  settings: IdCardSettings;
}

export const STAFF_CARD_WIDTH = 540;
export const STAFF_CARD_HEIGHT = 340;

const roleLabels: Record<string, { en: string; ar: string }> = {
  admin: { en: "Administrator", ar: "مدير النظام" },
  teacher: { en: "Teacher", ar: "معلم" },
  support: { en: "Support Staff", ar: "موظف دعم" },
  driver: { en: "Driver", ar: "سائق" },
  security: { en: "Security", ar: "حارس أمن" },
  cook: { en: "Cook", ar: "طباخ" },
  cleaner: { en: "Cleaner", ar: "عامل نظافة" },
  accountant: { en: "Accountant", ar: "محاسب" },
};

const L = (isRTL: boolean) => ({
  staffIdCard: isRTL ? "بطاقة هوية الموظف" : "STAFF IDENTITY CARD",
  name: isRTL ? "الاسم" : "Name",
  staffId: isRTL ? "الرقم الوظيفي" : "Staff ID",
  role: isRTL ? "الوظيفة" : "Role",
  qualification: isRTL ? "المؤهل" : "Qualification",
  phone: isRTL ? "الهاتف" : "Phone",
  email: isRTL ? "البريد" : "Email",
  validUntil: isRTL ? "صالحة حتى" : "Valid Until",
  director: isRTL ? "المدير" : "Director",
  headTeacher: isRTL ? "ناظر المدرسة" : "Head Teacher",
  cardInformation: isRTL ? "معلومات البطاقة" : "CARD INFORMATION",
  issued: isRTL ? "تاريخ الإصدار" : "Issued",
  scanForRecords: isRTL ? "امسح للسجلات" : "Scan for records",
});

export const StaffIDCard = ({ staff, schoolName, isRTL = false, side, settings }: StaffIDCardProps) => {
  const t = L(isRTL);
  const validUntil = new Date();
  validUntil.setFullYear(validUntil.getFullYear() + 1);

  const staffNo = staff.id.slice(0, 8).toUpperCase();
  const qrPayload = JSON.stringify({ type: "attendance", role: "staff", id: staff.id, no: staffNo });
  const barcodePayload = `STF-${staffNo}`;
  const role = roleLabels[staff.role || ""]?.[isRTL ? "ar" : "en"] || staff.role || "—";

  const baseStyle: React.CSSProperties = {
    width: STAFF_CARD_WIDTH,
    height: STAFF_CARD_HEIGHT,
    borderRadius: 14,
    border: "2px solid hsl(158 64% 30%)",
    fontFamily: isRTL
      ? "'Cairo', 'Tajawal', 'Noto Naskh Arabic', sans-serif"
      : "'Inter', 'Cairo', sans-serif",
    background: "white",
    color: "#0f172a",
  };

  if (side === "front") {
    return (
      <div className="id-card relative overflow-hidden shadow-xl" dir={isRTL ? "rtl" : "ltr"} style={baseStyle}>
        <div
          style={{
            height: 60,
            background: "linear-gradient(135deg, hsl(158 64% 30%) 0%, hsl(158 64% 22%) 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 12,
          }}
        >
          {settings.school_logo_url ? (
            <img
              src={settings.school_logo_url}
              alt="logo"
              crossOrigin="anonymous"
              style={{
                width: settings.logo_size_id,
                height: settings.logo_size_id,
                borderRadius: 8,
                background: "white",
                objectFit: "contain",
                padding: 3,
              }}
            />
          ) : (
            <div
              style={{
                width: settings.logo_size_id,
                height: settings.logo_size_id,
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
            <div style={{ fontSize: 9, opacity: 0.95, letterSpacing: 1.2, fontWeight: 600 }}>{t.staffIdCard}</div>
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
            {format(new Date(), "yyyy")}
          </div>
        </div>

        {/* Body — photo + QR on the LEFT */}
        <div style={{ display: "flex", padding: 14, gap: 14, height: STAFF_CARD_HEIGHT - 60 - 46 }}>
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
            {(staff as any).avatar_url ? (
              <img
                src={(staff as any).avatar_url}
                alt={staff.full_name}
                crossOrigin="anonymous"
                style={{
                  width: 110,
                  height: 130,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "2px solid hsl(158 64% 30%)",
                }}
              />
            ) : (
              <div
                style={{
                  width: 110,
                  height: 130,
                  background: "#e2e8f0",
                  borderRadius: 8,
                  border: "2px solid hsl(158 64% 30%)",
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
                fontSize: 15,
                fontWeight: 800,
                color: "hsl(158 64% 22%)",
                marginBottom: 4,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {staff.full_name}
            </div>
            <div style={{ fontSize: 10, color: "#64748b", marginBottom: 8, fontFamily: "monospace", letterSpacing: 0.5 }}>
              {t.staffId}: <span style={{ color: "#0f172a", fontWeight: 700 }}>{staffNo}</span>
            </div>

            <Row isRTL={isRTL} label={t.role} value={role} />
            {staff.qualification && <Row isRTL={isRTL} label={t.qualification} value={staff.qualification} />}
            {staff.phone && <Row isRTL={isRTL} label={t.phone} value={staff.phone} />}
            {staff.email && <Row isRTL={isRTL} label={t.email} value={staff.email} />}
            <div style={{ marginTop: 8, fontSize: 10, color: "#64748b" }}>
              {t.validUntil}:{" "}
              <span style={{ fontWeight: 700, color: "#0f172a" }}>{format(validUntil, "MMM yyyy")}</span>
            </div>
          </div>
        </div>

        <div style={{ height: 46, borderTop: "1px solid #e2e8f0", display: "flex", background: "#f8fafc", padding: "4px 14px", gap: 12 }}>
          <SignatureBlock label={t.director} name={settings.director_name} url={settings.director_signature_url} height={settings.signature_height_id} />
          <SignatureBlock label={t.headTeacher} name={settings.head_teacher_name} url={settings.head_teacher_signature_url} height={settings.signature_height_id} />
        </div>
      </div>
    );
  }

  return (
    <div className="id-card relative overflow-hidden shadow-xl" dir={isRTL ? "rtl" : "ltr"} style={baseStyle}>
      <div
        style={{
          height: 36,
          background: "linear-gradient(135deg, hsl(158 64% 30%) 0%, hsl(158 64% 22%) 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          letterSpacing: 1.5,
          fontWeight: 700,
        }}
      >
        {t.cardInformation}
      </div>
      <div style={{ padding: 14, fontSize: 11, lineHeight: 1.5, height: STAFF_CARD_HEIGHT - 36 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
          <Row isRTL={isRTL} label={t.issued} value={format(new Date(), "dd/MM/yyyy")} />
          <Row isRTL={isRTL} label={t.validUntil} value={format(validUntil, "dd/MM/yyyy")} />
        </div>
        <div
          style={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Barcode value={barcodePayload} format="CODE128" width={1.6} height={48} fontSize={11} margin={0} displayValue />
          <div style={{ fontSize: 8, color: "#64748b", marginTop: 2 }}>{t.scanForRecords}</div>
        </div>
        <div style={{ fontSize: 9, color: "#64748b", textAlign: "center", lineHeight: 1.4 }}>
          {isRTL ? settings.back_policy_ar : settings.back_policy}
        </div>
      </div>
    </div>
  );
};

const Row = ({
  label,
  value,
  mono,
  isRTL,
}: {
  label: string;
  value: string;
  mono?: boolean;
  isRTL?: boolean;
}) => (
  <div style={{ display: "flex", marginBottom: 3, gap: 6 }}>
    <span style={{ width: 100, color: "#64748b", fontWeight: 600, flexShrink: 0, textAlign: isRTL ? "right" : "left" }}>
      {label}:
    </span>
    <span
      style={{
        flex: 1,
        fontFamily: mono ? "monospace" : undefined,
        color: "#0f172a",
        fontWeight: 600,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </span>
  </div>
);

const SignatureBlock = ({
  label,
  name,
  url,
  height = 22,
}: {
  label: string;
  name?: string;
  url?: string;
  height?: number;
}) => (
  <div style={{ flex: 1, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
    <div style={{ height: height + 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {url ? (
        <img src={url} alt={label} crossOrigin="anonymous" style={{ maxHeight: height, maxWidth: "100%", objectFit: "contain" }} />
      ) : (
        <div style={{ height: 1, width: "70%", borderTop: "1px solid #94a3b8" }} />
      )}
    </div>
    <div style={{ fontSize: 8, color: "#64748b", lineHeight: 1.1 }}>
      {name && <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 9 }}>{name}</div>}
      {label}
    </div>
  </div>
);
