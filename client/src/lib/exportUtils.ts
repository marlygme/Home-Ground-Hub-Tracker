import { Participant, ageGroupLabels } from "@shared/schema";

export function exportToCSV(participants: Participant[], filename: string = "participants") {
  const headers = ["Name", "Email", "Phone", "Age Group", "Weeks Attended", "Attendance %"];
  
  const rows = participants.map((p) => {
    const attendedWeeks = p.attendance.filter(Boolean).length;
    const percentage = Math.round((attendedWeeks / 10) * 100);
    
    return [
      p.fullName,
      p.parentEmail,
      p.phoneNumber,
      ageGroupLabels[p.ageGroup],
      `${attendedWeeks}/10`,
      `${percentage}%`,
    ];
  });

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  downloadFile(csvContent, `${filename}.csv`, "text/csv");
}

export function exportAttendanceToCSV(participants: Participant[], filename: string = "attendance") {
  const headers = [
    "Name",
    "Age Group",
    ...Array.from({ length: 10 }, (_, i) => `Week ${i + 1}`),
    "Total",
    "%",
  ];

  const rows = participants.map((p) => {
    const attendedWeeks = p.attendance.filter(Boolean).length;
    const percentage = Math.round((attendedWeeks / 10) * 100);

    return [
      p.fullName,
      ageGroupLabels[p.ageGroup],
      ...p.attendance.map((attended) => (attended ? "✓" : "")),
      `${attendedWeeks}/10`,
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
