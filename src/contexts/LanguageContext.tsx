import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "ar";

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

const translations: Translations = {
  // Common
  dashboard: { en: "Dashboard", ar: "لوحة التحكم" },
  students: { en: "Students", ar: "الطلاب" },
  teachers: { en: "Teachers", ar: "المعلمين" },
  staff: { en: "Staff", ar: "الموظفين" },
  classes: { en: "Classes", ar: "الفصول" },
  attendance: { en: "Attendance", ar: "الحضور" },
  reports: { en: "Reports", ar: "التقارير" },
  notifications: { en: "Notifications", ar: "الإشعارات" },
  settings: { en: "Settings", ar: "الإعدادات" },
  salary: { en: "Salary Management", ar: "إدارة الرواتب" },
  idCards: { en: "ID Cards", ar: "البطاقات الشخصية" },
  
  // Actions
  add: { en: "Add", ar: "إضافة" },
  edit: { en: "Edit", ar: "تعديل" },
  delete: { en: "Delete", ar: "حذف" },
  save: { en: "Save", ar: "حفظ" },
  cancel: { en: "Cancel", ar: "إلغاء" },
  search: { en: "Search", ar: "بحث" },
  filter: { en: "Filter", ar: "تصفية" },
  print: { en: "Print", ar: "طباعة" },
  download: { en: "Download", ar: "تحميل" },
  generate: { en: "Generate", ar: "توليد" },
  
  // Salary
  basicSalary: { en: "Basic Salary", ar: "الراتب الأساسي" },
  allowances: { en: "Allowances", ar: "البدلات" },
  deductions: { en: "Deductions", ar: "الخصومات" },
  netSalary: { en: "Net Salary", ar: "صافي الراتب" },
  paymentHistory: { en: "Payment History", ar: "سجل المدفوعات" },
  paymentDate: { en: "Payment Date", ar: "تاريخ الدفع" },
  paymentMethod: { en: "Payment Method", ar: "طريقة الدفع" },
  bankTransfer: { en: "Bank Transfer", ar: "تحويل بنكي" },
  cash: { en: "Cash", ar: "نقدي" },
  cheque: { en: "Cheque", ar: "شيك" },
  mobilePayment: { en: "Mobile Payment", ar: "دفع عبر الهاتف" },
  
  // ID Card
  studentId: { en: "Student ID", ar: "رقم الطالب" },
  staffId: { en: "Staff ID", ar: "رقم الموظف" },
  bloodGroup: { en: "Blood Group", ar: "فصيلة الدم" },
  emergencyContact: { en: "Emergency Contact", ar: "جهة اتصال الطوارئ" },
  validUntil: { en: "Valid Until", ar: "صالح حتى" },
  issuedOn: { en: "Issued On", ar: "تاريخ الإصدار" },
  
  // Report Card
  reportCard: { en: "Report Card", ar: "بطاقة التقرير" },
  academicYear: { en: "Academic Year", ar: "العام الدراسي" },
  term: { en: "Term", ar: "الفصل الدراسي" },
  term1: { en: "Term 1", ar: "الفصل الأول" },
  term2: { en: "Term 2", ar: "الفصل الثاني" },
  term3: { en: "Term 3", ar: "الفصل الثالث" },
  subject: { en: "Subject", ar: "المادة" },
  score: { en: "Score", ar: "الدرجة" },
  competency: { en: "Competency", ar: "الكفاءة" },
  exceeding: { en: "Exceeding Expectations", ar: "يتجاوز التوقعات" },
  meeting: { en: "Meeting Expectations", ar: "يلبي التوقعات" },
  approaching: { en: "Approaching Expectations", ar: "يقترب من التوقعات" },
  beginning: { en: "Beginning", ar: "مبتدئ" },
  teacherRemarks: { en: "Teacher's Remarks", ar: "ملاحظات المعلم" },
  headTeacherRemarks: { en: "Head Teacher's Remarks", ar: "ملاحظات المدير" },
  
  // Common Labels
  name: { en: "Name", ar: "الاسم" },
  fullName: { en: "Full Name", ar: "الاسم الكامل" },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  phone: { en: "Phone", ar: "الهاتف" },
  address: { en: "Address", ar: "العنوان" },
  role: { en: "Role", ar: "الدور" },
  class: { en: "Class", ar: "الفصل" },
  gender: { en: "Gender", ar: "الجنس" },
  male: { en: "Male", ar: "ذكر" },
  female: { en: "Female", ar: "أنثى" },
  dateOfBirth: { en: "Date of Birth", ar: "تاريخ الميلاد" },
  admissionNumber: { en: "Admission Number", ar: "رقم القبول" },
  guardian: { en: "Guardian", ar: "ولي الأمر" },
  
  // Status
  active: { en: "Active", ar: "نشط" },
  inactive: { en: "Inactive", ar: "غير نشط" },
  pending: { en: "Pending", ar: "معلق" },
  completed: { en: "Completed", ar: "مكتمل" },
  
  // Messages
  loading: { en: "Loading...", ar: "جاري التحميل..." },
  noData: { en: "No data found", ar: "لا توجد بيانات" },
  success: { en: "Success", ar: "تم بنجاح" },
  error: { en: "Error", ar: "خطأ" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });

  const isRTL = language === "ar";

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
