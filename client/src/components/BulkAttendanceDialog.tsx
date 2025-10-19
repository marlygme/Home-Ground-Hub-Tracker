import { useState, useMemo } from "react";
import { Participant, Program } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, Users } from "lucide-react";

interface BulkAttendanceDialogProps {
  participants: Participant[];
  programs: Program[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: { participantId: string; attendance: boolean[] }[]) => void;
}

export function BulkAttendanceDialog({
  participants,
  programs,
  open,
  onOpenChange,
  onSave,
}: BulkAttendanceDialogProps) {
  const [selectedProgramId, setSelectedProgramId] = useState<string | "all">("all");
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);

  const filteredParticipants =
    selectedProgramId === "all"
      ? participants
      : participants.filter((p) => p.programId === selectedProgramId);

  const maxWeeks = useMemo(() => {
    if (selectedProgramId === "all") {
      return Math.max(...programs.map(p => p.attendanceWeeks), 10);
    }
    const program = programs.find(p => p.id === selectedProgramId);
    return program?.attendanceWeeks || 10;
  }, [selectedProgramId, programs]);

  const toggleWeek = (weekIndex: number) => {
    setSelectedWeeks((prev) =>
      prev.includes(weekIndex)
        ? prev.filter((w) => w !== weekIndex)
        : [...prev, weekIndex]
    );
  };

  const selectAllWeeks = () => {
    setSelectedWeeks(Array.from({ length: maxWeeks }, (_, i) => i));
  };

  const clearAllWeeks = () => {
    setSelectedWeeks([]);
  };

  const handleMarkPresent = () => {
    const updates = filteredParticipants.map((p) => {
      const newAttendance = [...p.attendance];
      selectedWeeks.forEach((weekIndex) => {
        if (weekIndex < newAttendance.length) {
          newAttendance[weekIndex] = true;
        }
      });
      return { participantId: p.id, attendance: newAttendance };
    });
    onSave(updates);
    setSelectedWeeks([]);
    onOpenChange(false);
  };

  const handleMarkAbsent = () => {
    const updates = filteredParticipants.map((p) => {
      const newAttendance = [...p.attendance];
      selectedWeeks.forEach((weekIndex) => {
        if (weekIndex < newAttendance.length) {
          newAttendance[weekIndex] = false;
        }
      });
      return { participantId: p.id, attendance: newAttendance };
    });
    onSave(updates);
    setSelectedWeeks([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Bulk Attendance Marking
          </DialogTitle>
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-4 top-4"
            onClick={() => onOpenChange(false)}
            data-testid="button-close-bulk-attendance"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-sm font-medium mb-3">1. Select Program</h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedProgramId === "all" ? "default" : "outline"}
                className="cursor-pointer hover-elevate active-elevate-2"
                onClick={() => setSelectedProgramId("all")}
                data-testid="bulk-filter-all"
              >
                All Programs ({participants.length})
              </Badge>
              {programs.map((program) => {
                const count = participants.filter((p) => p.programId === program.id).length;
                return (
                  <Badge
                    key={program.id}
                    variant={selectedProgramId === program.id ? "default" : "outline"}
                    className="cursor-pointer hover-elevate active-elevate-2"
                    onClick={() => setSelectedProgramId(program.id)}
                    data-testid={`bulk-filter-${program.id}`}
                  >
                    {program.name} ({count})
                  </Badge>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">2. Select Weeks</h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={selectAllWeeks}
                  data-testid="button-select-all-weeks"
                >
                  Select All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearAllWeeks}
                  data-testid="button-clear-weeks"
                >
                  Clear
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Array.from({ length: maxWeeks }, (_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-2 p-3 rounded-lg border hover-elevate"
                >
                  <Checkbox
                    id={`bulk-week-${i}`}
                    checked={selectedWeeks.includes(i)}
                    onCheckedChange={() => toggleWeek(i)}
                    data-testid={`bulk-checkbox-week-${i + 1}`}
                  />
                  <label
                    htmlFor={`bulk-week-${i}`}
                    className="text-sm font-medium cursor-pointer flex-1"
                  >
                    Week {i + 1}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium" data-testid="text-bulk-summary">
                {filteredParticipants.length} participant(s) × {selectedWeeks.length} week(s)
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel-bulk"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleMarkAbsent}
            disabled={selectedWeeks.length === 0}
            data-testid="button-mark-absent"
          >
            Mark Absent
          </Button>
          <Button
            onClick={handleMarkPresent}
            disabled={selectedWeeks.length === 0}
            data-testid="button-mark-present"
          >
            Mark Present
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
