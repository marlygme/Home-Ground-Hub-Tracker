import { useState } from "react";
import { Participant, ageGroups, ageGroupLabels, type AgeGroup } from "@shared/schema";
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: { participantId: string; attendance: boolean[] }[]) => void;
}

export function BulkAttendanceDialog({
  participants,
  open,
  onOpenChange,
  onSave,
}: BulkAttendanceDialogProps) {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup | "all">("all");
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);

  const filteredParticipants =
    selectedAgeGroup === "all"
      ? participants
      : participants.filter((p) => p.ageGroup === selectedAgeGroup);

  const toggleWeek = (weekIndex: number) => {
    setSelectedWeeks((prev) =>
      prev.includes(weekIndex)
        ? prev.filter((w) => w !== weekIndex)
        : [...prev, weekIndex]
    );
  };

  const selectAllWeeks = () => {
    setSelectedWeeks(Array.from({ length: 10 }, (_, i) => i));
  };

  const clearAllWeeks = () => {
    setSelectedWeeks([]);
  };

  const handleMarkPresent = () => {
    const updates = filteredParticipants.map((p) => {
      const newAttendance = [...p.attendance];
      selectedWeeks.forEach((weekIndex) => {
        newAttendance[weekIndex] = true;
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
        newAttendance[weekIndex] = false;
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
            <h3 className="text-sm font-medium mb-3">1. Select Age Group</h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedAgeGroup === "all" ? "default" : "outline"}
                className="cursor-pointer hover-elevate active-elevate-2"
                onClick={() => setSelectedAgeGroup("all")}
                data-testid="bulk-filter-all"
              >
                All Groups ({participants.length})
              </Badge>
              {ageGroups.map((group) => {
                const count = participants.filter((p) => p.ageGroup === group).length;
                return (
                  <Badge
                    key={group}
                    variant={selectedAgeGroup === group ? "default" : "outline"}
                    className="cursor-pointer hover-elevate active-elevate-2"
                    onClick={() => setSelectedAgeGroup(group)}
                    data-testid={`bulk-filter-${group}`}
                  >
                    {ageGroupLabels[group]} ({count})
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
              {Array.from({ length: 10 }, (_, i) => (
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
