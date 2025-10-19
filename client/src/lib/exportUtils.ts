import { Participant, Program } from "@shared/schema";

export function exportToCSV(
  participants: Participant[], 
  programs: Program[], 
  filename: string = "participants"
) {
  const getProgramName = (programId: string): string => {
    const program = programs.find(p => p.id === programId);
    return program?.name || "Unknown";
  };

  const getProgramWeeks = (programId: string): number => {
    const program = programs.find(p => p.id === programId);
    return program?.attendanceWeeks || 10;
  };

  const headers = ["Name", "Email", "Phone", "Age", "Program", "Weeks Attended", "Attendance %"];
  
  const rows = participants.map((p) => {
    const programWeeks = getProgramWeeks(p.programId);
    const attendedWeeks = p.attendance.filter(Boolean).length;
    const percentage = programWeeks > 0 ? Math.round((attendedWeeks / programWeeks) * 100) : 0;
    
    return [
      p.fullName,
      p.parentEmail,
      p.phoneNumber,
      p.age.toString(),
      getProgramName(p.programId),
      `${attendedWeeks}/${programWeeks}`,
      `${percentage}%`,
    ];
  });

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  downloadFile(csvContent, `${filename}.csv`, "text/csv");
}

export function exportAttendanceToCSV(
  participants: Participant[], 
  programs: Program[], 
  filename: string = "attendance"
) {
  const getProgramName = (programId: string): string => {
    const program = programs.find(p => p.id === programId);
    return program?.name || "Unknown";
  };

  const getProgramWeeks = (programId: string): number => {
    const program = programs.find(p => p.id === programId);
    return program?.attendanceWeeks || 10;
  };

  const maxWeeks = programs.length > 0 
    ? Math.max(...programs.map(p => p.attendanceWeeks))
    : 10;

  const headers = [
    "Name",
    "Age",
    "Program",
    ...Array.from({ length: maxWeeks }, (_, i) => `Week ${i + 1}`),
    "Total",
    "%",
  ];

  const rows = participants.map((p) => {
    const programWeeks = getProgramWeeks(p.programId);
    const attendedWeeks = p.attendance.filter(Boolean).length;
    const percentage = programWeeks > 0 ? Math.round((attendedWeeks / programWeeks) * 100) : 0;

    const weekColumns = Array.from({ length: maxWeeks }, (_, i) => {
      if (i < programWeeks) {
        return p.attendance[i] ? "✓" : "";
      }
      return "-";
    });

    return [
      p.fullName,
      p.age.toString(),
      getProgramName(p.programId),
      ...weekColumns,
      `${attendedWeeks}/${programWeeks}`,
      `${percentage}%`,
    ];
  });

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  downloadFile(csvContent, `${filename}.csv`, "text/csv");
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
