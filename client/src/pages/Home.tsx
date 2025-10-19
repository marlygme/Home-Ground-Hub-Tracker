import { useState, useMemo, useEffect } from "react";
import { Participant, InsertParticipant, ageGroups, ageGroupLabels, type AgeGroup } from "@shared/schema";
import { localStorageService } from "@/lib/localStorage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ParticipantForm } from "@/components/ParticipantForm";
import { AttendanceTracker } from "@/components/AttendanceTracker";
import { ParticipantCard } from "@/components/ParticipantCard";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/components/ThemeProvider";
import { UserPlus, Search, Moon, Sun, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup | "all">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | undefined>();
  const [attendanceParticipant, setAttendanceParticipant] = useState<Participant | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    const data = localStorageService.getParticipants();
    setParticipants(data);
  }, []);

  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const matchesSearch =
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.parentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phoneNumber.includes(searchQuery);

      const matchesAgeGroup =
        selectedAgeGroup === "all" || p.ageGroup === selectedAgeGroup;

      return matchesSearch && matchesAgeGroup;
    });
  }, [participants, searchQuery, selectedAgeGroup]);

  const handleAddParticipant = (data: InsertParticipant) => {
    const newParticipant: Participant = {
      id: crypto.randomUUID(),
      ...data,
      attendance: Array(10).fill(false),
      createdAt: new Date().toISOString(),
    };

    localStorageService.addParticipant(newParticipant);
    setParticipants([...participants, newParticipant]);
    setLastSaved(new Date());
    toast({
      title: "Participant added",
      description: `${newParticipant.fullName} has been added successfully.`,
    });
  };

  const handleEditParticipant = (data: InsertParticipant) => {
    if (!editingParticipant) return;

    const updated: Participant = {
      ...editingParticipant,
      ...data,
    };

    localStorageService.updateParticipant(editingParticipant.id, updated);
    setParticipants(
      participants.map((p) => (p.id === editingParticipant.id ? updated : p))
    );
    setEditingParticipant(undefined);
    setLastSaved(new Date());
    toast({
      title: "Changes saved",
      description: `${updated.fullName}'s information has been updated.`,
    });
  };

  const handleDeleteParticipant = (id: string) => {
    const participant = participants.find((p) => p.id === id);
    localStorageService.deleteParticipant(id);
    setParticipants(participants.filter((p) => p.id !== id));
    setLastSaved(new Date());
    toast({
      title: "Participant removed",
      description: participant
        ? `${participant.fullName} has been removed.`
        : "Participant has been removed.",
      variant: "destructive",
    });
  };

  const handleSaveAttendance = (participantId: string, attendance: boolean[]) => {
    const participant = participants.find((p) => p.id === participantId);
    if (!participant) return;

    const updated = { ...participant, attendance };
    localStorageService.updateParticipant(participantId, updated);
    setParticipants(participants.map((p) => (p.id === participantId ? updated : p)));
    setLastSaved(new Date());
    toast({
      title: "Attendance saved",
      description: `Attendance for ${participant.fullName} has been updated.`,
    });
  };

  const openAddForm = () => {
    setEditingParticipant(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (participant: Participant) => {
    setEditingParticipant(participant);
    setIsFormOpen(true);
  };

  const openAttendance = (participant: Participant) => {
    const latestParticipant = participants.find((p) => p.id === participant.id);
    setAttendanceParticipant(latestParticipant || participant);
    setIsAttendanceOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">⚽</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold" data-testid="text-app-title">
                  Home Ground Hub
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Soccer Program Tracker
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleTheme}
                data-testid="button-theme-toggle"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
              <Button onClick={openAddForm} className="gap-2" data-testid="button-add-participant">
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Participant</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Badge
              variant={selectedAgeGroup === "all" ? "default" : "outline"}
              className="cursor-pointer hover-elevate active-elevate-2 whitespace-nowrap"
              onClick={() => setSelectedAgeGroup("all")}
              data-testid="filter-all"
            >
              All Groups
            </Badge>
            {ageGroups.map((group) => (
              <Badge
                key={group}
                variant={selectedAgeGroup === group ? "default" : "outline"}
                className="cursor-pointer hover-elevate active-elevate-2 whitespace-nowrap"
                onClick={() => setSelectedAgeGroup(group)}
                data-testid={`filter-${group}`}
              >
                {ageGroupLabels[group]}
              </Badge>
            ))}
          </div>

          {participants.length === 0 ? (
            <EmptyState onAddParticipant={openAddForm} />
          ) : filteredParticipants.length === 0 ? (
            <EmptyState onAddParticipant={openAddForm} isFiltered />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredParticipants.map((participant) => (
                  <ParticipantCard
                    key={participant.id}
                    participant={participant}
                    onEdit={openEditForm}
                    onDelete={handleDeleteParticipant}
                    onViewAttendance={openAttendance}
                  />
                ))}
              </div>

              {lastSaved && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-4">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span data-testid="text-last-saved">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <ParticipantForm
        participant={editingParticipant}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={editingParticipant ? handleEditParticipant : handleAddParticipant}
      />

      <AttendanceTracker
        participant={attendanceParticipant}
        open={isAttendanceOpen}
        onOpenChange={setIsAttendanceOpen}
        onSave={handleSaveAttendance}
      />
    </div>
  );
}
