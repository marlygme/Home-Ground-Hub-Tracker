import { Participant, Program } from "@shared/schema";
import { formatAustralianPhone } from "@/lib/phoneUtils";

interface PrintViewProps {
  participants: Participant[];
  programs: Program[];
  type: "roster" | "attendance";
}

export function PrintView({ participants, programs, type }: PrintViewProps) {
  const getProgramName = (programId: string): string => {
    const program = programs.find(p => p.id === programId);
    return program?.name || "Unknown Program";
  };

  const getProgramWeeks = (programId: string): number => {
    const program = programs.find(p => p.id === programId);
    return program?.attendanceWeeks || 10;
  };

  if (type === "roster") {
    return (
      <div className="print-only p-8">
        <style>{`
          @media print {
            .print-only { display: block !important; }
            .no-print { display: none !important; }
            @page { margin: 1cm; }
          }
          @media screen {
            .print-only { display: none; }
          }
        `}</style>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Participant Roster</h1>
          <p className="text-gray-600">Home Ground Hub Soccer Program</p>
          <p className="text-sm text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-800">
              <th className="text-left py-2 px-3">Name</th>
              <th className="text-left py-2 px-3">Age</th>
              <th className="text-left py-2 px-3">Program</th>
              <th className="text-left py-2 px-3">Email</th>
              <th className="text-left py-2 px-3">Phone</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p, index) => (
              <tr key={p.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-2 px-3 border-b border-gray-200">{p.fullName}</td>
                <td className="py-2 px-3 border-b border-gray-200">{p.age}</td>
                <td className="py-2 px-3 border-b border-gray-200">{getProgramName(p.programId)}</td>
                <td className="py-2 px-3 border-b border-gray-200">{p.parentEmail}</td>
                <td className="py-2 px-3 border-b border-gray-200">{formatAustralianPhone(p.phoneNumber)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const maxWeeks = programs.length > 0 
    ? Math.max(...programs.map(p => p.attendanceWeeks))
    : 10;

  return (
    <div className="print-only p-8">
      <style>{`
        @media print {
          .print-only { display: block !important; }
          .no-print { display: none !important; }
          @page { margin: 1cm; size: landscape; }
        }
        @media screen {
          .print-only { display: none; }
        }
      `}</style>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Attendance Sheet</h1>
        <p className="text-gray-600">Home Ground Hub Soccer Program</p>
        <p className="text-sm text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-gray-800">
            <th className="text-left py-2 px-2">Name</th>
            <th className="text-left py-2 px-2">Age</th>
            <th className="text-left py-2 px-2">Program</th>
            {Array.from({ length: maxWeeks }, (_, i) => (
              <th key={i} className="text-center py-2 px-1 w-8">W{i + 1}</th>
            ))}
            <th className="text-center py-2 px-2">Total</th>
            <th className="text-center py-2 px-2">%</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p, index) => {
            const programWeeks = getProgramWeeks(p.programId);
            const attended = p.attendance.filter(Boolean).length;
            const percentage = programWeeks > 0 
              ? Math.round((attended / programWeeks) * 100)
              : 0;
            return (
              <tr key={p.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-2 px-2 border-b border-gray-200">{p.fullName}</td>
                <td className="py-2 px-2 border-b border-gray-200">{p.age}</td>
                <td className="py-2 px-2 border-b border-gray-200 text-xs">{getProgramName(p.programId)}</td>
                {Array.from({ length: maxWeeks }, (_, i) => {
                  const isApplicable = i < programWeeks;
                  const isPresent = isApplicable && p.attendance[i];
                  return (
                    <td key={i} className="text-center py-2 px-1 border-b border-gray-200">
                      {isApplicable ? (isPresent ? "✓" : "") : "-"}
                    </td>
                  );
                })}
                <td className="text-center py-2 px-2 border-b border-gray-200 font-medium">
                  {attended}/{programWeeks}
                </td>
                <td className="text-center py-2 px-2 border-b border-gray-200 font-medium">
                  {percentage}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
