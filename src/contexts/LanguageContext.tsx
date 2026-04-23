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

  // Sidebar / Nav
  learners: { en: "Learners", ar: "المتعلمون" },
  staffWorkers: { en: "Staff & Workers", ar: "الموظفون والعمال" },
  marksEntry: { en: "Marks Entry", ar: "إدخال الدرجات" },
  schedule: { en: "Schedule", ar: "الجدول" },
  userManagement: { en: "User Management", ar: "إدارة المستخدمين" },
  systemSettings: { en: "System Settings", ar: "إعدادات النظام" },
  logout: { en: "Logout", ar: "تسجيل الخروج" },
  administrator: { en: "Administrator", ar: "مدير النظام" },
  parent: { en: "Parent", ar: "ولي الأمر" },
  teacher: { en: "Teacher", ar: "معلم" },
  primarySchool: { en: "Primary School", ar: "مدرسة ابتدائية" },

  // ID Cards page
  staffIdCards: { en: "Staff ID Cards", ar: "بطاقات هوية الموظفين" },
  studentIdCards: { en: "Student ID Cards", ar: "بطاقات هوية الطلاب" },
  selectStaffMember: { en: "Select staff member", ar: "اختر موظفًا" },
  selectStudent: { en: "Select student", ar: "اختر طالبًا" },
  exportPng: { en: "Export PNG", ar: "تصدير PNG" },
  frontSideOnly: { en: "Front side only", ar: "الوجه الأمامي فقط" },
  backSideOnly: { en: "Back side only", ar: "الوجه الخلفي فقط" },
  bothSides: { en: "Both sides", ar: "كلا الوجهين" },
  frontSide: { en: "Front Side", ar: "الوجه الأمامي" },
  backSide: { en: "Back Side", ar: "الوجه الخلفي" },
  selectToPreview: { en: "Select someone to preview", ar: "اختر شخصًا للمعاينة" },
  generateIdSubtitle: {
    en: "Generate ID cards for staff and students",
    ar: "إنشاء بطاقات الهوية للموظفين والطلاب",
  },
  batchExport: { en: "Batch Export", ar: "تصدير دفعة" },
  exportWholeSchool: { en: "Export whole school", ar: "تصدير المدرسة بأكملها" },
  exportByClass: { en: "Export by class", ar: "تصدير حسب الفصل" },
  selectClass: { en: "Select class", ar: "اختر الفصل" },
  allClasses: { en: "All classes", ar: "جميع الفصول" },
  generatingZip: { en: "Generating ZIP...", ar: "جاري إنشاء الملف..." },
  downloadZip: { en: "Download ZIP", ar: "تنزيل الملف المضغوط" },
  exported: { en: "Exported", ar: "تم التصدير" },
  exportFailed: { en: "Export failed", ar: "فشل التصدير" },
  cardDownloaded: { en: "ID card downloaded", ar: "تم تنزيل البطاقة" },

  // ID card fields
  admNo: { en: "Adm. No", ar: "رقم القبول" },
  staffIdShort: { en: "Staff ID", ar: "رقم الوظيفي" },
  qualification: { en: "Qualification", ar: "المؤهل" },
  emergency: { en: "Emergency", ar: "طوارئ" },
  director: { en: "Director", ar: "المدير" },
  headTeacher: { en: "Head Teacher", ar: "ناظر المدرسة" },
  studentIdentityCard: { en: "Student Identity Card", ar: "بطاقة هوية الطالب" },
  staffIdentityCard: { en: "Staff Identity Card", ar: "بطاقة هوية الموظف" },
  cardInformation: { en: "Card Information", ar: "معلومات البطاقة" },
  issued: { en: "Issued", ar: "تاريخ الإصدار" },
  district: { en: "District", ar: "المنطقة" },
  religion: { en: "Religion", ar: "الديانة" },
  enrolled: { en: "Enrolled", ar: "تاريخ التسجيل" },

  // System Settings
  idCardSignaturesBranding: { en: "ID Card Signatures & Branding", ar: "توقيعات وعلامة بطاقة الهوية" },
  idCardSettingsDesc: {
    en: "Upload Director and Head Teacher signatures — they will appear on every generated ID card.",
    ar: "قم بتحميل توقيعات المدير وناظر المدرسة — ستظهر على كل بطاقة هوية يتم إنشاؤها.",
  },
  directorName: { en: "Director Name", ar: "اسم المدير" },
  directorSignature: { en: "Director Signature", ar: "توقيع المدير" },
  headTeacherName: { en: "Head Teacher Name", ar: "اسم ناظر المدرسة" },
  headTeacherSignature: { en: "Head Teacher Signature", ar: "توقيع ناظر المدرسة" },
  schoolLogoUrl: { en: "School Logo URL (optional)", ar: "رابط شعار المدرسة (اختياري)" },
  backPolicyEn: { en: "Back-side Policy (English)", ar: "سياسة الوجه الخلفي (الإنجليزية)" },
  backPolicyAr: { en: "Back-side Policy (Arabic)", ar: "سياسة الوجه الخلفي (العربية)" },
  saveSettings: { en: "Save Settings", ar: "حفظ الإعدادات" },
  upload: { en: "Upload", ar: "رفع" },
  noSignature: { en: "No signature", ar: "لا يوجد توقيع" },
  saved: { en: "Saved", ar: "تم الحفظ" },
  settingsUpdated: { en: "Settings updated", ar: "تم تحديث الإعدادات" },

  // Marks & Reports
  academic: { en: "Academic", ar: "أكاديمي" },
  islamic: { en: "Islamic", ar: "إسلامي" },
  copyPreviousTerm: { en: "Copy previous term", ar: "نسخ الفصل السابق" },
  saveAll: { en: "Save all", ar: "حفظ الكل" },
  unsavedChanges: { en: "unsaved changes", ar: "تغييرات غير محفوظة" },
  autoSaved: { en: "auto-saved", ar: "حفظ تلقائي" },
  total: { en: "Total", ar: "المجموع" },
  average: { en: "Average", ar: "المعدل" },
  position: { en: "Position", ar: "الترتيب" },
  publish: { en: "Publish", ar: "نشر" },
  publishAndLock: { en: "Publish & Lock", ar: "نشر وقفل" },
  publishWholeClass: { en: "Publish whole class", ar: "نشر الفصل بأكمله" },
  unlock: { en: "Unlock", ar: "فتح القفل" },
  preview: { en: "Preview", ar: "معاينة" },
  draft: { en: "Draft", ar: "مسودة" },
  published: { en: "Published", ar: "منشور" },
  locked: { en: "Locked", ar: "مقفل" },
  selectAll: { en: "Select all", ar: "تحديد الكل" },
  clear: { en: "Clear", ar: "مسح" },
  daysPresent: { en: "Days Present", ar: "أيام الحضور" },
  daysAbsent: { en: "Days Absent", ar: "أيام الغياب" },
  discipline: { en: "Discipline", ar: "الانضباط" },
  participation: { en: "Participation", ar: "المشاركة" },
  cleanliness: { en: "Cleanliness", ar: "النظافة" },
  juzCompleted: { en: "Juz Completed", ar: "الجزء المكتمل" },
  qualityExcellent: { en: "Excellent", ar: "ممتاز" },
  qualityGood: { en: "Good", ar: "جيد" },
  qualityFair: { en: "Fair", ar: "مقبول" },
  qualityNeedsWork: { en: "Needs Work", ar: "يحتاج تحسين" },
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
