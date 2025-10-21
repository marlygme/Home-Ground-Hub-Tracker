import { useState, useEffect } from "react";
import { ParticipantWithPrograms } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface AttendanceTrackerProps {
  participant: ParticipantWithPrograms | null;
  programName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (participantId: string, programId: string, attendance: boolean[]) => void;
}

export function AttendanceTracker({
  participant,
  programName,
  open,
  onOpenChange,
  onSave,
}: AttendanceTrackerProps) {
  // Use first program's attendance for now (TODO: support multi-program)
  const firstProgram = participant?.programs[0];
  const totalWeeks = firstProgram?.attendance.length || 10;
  const [attendance, setAttendance] = useState<boolean[]>(
    firstProgram?.attendance || Array(totalWeeks).fill(false)
  );

  useEffect(() => {
    if (firstProgram?.attendance) {
      setAttendance(firstProgram.attendance);
    }
  }, [participant, firstProgram?.attendance]);

  const handleCheckboxChange = (weekIndex: number) => {
    const newAttendance = [...attendance];
    newAttendance[weekIndex] = !newAttendance[weekIndex];
    setAttendance(newAttendance);
  };

  const handleSave = () => {
    if (participant && firstProgram) {
      onSave(participant.id, firstProgram.id, attendance);
      onOpenChange(false);
    }
  };

  const attendedWeeks = attendance.filter(Boolean).length;
  const completionPercentage = totalWeeks > 0 ? Math.round((attendedWeeks / totalWeeks) * 100) : 0;

  if (!participant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Attendance Tracker - {participant.fullName}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">{programName}</p>
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-4 top-4"
            onClick={() => onOpenChange(false)}
            data-testid="button-close-attendance"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Attendance Summary</p>
              <p className="text-2xl font-semibold" data-testid="text-attendance-summary">
                {attendedWeeks} / {totalWeeks} weeks
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Completion</p>
              <p className="text-2xl font-semibold text-primary">
                {completionPercentage}%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Array.from({ length: totalWeeks }, (_, i) => (
              <div
                key={i}
                className="flex items-center space-x-2 p-3 rounded-lg border hover-elevate"
              >
                <Checkbox
                  id={`week-${i}`}
                  checked={attendance[i]}
                  onCheckedChange={() => handleCheckboxChange(i)}
                  data-testid={`checkbox-week-${i + 1}`}
                />
                <label
                  htmlFor={`week-${i}`}
                  className="text-sm font-medium cursor-pointer flex-1"
                >
                  Week {i + 1}
                </label>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel-attendance"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="button-save-attendance">
            Save Attendance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
