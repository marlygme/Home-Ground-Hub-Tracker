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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const firstProgram = participant?.programs[0];
  const [selectedProgramId, setSelectedProgramId] = useState<string>(firstProgram?.id || "");
  
  // Find the currently selected program
  const selectedProgram = participant?.programs.find(p => p.id === selectedProgramId);
  const totalWeeks = selectedProgram?.attendance.length || 10;
  const [attendance, setAttendance] = useState<boolean[]>(
    selectedProgram?.attendance || Array(totalWeeks).fill(false)
  );

  // Update selected program when participant changes or dialog opens
  useEffect(() => {
    if (participant?.programs.length) {
      setSelectedProgramId(participant.programs[0].id);
    }
  }, [participant, open]);

  // Update attendance when selected program changes
  useEffect(() => {
    if (selectedProgram?.attendance) {
      setAttendance(selectedProgram.attendance);
    }
  }, [selectedProgram]);

  const handleCheckboxChange = (weekIndex: number) => {
    const newAttendance = [...attendance];
    newAttendance[weekIndex] = !newAttendance[weekIndex];
    setAttendance(newAttendance);
  };

  const handleSave = () => {
    if (participant && selectedProgram) {
      onSave(participant.id, selectedProgram.id, attendance);
      onOpenChange(false);
    }
  };

  const handleProgramChange = (programId: string) => {
    setSelectedProgramId(programId);
  };

  const attendedWeeks = attendance.filter(Boolean).length;
  const completionPercentage = totalWeeks > 0 ? Math.round((attendedWeeks / totalWeeks) * 100) : 0;

  if (!participant) return null;

  const hasMultiplePrograms = (participant?.programs.length || 0) > 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Attendance Tracker - {participant.fullName}
          </DialogTitle>
          {!hasMultiplePrograms && (
            <p className="text-sm text-muted-foreground mt-1">{programName}</p>
          )}
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
          {hasMultiplePrograms && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Program</label>
              <Select value={selectedProgramId} onValueChange={handleProgramChange}>
                <SelectTrigger data-testid="select-program-trigger">
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  {participant?.programs.map((program) => (
                    <SelectItem 
                      key={program.id} 
                      value={program.id}
                      data-testid={`select-program-${program.id}`}
                    >
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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
