import { ParticipantWithPrograms, Program } from "@shared/schema";
import { formatAustralianPhone } from "@/lib/phoneUtils";

interface PrintViewProps {
  participants: ParticipantWithPrograms[];
  programs: Program[];
  type: "roster" | "attendance";
}

export function PrintView({ participants, programs, type }: PrintViewProps) {
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
              <th className="text-left py-2 px-3">Programs</th>
              <th className="text-left py-2 px-3">Email</th>
              <th className="text-left py-2 px-3">Phone</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p, index) => {
              const programNames = p.programs.map(prog => prog.name).join(", ");
              return (
                <tr key={p.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="py-2 px-3 border-b border-gray-200">{p.fullName}</td>
                  <td className="py-2 px-3 border-b border-gray-200">{p.age}</td>
                  <td className="py-2 px-3 border-b border-gray-200">{programNames || "None"}</td>
                  <td className="py-2 px-3 border-b border-gray-200">{p.parentEmail || ""}</td>
                  <td className="py-2 px-3 border-b border-gray-200">
                    {p.phoneNumber ? formatAustralianPhone(p.phoneNumber) : ""}
                  </td>
                </tr>
              );
            })}
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
            <th className="text-left py-2 px-2">Programs</th>
            {Array.from({ length: maxWeeks }, (_, i) => (
              <th key={i} className="text-center py-2 px-1 w-8">
                W{i + 1}
              </th>
            ))}
            <th className="text-left py-2 px-2">Total</th>
            <th className="text-left py-2 px-2">%</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p, index) => {
            // Use first program's attendance (TODO: improve for multi-program printing)
            const firstProgram = p.programs[0];
            const attendance = firstProgram?.attendance || [];
            const programNames = p.programs.map(prog => prog.name).join(", ");
            const attended = attendance.filter(Boolean).length;
            const total = attendance.length;
            const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
            
            return (
              <tr key={p.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-2 px-2 border-b border-gray-200">{p.fullName}</td>
                <td className="py-2 px-2 border-b border-gray-200">{p.age}</td>
                <td className="py-2 px-2 border-b border-gray-200 text-xs">{programNames || "None"}</td>
                {Array.from({ length: maxWeeks }, (_, i) => (
                  <td key={i} className="text-center py-2 px-1 border-b border-gray-200">
                    {i < attendance.length && attendance[i] ? "✓" : ""}
                  </td>
                ))}
                <td className="py-2 px-2 border-b border-gray-200">
                  {attended}/{total}
                </td>
                <td className="py-2 px-2 border-b border-gray-200">
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
