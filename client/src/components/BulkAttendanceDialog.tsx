import { useState, useMemo } from "react";
import { ParticipantWithPrograms, Program } from "@shared/schema";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Users } from "lucide-react";

interface BulkAttendanceDialogProps {
  participants: ParticipantWithPrograms[];
  programs: Program[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: { participantId: string; programId: string; attendance: boolean[] }[]) => void;
}

export function BulkAttendanceDialog({
  participants,
  programs,
  open,
  onOpenChange,
  onSave,
}: BulkAttendanceDialogProps) {
  const [selectedProgramId, setSelectedProgramId] = useState<string | "all">("all");
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);

  const filteredParticipants =
    selectedProgramId === "all"
      ? participants
      : participants.filter((p) => p.programs.some(prog => prog.id === selectedProgramId));

  const maxWeeks = useMemo(() => {
    if (selectedProgramId === "all") {
      return Math.max(...programs.map(p => p.attendanceWeeks), 10);
    }
    const program = programs.find(p => p.id === selectedProgramId);
    return program?.attendanceWeeks || 10;
  }, [selectedProgramId, programs]);

  const toggleParticipant = (participantId: string) => {
    setSelectedParticipantIds((prev) =>
      prev.includes(participantId)
        ? prev.filter((id) => id !== participantId)
        : [...prev, participantId]
    );
  };

  const selectAllParticipants = () => {
    setSelectedParticipantIds(filteredParticipants.map((p) => p.id));
  };

  const clearAllParticipants = () => {
    setSelectedParticipantIds([]);
  };

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
    const updates: { participantId: string; programId: string; attendance: boolean[] }[] = [];
    
    selectedParticipantIds.forEach((participantId) => {
      const participant = participants.find((p) => p.id === participantId);
      if (!participant) return;

      // If a specific program is selected, only update that program
      if (selectedProgramId !== "all") {
        const programData = participant.programs.find((p) => p.id === selectedProgramId);
        if (programData) {
          const newAttendance = [...programData.attendance];
          selectedWeeks.forEach((weekIndex) => {
            if (weekIndex < newAttendance.length) {
              newAttendance[weekIndex] = true;
            }
          });
          updates.push({ participantId, programId: selectedProgramId, attendance: newAttendance });
        }
      } else {
        // If "all" programs selected, update ALL programs for each participant
        participant.programs.forEach((program) => {
          const newAttendance = [...program.attendance];
          selectedWeeks.forEach((weekIndex) => {
            if (weekIndex < newAttendance.length) {
              newAttendance[weekIndex] = true;
            }
          });
          updates.push({ participantId, programId: program.id, attendance: newAttendance });
        });
      }
    });
    
    onSave(updates);
    setSelectedParticipantIds([]);
    setSelectedWeeks([]);
    onOpenChange(false);
  };

  const handleMarkAbsent = () => {
    const updates: { participantId: string; programId: string; attendance: boolean[] }[] = [];
    
    selectedParticipantIds.forEach((participantId) => {
      const participant = participants.find((p) => p.id === participantId);
      if (!participant) return;

      // If a specific program is selected, only update that program
      if (selectedProgramId !== "all") {
        const programData = participant.programs.find((p) => p.id === selectedProgramId);
        if (programData) {
          const newAttendance = [...programData.attendance];
          selectedWeeks.forEach((weekIndex) => {
            if (weekIndex < newAttendance.length) {
              newAttendance[weekIndex] = false;
            }
          });
          updates.push({ participantId, programId: selectedProgramId, attendance: newAttendance });
        }
      } else {
        // If "all" programs selected, update ALL programs for each participant
        participant.programs.forEach((program) => {
          const newAttendance = [...program.attendance];
          selectedWeeks.forEach((weekIndex) => {
            if (weekIndex < newAttendance.length) {
              newAttendance[weekIndex] = false;
            }
          });
          updates.push({ participantId, programId: program.id, attendance: newAttendance });
        });
      }
    });
    
    onSave(updates);
    setSelectedParticipantIds([]);
    setSelectedWeeks([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
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

        <div className="space-y-6 px-6 py-4 overflow-y-auto flex-1">
          <div>
            <h3 className="text-sm font-medium mb-3">1. Filter by Program (Optional)</h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedProgramId === "all" ? "default" : "outline"}
                className="cursor-pointer hover-elevate active-elevate-2"
                onClick={() => {
                  setSelectedProgramId("all");
                  setSelectedParticipantIds([]);
                }}
                data-testid="bulk-filter-all"
              >
                All Programs ({participants.length})
              </Badge>
              {programs.map((program) => {
                const count = participants.filter((p) => p.programs.some(prog => prog.id === program.id)).length;
                return (
                  <Badge
                    key={program.id}
                    variant={selectedProgramId === program.id ? "default" : "outline"}
                    className="cursor-pointer hover-elevate active-elevate-2"
                    onClick={() => {
                      setSelectedProgramId(program.id);
                      setSelectedParticipantIds([]);
                    }}
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
              <h3 className="text-sm font-medium">2. Select Participants</h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={selectAllParticipants}
                  data-testid="button-select-all-participants"
                >
                  Select All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearAllParticipants}
                  data-testid="button-clear-participants"
                >
                  Clear
                </Button>
              </div>
            </div>
            <ScrollArea className="h-48 rounded-lg border p-4">
              {filteredParticipants.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-8">
                  No participants found for this program
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50"
                    >
                      <Checkbox
                        id={`participant-${participant.id}`}
                        checked={selectedParticipantIds.includes(participant.id)}
                        onCheckedChange={() => toggleParticipant(participant.id)}
                        data-testid={`bulk-checkbox-participant-${participant.id}`}
                      />
                      <label
                        htmlFor={`participant-${participant.id}`}
                        className="text-sm font-medium cursor-pointer flex-1"
                      >
                        {participant.fullName}
                        <span className="text-xs text-muted-foreground ml-2">
                          Age {participant.age}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">3. Select Weeks</h3>
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
                {selectedParticipantIds.length} participant(s) × {selectedWeeks.length} week(s)
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 px-6 py-4 border-t flex-shrink-0">
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
            disabled={selectedWeeks.length === 0 || selectedParticipantIds.length === 0}
            data-testid="button-mark-absent"
          >
            Mark Absent
          </Button>
          <Button
            onClick={handleMarkPresent}
            disabled={selectedWeeks.length === 0 || selectedParticipantIds.length === 0}
            data-testid="button-mark-present"
          >
            Mark Present
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
