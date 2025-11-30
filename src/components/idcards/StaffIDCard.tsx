import { Staff } from "@/hooks/useStaff";
import { User } from "lucide-react";
import { format } from "date-fns";

interface StaffIDCardProps {
  staff: Staff;
  schoolName: string;
  isRTL?: boolean;
}

export const StaffIDCard = ({ staff, schoolName, isRTL = false }: StaffIDCardProps) => {
  const validUntil = new Date();
  validUntil.setFullYear(validUntil.getFullYear() + 1);

  const roleLabels: Record<string, { en: string; ar: string }> = {
    admin: { en: "Administrator", ar: "مدير" },
    teacher: { en: "Teacher", ar: "معلم" },
    support: { en: "Support Staff", ar: "موظف دعم" },
    driver: { en: "Driver", ar: "سائق" },
    security: { en: "Security", ar: "حارس أمن" },
    cook: { en: "Cook", ar: "طباخ" },
    cleaner: { en: "Cleaner", ar: "عامل نظافة" },
    accountant: { en: "Accountant", ar: "محاسب" },
  };

  return (
    <div
      className="id-card w-[340px] border-2 border-primary rounded-xl overflow-hidden bg-card shadow-lg"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 text-center">
        <h2 className="text-lg font-bold">{schoolName}</h2>
        <p className="text-xs opacity-90 uppercase tracking-wider mt-1">
          {isRTL ? "بطاقة هوية الموظف" : "STAFF IDENTITY CARD"}
        </p>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Photo Section */}
        <div className="flex justify-center">
          <div className="w-24 h-28 bg-muted rounded-lg flex items-center justify-center border-2 border-primary">
            <User className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="font-semibold w-24 text-muted-foreground">
              {isRTL ? "الاسم:" : "Name:"}
            </span>
            <span className="font-medium">{staff.full_name}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-24 text-muted-foreground">
              {isRTL ? "الرقم الوظيفي:" : "Staff ID:"}
            </span>
            <span className="font-mono">{staff.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-24 text-muted-foreground">
              {isRTL ? "الوظيفة:" : "Role:"}
            </span>
            <span>
              {roleLabels[staff.role || ""]?.[isRTL ? "ar" : "en"] || staff.role}
            </span>
          </div>
          {staff.phone && (
            <div className="flex">
              <span className="font-semibold w-24 text-muted-foreground">
                {isRTL ? "الهاتف:" : "Phone:"}
              </span>
              <span dir="ltr">{staff.phone}</span>
            </div>
          )}
          {staff.email && (
            <div className="flex">
              <span className="font-semibold w-24 text-muted-foreground">
                {isRTL ? "البريد:" : "Email:"}
              </span>
              <span className="text-xs truncate" dir="ltr">{staff.email}</span>
            </div>
          )}
        </div>

        {/* QR Code Placeholder */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-muted rounded flex items-center justify-center border">
            <span className="text-[8px] text-muted-foreground text-center">QR Code</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-muted px-4 py-3 text-center border-t">
        <p className="text-xs text-muted-foreground">
          {isRTL ? "صالح حتى:" : "Valid Until:"}{" "}
          <span className="font-semibold">{format(validUntil, "MMM yyyy")}</span>
        </p>
        <p className="text-[10px] text-muted-foreground mt-1">
          {isRTL
            ? "في حالة العثور على هذه البطاقة، يرجى إعادتها إلى المدرسة"
            : "If found, please return to the school"}
        </p>
      </div>
    </div>
  );
};
