import { ParticipantWithPrograms, Program } from "@shared/schema";

export function exportToCSV(
  participants: ParticipantWithPrograms[], 
  programs: Program[], 
  filename: string = "participants"
) {
  const headers = ["Name", "Email", "Phone", "Age", "Programs", "Weeks Attended", "Attendance %"];
  
  const rows = participants.map((p) => {
    // Calculate total attendance across all programs
    const totalAttended = p.programs.reduce((sum, prog) => 
      sum + prog.attendance.filter(Boolean).length, 0
    );
    const totalWeeks = p.programs.reduce((sum, prog) => 
      sum + prog.attendance.length, 0
    );
    const percentage = totalWeeks > 0 ? Math.round((totalAttended / totalWeeks) * 100) : 0;
    const programNames = p.programs.map(prog => prog.name).join("; ");
    
    return [
      p.fullName,
      p.parentEmail || "",
      p.phoneNumber || "",
      p.age.toString(),
      programNames || "None",
      `${totalAttended}/${totalWeeks}`,
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
  participants: ParticipantWithPrograms[], 
  programs: Program[], 
  filename: string = "attendance"
) {
  const maxWeeks = programs.length > 0 
    ? Math.max(...programs.map(p => p.attendanceWeeks))
    : 10;

  const headers = [
    "Name",
    "Age",
    "Programs",
    ...Array.from({ length: maxWeeks }, (_, i) => `W${i + 1}`),
    "Total",
    "%",
  ];

  const rows = participants.map((p) => {
    // Use first program's attendance for export (TODO: improve for multi-program)
    const firstProgram = p.programs[0];
    const attendance = firstProgram?.attendance || [];
    const programNames = p.programs.map(prog => prog.name).join("; ");
    
    const weekColumns = Array.from({ length: maxWeeks }, (_, i) => 
      i < attendance.length ? (attendance[i] ? "✓" : "") : ""
    );
    
    const attended = attendance.filter(Boolean).length;
    const total = attendance.length;
    const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;

    return [
      p.fullName,
      p.age.toString(),
      programNames || "None",
      ...weekColumns,
      `${attended}/${total}`,
      `${percentage}%`,
    ];
  });

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  downloadFile(csvContent, `${filename}.csv`, "text/csv");
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
