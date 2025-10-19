import { Participant, ageGroupLabels } from "@shared/schema";

interface PrintViewProps {
  participants: Participant[];
  type: "roster" | "attendance";
}

export function PrintView({ participants, type }: PrintViewProps) {
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
              <th className="text-left py-2 px-3">Age Group</th>
              <th className="text-left py-2 px-3">Email</th>
              <th className="text-left py-2 px-3">Phone</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p, index) => (
              <tr key={p.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-2 px-3 border-b border-gray-200">{p.fullName}</td>
                <td className="py-2 px-3 border-b border-gray-200">{ageGroupLabels[p.ageGroup]}</td>
                <td className="py-2 px-3 border-b border-gray-200">{p.parentEmail}</td>
                <td className="py-2 px-3 border-b border-gray-200">{p.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

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
            {Array.from({ length: 10 }, (_, i) => (
              <th key={i} className="text-center py-2 px-1 w-8">W{i + 1}</th>
            ))}
            <th className="text-center py-2 px-2">Total</th>
            <th className="text-center py-2 px-2">%</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p, index) => {
            const attended = p.attendance.filter(Boolean).length;
            const percentage = Math.round((attended / 10) * 100);
            return (
              <tr key={p.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-2 px-2 border-b border-gray-200">{p.fullName}</td>
                <td className="py-2 px-2 border-b border-gray-200 text-xs">{ageGroupLabels[p.ageGroup]}</td>
                {p.attendance.map((attended, i) => (
                  <td key={i} className="text-center py-2 px-1 border-b border-gray-200">
                    {attended ? "✓" : ""}
                  </td>
                ))}
                <td className="text-center py-2 px-2 border-b border-gray-200 font-medium">
                  {attended}/10
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
