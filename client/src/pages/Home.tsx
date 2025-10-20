import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Participant, InsertParticipant, Program } from "@shared/schema";
import { queryClient, apiRequestJson } from "@/lib/queryClient";
import { exportToCSV, exportAttendanceToCSV } from "@/lib/exportUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParticipantForm } from "@/components/ParticipantForm";
import { AttendanceTracker } from "@/components/AttendanceTracker";
import { BulkAttendanceDialog } from "@/components/BulkAttendanceDialog";
import { ParticipantCard } from "@/components/ParticipantCard";
import { EmptyState } from "@/components/EmptyState";
import { StatisticsView } from "@/components/StatisticsView";
import { ProgramManagement } from "@/components/ProgramManagement";
import { PrintView } from "@/components/PrintView";
import { useTheme } from "@/components/ThemeProvider";
import { UserPlus, Search, Moon, Sun, Download, Users2, Printer, BarChart3, Calendar, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<string | "all">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isBulkAttendanceOpen, setIsBulkAttendanceOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | undefined>();
  const [attendanceParticipant, setAttendanceParticipant] = useState<Participant | null>(null);
  const [activeTab, setActiveTab] = useState("participants");
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  // Fetch programs
  const { data: programs = [], isLoading: programsLoading } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });

  // Fetch participants
  const { data: participants = [], isLoading: participantsLoading } = useQuery<Participant[]>({
    queryKey: ["/api/participants"],
  });

  // Create participant mutation
  const createParticipantMutation = useMutation({
    mutationFn: async (data: InsertParticipant) => {
      return apiRequestJson<Participant>("POST", "/api/participants", data);
    },
    onSuccess: (newParticipant: Participant) => {
      queryClient.invalidateQueries({ queryKey: ["/api/participants"] });
      const program = programs.find(p => p.id === newParticipant.programId);
      toast({
        title: "Participant added",
        description: `${newParticipant.fullName} has been added${program ? ` to ${program.name}` : ""}.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add participant. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update participant mutation
  const updateParticipantMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertParticipant> }) => {
      return apiRequestJson<Participant>("PATCH", `/api/participants/${id}`, data);
    },
    onSuccess: (updatedParticipant: Participant) => {
      queryClient.invalidateQueries({ queryKey: ["/api/participants"] });
      toast({
        title: "Changes saved",
        description: `${updatedParticipant.fullName}'s information has been updated.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update participant. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete participant mutation
  const deleteParticipantMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequestJson("DELETE", `/api/participants/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["/api/participants"] });
      const participant = participants.find((p) => p.id === id);
      toast({
        title: "Participant removed",
        description: participant
          ? `${participant.fullName} has been removed.`
          : "Participant has been removed.",
        variant: "destructive",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete participant. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const matchesSearch =
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.parentEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (p.phoneNumber?.includes(searchQuery) ?? false);

      const matchesProgram =
        selectedProgram === "all" || p.programId === selectedProgram;

      return matchesSearch && matchesProgram;
    });
  }, [participants, searchQuery, selectedProgram]);

  const handleAddParticipant = (data: InsertParticipant) => {
    const program = programs.find(p => p.id === data.programId);
    if (!program) {
      toast({
        title: "Error",
        description: "Selected program not found.",
        variant: "destructive",
      });
      return;
    }

    // Initialize attendance array
    const participantData = {
      ...data,
      attendance: Array(program.attendanceWeeks).fill(false),
    };

    createParticipantMutation.mutate(participantData);
    setIsFormOpen(false);
  };

  const handleEditParticipant = (data: InsertParticipant) => {
    if (!editingParticipant) return;

    const program = programs.find(p => p.id === data.programId);
    if (!program) {
      toast({
        title: "Error",
        description: "Selected program not found.",
        variant: "destructive",
      });
      return;
    }

    // If program changed, reset attendance
    const updateData: Partial<InsertParticipant> = data.programId !== editingParticipant.programId
      ? { ...data, attendance: Array(program.attendanceWeeks).fill(false) }
      : data;

    updateParticipantMutation.mutate({ id: editingParticipant.id, data: updateData });
    setEditingParticipant(undefined);
    setIsFormOpen(false);
  };

  const handleDeleteParticipant = (id: string) => {
    deleteParticipantMutation.mutate(id);
  };

  const handleSaveAttendance = (participantId: string, attendance: boolean[]) => {
    updateParticipantMutation.mutate({ id: participantId, data: { attendance } });
    setIsAttendanceOpen(false);
  };

  const openAddForm = () => {
    if (programs.length === 0) {
      toast({
        title: "No programs available",
        description: "Please create a program first before adding participants.",
        variant: "destructive",
      });
      setActiveTab("programs");
      return;
    }
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

  const handleBulkAttendanceSave = (updates: { participantId: string; attendance: boolean[] }[]) => {
    // Execute all updates in parallel
    Promise.all(
      updates.map(({ participantId, attendance }) =>
        updateParticipantMutation.mutateAsync({ id: participantId, data: { attendance } })
      )
    ).then(() => {
      toast({
        title: "Bulk attendance updated",
        description: `Updated attendance for ${updates.length} participant(s).`,
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to update some participants. Please try again.",
        variant: "destructive",
      });
    });
  };

  const handleExportParticipants = () => {
    exportToCSV(participants, programs, "participants");
    toast({
      title: "Export successful",
      description: "Participant list has been exported to CSV.",
    });
  };

  const handleExportAttendance = () => {
    exportAttendanceToCSV(participants, programs, "attendance");
    toast({
      title: "Export successful",
      description: "Attendance data has been exported to CSV.",
    });
  };

  const handlePrint = (type: "roster" | "attendance") => {
    window.print();
    toast({
      title: "Printing",
      description: `Opening print dialog for ${type}...`,
    });
  };

  const getProgramName = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    return program?.name || "Unknown Program";
  };

  const isLoading = programsLoading || participantsLoading;

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 no-print">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="participants" className="gap-2" data-testid="tab-participants">
                <Users2 className="h-4 w-4" />
                Participants
              </TabsTrigger>
              <TabsTrigger value="programs" className="gap-2" data-testid="tab-programs">
                <Calendar className="h-4 w-4" />
                Programs
              </TabsTrigger>
              <TabsTrigger value="statistics" className="gap-2" data-testid="tab-statistics">
                <BarChart3 className="h-4 w-4" />
                Statistics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="participants" className="space-y-6">
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
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsBulkAttendanceOpen(true)}
                    disabled={participants.length === 0}
                    className="gap-2"
                    data-testid="button-bulk-attendance"
                  >
                    <Users2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Bulk Attendance</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleExportParticipants}
                    disabled={participants.length === 0}
                    className="gap-2"
                    data-testid="button-export-participants"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handlePrint("roster")}
                    disabled={participants.length === 0}
                    className="gap-2"
                    data-testid="button-print-roster"
                  >
                    <Printer className="h-4 w-4" />
                    <span className="hidden sm:inline">Print</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <Badge
                  variant={selectedProgram === "all" ? "default" : "outline"}
                  className="cursor-pointer hover-elevate active-elevate-2 whitespace-nowrap"
                  onClick={() => setSelectedProgram("all")}
                  data-testid="filter-all"
                >
                  All Programs
                </Badge>
                {programs.map((program) => (
                  <Badge
                    key={program.id}
                    variant={selectedProgram === program.id ? "default" : "outline"}
                    className="cursor-pointer hover-elevate active-elevate-2 whitespace-nowrap"
                    onClick={() => setSelectedProgram(program.id)}
                    data-testid={`filter-program-${program.id}`}
                  >
                    {program.name}
                  </Badge>
                ))}
              </div>

              {participants.length === 0 ? (
                <EmptyState onAddParticipant={openAddForm} />
              ) : filteredParticipants.length === 0 ? (
                <EmptyState onAddParticipant={openAddForm} isFiltered />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredParticipants.map((participant) => (
                    <ParticipantCard
                      key={participant.id}
                      participant={participant}
                      programName={getProgramName(participant.programId)}
                      onEdit={openEditForm}
                      onDelete={handleDeleteParticipant}
                      onViewAttendance={openAttendance}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="programs" className="space-y-6">
              <ProgramManagement programs={programs} onProgramsChange={() => queryClient.invalidateQueries({ queryKey: ["/api/programs"] })} />
            </TabsContent>

            <TabsContent value="statistics" className="space-y-6">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleExportAttendance}
                  disabled={participants.length === 0}
                  className="gap-2"
                  data-testid="button-export-attendance"
                >
                  <Download className="h-4 w-4" />
                  Export Attendance
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePrint("attendance")}
                  disabled={participants.length === 0}
                  className="gap-2"
                  data-testid="button-print-attendance"
                >
                  <Printer className="h-4 w-4" />
                  Print Attendance
                </Button>
              </div>

              {participants.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Statistics Yet</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Add participants to see attendance statistics and insights.
                  </p>
                </div>
              ) : (
                <StatisticsView participants={participants} programs={programs} />
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      <ParticipantForm
        participant={editingParticipant}
        programs={programs}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={editingParticipant ? handleEditParticipant : handleAddParticipant}
      />

      <AttendanceTracker
        participant={attendanceParticipant}
        programName={attendanceParticipant ? getProgramName(attendanceParticipant.programId) : ""}
        open={isAttendanceOpen}
        onOpenChange={setIsAttendanceOpen}
        onSave={handleSaveAttendance}
      />

      <BulkAttendanceDialog
        participants={participants}
        programs={programs}
        open={isBulkAttendanceOpen}
        onOpenChange={setIsBulkAttendanceOpen}
        onSave={handleBulkAttendanceSave}
      />

      <PrintView participants={participants} programs={programs} type="roster" />
      <PrintView participants={participants} programs={programs} type="attendance" />
    </div>
  );
}
