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

// Standard CR80 landscape proportions scaled up: 5.4cm x 8.55cm -> 540 x 340 px
export const STUDENT_CARD_WIDTH = 540;
export const STUDENT_CARD_HEIGHT = 340;

export const StudentIDCard = ({
  student,
  schoolName,
  schoolTagline,
  isRTL = false,
  side,
  settings,
}: StudentIDCardProps) => {
  const validUntil = new Date();
  validUntil.setFullYear(validUntil.getFullYear() + 1);

  const admNo = student.admission_number || student.id.slice(0, 8).toUpperCase();
  // Encode an attendance scan payload
  const qrPayload = JSON.stringify({
    type: "attendance",
    role: "student",
    id: student.id,
    adm: admNo,
  });
  // Barcode payload for fees/internal tracking (alphanumeric, CODE128)
  const barcodePayload = `STU-${admNo}`;

  if (side === "front") {
    return (
      <div
        className="id-card relative overflow-hidden bg-white text-slate-900 shadow-xl"
        dir={isRTL ? "rtl" : "ltr"}
        style={{
          width: STUDENT_CARD_WIDTH,
          height: STUDENT_CARD_HEIGHT,
          borderRadius: 14,
          border: "2px solid hsl(158 64% 30%)",
          fontFamily: "'Cairo', 'Inter', sans-serif",
        }}
      >
        {/* Top accent stripe */}
        <div
          style={{
            height: 56,
            background:
              "linear-gradient(135deg, hsl(158 64% 30%) 0%, hsl(158 64% 22%) 100%)",
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
              style={{ width: 40, height: 40, borderRadius: 8, background: "white", objectFit: "contain", padding: 2 }}
            />
          ) : (
            <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
              {schoolName.charAt(0)}
            </div>
          )}
          <div style={{ flex: 1, lineHeight: 1.1 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{schoolName}</div>
            <div style={{ fontSize: 10, opacity: 0.9, letterSpacing: 1, textTransform: "uppercase" }}>
              {isRTL ? "بطاقة هوية الطالب" : "Student Identity Card"}
            </div>
          </div>
          <div style={{ fontSize: 10, opacity: 0.9, textAlign: isRTL ? "left" : "right" }}>
            {format(new Date(), "yyyy")}
          </div>
        </div>

        {/* Body */}
        <div style={{ display: "flex", padding: 14, gap: 14, height: STUDENT_CARD_HEIGHT - 56 - 44 }}>
          {/* Photo */}
          <div style={{ width: 110, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            {student.photo_url ? (
              <img
                src={student.photo_url}
                alt={student.full_name}
                crossOrigin="anonymous"
                style={{ width: 110, height: 130, objectFit: "cover", borderRadius: 8, border: "2px solid hsl(158 64% 30%)" }}
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
            <QRCodeSVG value={qrPayload} size={64} level="M" />
          </div>

          {/* Info */}
          <div style={{ flex: 1, fontSize: 12, lineHeight: 1.5 }}>
            <Row label={isRTL ? "الاسم" : "Name"} value={student.full_name} />
            <Row label={isRTL ? "رقم القبول" : "Adm. No"} value={admNo} mono />
            <Row label={isRTL ? "الفصل" : "Class"} value={student.classes?.name || student.class_name || "—"} />
            <Row
              label={isRTL ? "الجنس" : "Gender"}
              value={student.gender === "male" ? (isRTL ? "ذكر" : "Male") : isRTL ? "أنثى" : "Female"}
            />
            {student.date_of_birth && (
              <Row
                label={isRTL ? "تاريخ الميلاد" : "DOB"}
                value={format(new Date(student.date_of_birth), "dd/MM/yyyy")}
              />
            )}
            {(student.guardian?.phone || student.guardian_phone) && (
              <Row
                label={isRTL ? "طوارئ" : "Emergency"}
                value={student.guardian?.phone || student.guardian_phone || ""}
                accent
              />
            )}
            <div style={{ marginTop: 6, fontSize: 9, color: "#64748b" }}>
              {isRTL ? "صالحة حتى" : "Valid Until"}:{" "}
              <span style={{ fontWeight: 600, color: "#0f172a" }}>{format(validUntil, "MMM yyyy")}</span>
            </div>
          </div>
        </div>

        {/* Signature footer */}
        <div
          style={{
            height: 44,
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            background: "#f8fafc",
            padding: "4px 14px",
            gap: 12,
          }}
        >
          <SignatureBlock
            label={isRTL ? "المدير" : "Director"}
            name={settings.director_name}
            url={settings.director_signature_url}
          />
          <SignatureBlock
            label={isRTL ? "ناظر المدرسة" : "Head Teacher"}
            name={settings.head_teacher_name}
            url={settings.head_teacher_signature_url}
          />
        </div>
      </div>
    );
  }

  // Back side
  return (
    <div
      className="id-card relative overflow-hidden bg-white text-slate-900 shadow-xl"
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        width: STUDENT_CARD_WIDTH,
        height: STUDENT_CARD_HEIGHT,
        borderRadius: 14,
        border: "2px solid hsl(158 64% 30%)",
        fontFamily: "'Cairo', 'Inter', sans-serif",
      }}
    >
      <div
        style={{
          height: 36,
          background: "linear-gradient(135deg, hsl(158 64% 30%) 0%, hsl(158 64% 22%) 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          letterSpacing: 1,
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        {isRTL ? "معلومات إضافية" : "Card Information"}
      </div>

      <div style={{ padding: 14, fontSize: 11, lineHeight: 1.5, height: STUDENT_CARD_HEIGHT - 36 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
          {(student.guardian?.full_name || student.guardian_name) && (
            <Row label={isRTL ? "ولي الأمر" : "Guardian"} value={student.guardian?.full_name || student.guardian_name || ""} />
          )}
          {student.district && (
            <Row label={isRTL ? "المنطقة" : "District"} value={student.district} />
          )}
          {student.religion && (
            <Row label={isRTL ? "الديانة" : "Religion"} value={student.religion} />
          )}
          {student.enrollment_date && (
            <Row
              label={isRTL ? "تاريخ التسجيل" : "Enrolled"}
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
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <Barcode
            value={barcodePayload}
            format="CODE128"
            width={1.6}
            height={50}
            fontSize={11}
            margin={0}
            displayValue
          />
        </div>

        <div style={{ fontSize: 9, color: "#64748b", textAlign: "center", lineHeight: 1.4 }}>
          {isRTL ? settings.back_policy_ar : settings.back_policy}
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: boolean }) => (
  <div style={{ display: "flex", marginBottom: 2 }}>
    <span style={{ width: 90, color: "#64748b", fontWeight: 600 }}>{label}:</span>
    <span
      style={{
        flex: 1,
        fontFamily: mono ? "monospace" : undefined,
        color: accent ? "#dc2626" : "#0f172a",
        fontWeight: accent ? 700 : 500,
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
