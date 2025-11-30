import { User } from "lucide-react";
import { format } from "date-fns";

import { Learner } from "@/hooks/useLearners";

interface StudentIDCardProps {
  student: Learner;
  schoolName: string;
  isRTL?: boolean;
}

export const StudentIDCard = ({ student, schoolName, isRTL = false }: StudentIDCardProps) => {
  const validUntil = new Date();
  validUntil.setMonth(validUntil.getMonth() + 12);

  return (
    <div
      className="id-card w-[340px] border-2 border-primary rounded-xl overflow-hidden bg-card shadow-lg"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-4 text-center">
        <h2 className="text-lg font-bold">{schoolName}</h2>
        <p className="text-xs opacity-90 uppercase tracking-wider mt-1">
          {isRTL ? "بطاقة هوية الطالب" : "STUDENT IDENTITY CARD"}
        </p>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Photo Section */}
        <div className="flex justify-center">
          {student.photo_url ? (
            <img
              src={student.photo_url}
              alt={student.full_name}
              className="w-24 h-28 object-cover rounded-lg border-2 border-green-700"
            />
          ) : (
            <div className="w-24 h-28 bg-muted rounded-lg flex items-center justify-center border-2 border-green-700">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="font-semibold w-28 text-muted-foreground">
              {isRTL ? "الاسم:" : "Name:"}
            </span>
            <span className="font-medium">{student.full_name}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-28 text-muted-foreground">
              {isRTL ? "رقم القبول:" : "Adm. No:"}
            </span>
            <span className="font-mono">{student.admission_number || "N/A"}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-28 text-muted-foreground">
              {isRTL ? "الفصل:" : "Class:"}
            </span>
            <span>{student.classes?.name || "N/A"}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-28 text-muted-foreground">
              {isRTL ? "الجنس:" : "Gender:"}
            </span>
            <span>
              {student.gender === "male"
                ? isRTL
                  ? "ذكر"
                  : "Male"
                : isRTL
                ? "أنثى"
                : "Female"}
            </span>
          </div>
          {student.date_of_birth && (
            <div className="flex">
              <span className="font-semibold w-28 text-muted-foreground">
                {isRTL ? "تاريخ الميلاد:" : "DOB:"}
              </span>
              <span>{format(new Date(student.date_of_birth), "dd/MM/yyyy")}</span>
            </div>
          )}
          {student.guardian && (
            <div className="flex">
              <span className="font-semibold w-28 text-muted-foreground">
                {isRTL ? "ولي الأمر:" : "Guardian:"}
              </span>
              <span className="text-xs">{student.guardian.full_name}</span>
            </div>
          )}
        </div>

        {/* Emergency Contact */}
        {student.guardian?.phone && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2 text-center">
            <p className="text-[10px] text-red-600 dark:text-red-400 font-semibold uppercase">
              {isRTL ? "رقم الطوارئ" : "Emergency Contact"}
            </p>
            <p className="text-sm font-bold text-red-700 dark:text-red-300" dir="ltr">
              {student.guardian.phone}
            </p>
          </div>
        )}
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
