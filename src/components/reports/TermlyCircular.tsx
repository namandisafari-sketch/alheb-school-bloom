import { Learner } from "@/hooks/useLearners";
import { format } from "date-fns";
import { useIdCardSettings } from "@/hooks/useIdCardSettings";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface TermlyCircularProps {
  learner: Learner;
  term?: string;
  year?: number;
}

export const TermlyCircular = ({ learner, term = "Term Three", year = 2025 }: TermlyCircularProps) => {
  const { data: idSettings } = useIdCardSettings();
  const { data: site } = useSiteSettings();

  const schoolName = site?.landing_hero?.school_name || "ALHEIB PRIMARY SCHOOL";
  const address = site?.landing_contact?.address || "P.O BOX 2891, KAMPALA";
  const phone = site?.landing_contact?.phone || "0706747272 / 0745397122";
  const email = site?.landing_contact?.email || "aps@iico.org";
  const logo = idSettings?.school_logo_url;
  const headteacherSignature = idSettings?.head_teacher_signature_url;
  const stamp = idSettings?.school_stamp_url;
  const headteacherName = idSettings?.head_teacher_name || "NAKAYIZA AIDAH";

  return (
    <div
      className="circular-card bg-white text-black mx-auto font-serif flex flex-col"
      style={{
        width: "210mm",
        height: "297mm",
        padding: "15mm 20mm",
        fontSize: "10.5pt",
        lineHeight: 1.35,
        boxSizing: "border-box",
        color: "#1a1a1a"
      }}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold mb-0.5" style={{ letterSpacing: "1px" }}>{schoolName.toUpperCase()}</h1>
        <p className="italic text-xs mb-1">"Balanced education is our Concern"</p>
        <p className="text-xs font-semibold">{address}</p>
        <p className="text-xs font-semibold">TEL: {phone}</p>
        <div className="flex justify-center my-2">
            {logo ? (
              <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
            ) : (
              <div className="h-16 w-16 border-2 border-black rounded-full flex items-center justify-center text-[8pt]">LOGO</div>
            )}
        </div>
        <p className="text-xs font-bold">EMAIL: {email}</p>
      </div>

      <div className="border-t-2 border-black mb-4"></div>

      {/* Reference & Date */}
      <div className="flex justify-between font-bold text-sm mb-4">
        <div>Our Ref: <span className="border-b border-black border-dashed pb-0.5 px-2">AIH/CIRC/003</span></div>
        <div>DATE: {format(new Date(), "dd/MM/yyyy")}</div>
      </div>

      {/* Salutation */}
      <div className="mb-4 space-y-2">
        <p>Dear parent/ Guardian of <span className="font-bold border-b border-black border-dotted px-4 inline-block min-w-[250px]">{learner.full_name.toUpperCase()}</span></p>
        <p className="font-bold">ASALAM ALEIKUM WARAHMATU-ALLAH WABARAKATUHU.</p>
        <p className="font-bold underline text-center text-[12pt]">Re: END OF {term.toUpperCase()} {year} CIRCULAR.</p>
      </div>

      {/* Content */}
      <div className="space-y-3 text-justify text-[10pt]">
        <div>
          <h3 className="font-bold underline inline">SALUTATION:</h3>
          <p className="inline ml-1">On behalf of the school administration, I extend warm greetings to you in the name of Allah. I congratulate you on the successful completion of this academic year, and praise Allah for this achievement.</p>
        </div>

        <div>
          <h3 className="font-bold underline inline">PERFORMANCE:</h3>
          <p className="inline ml-1">A greater level of concentration and resilience is required from us. The triangular relationship should therefore be activated, imploring you, the parent, to spare a minute and follow up on the child's academic progress. With your involvement, our academic targets will easily be met.</p>
        </div>

        <div>
          <h3 className="font-bold underline inline">CONDOLENCES:</h3>
          <p className="inline ml-1">On a sad note, we may have lost dear ones during the year; please accept our heartfelt sympathy as we convey our condolences to the bereaved families.</p>
        </div>

        <div className="bg-gray-50 p-2 border-l-4 border-black">
          <h3 className="font-bold underline uppercase text-xs mb-1">Important School Norms:</h3>
          <p className="text-[9pt] leading-relaxed">
            <span className="font-bold">DRESS CODE:</span> Alheib Primary is Muslim founded and operates in a strict observance of Islamic norms. All parents and guardians who do not observe the Islamic dress code will not be allowed to enter the school premises.
            <br />
            <span className="font-bold">MEALS:</span> Our learners have been well fed from the beginning of the term to date, and a balanced diet has been observed for both learners and the staff.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border border-black p-2 rounded">
            <h3 className="font-bold underline text-[9pt] mb-1">REQUIRED DOCUMENTS</h3>
            <ul className="list-disc list-inside text-[8pt] space-y-0.5">
              <li>Original birth certificate from NIRA</li>
              <li>Two (2) full-sized photographs</li>
              <li>National ID of the guardian</li>
              <li>Recommendation letter from Area Imaam</li>
            </ul>
          </div>
          <div className="border border-black p-2 rounded">
            <h3 className="font-bold underline text-[9pt] mb-1">MANDATORY ITEMS</h3>
            <ul className="list-disc list-inside text-[8pt] space-y-0.5">
              <li>Mattress protectors (Black leather)</li>
              <li>4 bars of washing soap & 2 bathing</li>
              <li>Shoes (Two pairs) & Shoe polish</li>
              <li>Toothbrush & Vaseline</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Next Term Info */}
      <div className="mt-4 border-2 border-black p-3 rounded-lg">
        <h3 className="font-bold text-center underline mb-2">TERM ONE 2026 SCHEDULE</h3>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <p>Next term begins on: <span className="font-bold">02/Feb/2026</span></p>
            <p>Boarders report on: <span className="font-bold">01/Feb/2026</span></p>
          </div>
          <div className="space-y-1">
            <p>Day scholars report on: <span className="font-bold">02/Feb/2026</span></p>
            <p>P.7 candidates report on: <span className="font-bold">20/Jan/2026</span></p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 flex justify-between items-end">
        <div className="text-[9pt]">
          <p className="italic">"We wish you nice Holidays"</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <p className="font-bold border-b border-black min-w-[120px] text-center mb-1">{headteacherName.toUpperCase()}</p>
          <div className="relative">
            {headteacherSignature && <img src={headteacherSignature} alt="Signature" className="h-8 mb-1" />}
            <p className="font-bold text-[9pt]">HEAD TEACHER</p>
            {stamp && <img src={stamp} alt="Stamp" className="absolute -top-12 -right-8 h-20 w-20 opacity-70 rotate-12" />}
          </div>
        </div>
      </div>
    </div>
  );
};
