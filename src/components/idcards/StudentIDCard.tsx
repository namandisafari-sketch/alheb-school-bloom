import { User } from "lucide-react";
import { format } from "date-fns";
import { QRCodeSVG } from "qrcode.react";
import Barcode from "react-barcode";
import { Learner } from "@/hooks/useLearners";
import { IdCardSettings } from "@/hooks/useIdCardSettings";

interface StudentIDCardProps {
  student: Learner;
  schoolName: string;
  schoolTagline?: string;
  isRTL?: boolean;
  side: "front" | "back";
  settings: IdCardSettings;
}

// Standard CR80 landscape proportions scaled up
export const STUDENT_CARD_WIDTH = 540;
export const STUDENT_CARD_HEIGHT = 340;

const L = (isRTL: boolean) => ({
  studentIdCard: isRTL ? "بطاقة هوية الطالب" : "STUDENT IDENTITY CARD",
  name: isRTL ? "الاسم" : "Name",
  admNo: isRTL ? "رقم القبول" : "Adm. No",
  className: isRTL ? "الفصل" : "Class",
  gender: isRTL ? "الجنس" : "Gender",
  male: isRTL ? "ذكر" : "Male",
  female: isRTL ? "أنثى" : "Female",
  dob: isRTL ? "تاريخ الميلاد" : "DOB",
  emergency: isRTL ? "طوارئ" : "Emergency",
  validUntil: isRTL ? "صالحة حتى" : "Valid Until",
  director: isRTL ? "المدير" : "Director",
  headTeacher: isRTL ? "ناظر المدرسة" : "Head Teacher",
  cardInformation: isRTL ? "معلومات البطاقة" : "CARD INFORMATION",
  guardian: isRTL ? "ولي الأمر" : "Guardian",
  district: isRTL ? "المنطقة" : "District",
  religion: isRTL ? "الديانة" : "Religion",
  enrolled: isRTL ? "تاريخ التسجيل" : "Enrolled",
  scanForFees: isRTL ? "امسح للرسوم والتتبع" : "Scan for fees & tracking",
});

export const StudentIDCard = ({
  student,
  schoolName,
  isRTL = false,
  side,
  settings,
}: StudentIDCardProps) => {
  const t = L(isRTL);
  const validUntil = new Date();
  validUntil.setFullYear(validUntil.getFullYear() + 1);

  const admNo = student.admission_number || student.id.slice(0, 8).toUpperCase();
  const qrPayload = JSON.stringify({
    type: "attendance",
    role: "student",
    id: student.id,
    adm: admNo,
  });
  const barcodePayload = `STU-${admNo}`;

  const baseStyle: React.CSSProperties = {
    width: STUDENT_CARD_WIDTH,
    height: STUDENT_CARD_HEIGHT,
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
        {/* Header */}
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
              style={{ width: 44, height: 44, borderRadius: 8, background: "white", objectFit: "contain", padding: 3 }}
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
              {t.studentIdCard}
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
            {format(new Date(), "yyyy")}
          </div>
        </div>

        {/* Body — QR on the LEFT/start */}
        <div style={{ display: "flex", padding: 14, gap: 14, height: STUDENT_CARD_HEIGHT - 60 - 46 }}>
          {/* Left column: photo + QR */}
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
            {student.photo_url ? (
              <img
                src={student.photo_url}
                alt={student.full_name}
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
            <div
              style={{
                background: "white",
                padding: 4,
                borderRadius: 6,
                border: "1px solid #e2e8f0",
              }}
            >
              <QRCodeSVG value={qrPayload} size={62} level="M" />
            </div>
          </div>

          {/* Right column: structured info */}
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
              {student.full_name}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#64748b",
                marginBottom: 8,
                fontFamily: "monospace",
                letterSpacing: 0.5,
              }}
            >
              {t.admNo}: <span style={{ color: "#0f172a", fontWeight: 700 }}>{admNo}</span>
            </div>

            <Row isRTL={isRTL} label={t.className} value={student.classes?.name || student.class_name || "—"} />
            <Row
              isRTL={isRTL}
              label={t.gender}
              value={student.gender === "male" ? t.male : t.female}
            />
            {student.date_of_birth && (
              <Row
                isRTL={isRTL}
                label={t.dob}
                value={format(new Date(student.date_of_birth), "dd/MM/yyyy")}
              />
            )}
            {(student.guardian?.phone || student.guardian_phone) && (
              <Row
                isRTL={isRTL}
                label={t.emergency}
                value={student.guardian?.phone || student.guardian_phone || ""}
                accent
              />
            )}
            <div style={{ marginTop: 8, fontSize: 10, color: "#64748b" }}>
              {t.validUntil}:{" "}
              <span style={{ fontWeight: 700, color: "#0f172a" }}>{format(validUntil, "MMM yyyy")}</span>
            </div>
          </div>
        </div>

        {/* Signature footer */}
        <div
          style={{
            height: 46,
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            background: "#f8fafc",
            padding: "4px 14px",
            gap: 12,
          }}
        >
          <SignatureBlock label={t.director} name={settings.director_name} url={settings.director_signature_url} />
          <SignatureBlock
            label={t.headTeacher}
            name={settings.head_teacher_name}
            url={settings.head_teacher_signature_url}
          />
        </div>
      </div>
    );
  }

  // Back side
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

      <div style={{ padding: 14, fontSize: 11, lineHeight: 1.5, height: STUDENT_CARD_HEIGHT - 36 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
          {(student.guardian?.full_name || student.guardian_name) && (
            <Row isRTL={isRTL} label={t.guardian} value={student.guardian?.full_name || student.guardian_name || ""} />
          )}
          {student.district && <Row isRTL={isRTL} label={t.district} value={student.district} />}
          {student.religion && <Row isRTL={isRTL} label={t.religion} value={student.religion} />}
          {student.enrollment_date && (
            <Row
              isRTL={isRTL}
              label={t.enrolled}
              value={format(new Date(student.enrollment_date), "dd/MM/yyyy")}
            />
          )}
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
          <div style={{ fontSize: 8, color: "#64748b", marginTop: 2 }}>{t.scanForFees}</div>
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
    <span style={{ width: 88, color: "#64748b", fontWeight: 600, flexShrink: 0, textAlign: isRTL ? "right" : "left" }}>
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

const SignatureBlock = ({ label, name, url }: { label: string; name?: string; url?: string }) => (
  <div style={{ flex: 1, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
    <div style={{ height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {url ? (
        <img src={url} alt={label} crossOrigin="anonymous" style={{ maxHeight: 22, maxWidth: "100%", objectFit: "contain" }} />
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
