import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProgramSchema, type Program, type InsertProgram } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProgramManagementProps {
  programs: Program[];
  onProgramsChange: () => void;
}

export function ProgramManagement({ programs, onProgramsChange }: ProgramManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Program | null>(null);
  const { toast } = useToast();

  const form = useForm<InsertProgram>({
    resolver: zodResolver(insertProgramSchema),
    defaultValues: {
      name: "",
      attendanceWeeks: 10,
    },
  });

  // Create program mutation
  const createProgramMutation = useMutation({
    mutationFn: async (data: InsertProgram) => {
      return apiRequest("/api/programs", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: (newProgram: Program) => {
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      toast({
        title: "Program created",
        description: `${newProgram.name} has been created successfully.`,
      });
      handleCloseDialog();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create program. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update program mutation
  const updateProgramMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertProgram> }) => {
      return apiRequest(`/api/programs/${id}`, {
        method: "PATCH",
        body: data,
      });
    },
    onSuccess: (updatedProgram: Program) => {
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      toast({
        title: "Program updated",
        description: `${updatedProgram.name} has been updated successfully.`,
      });
      handleCloseDialog();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update program. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete program mutation
  const deleteProgramMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/programs/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      toast({
        title: "Program deleted",
        description: "The program has been removed successfully.",
        variant: "destructive",
      });
      setDeleteConfirm(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete program. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = (program?: Program) => {
    if (program) {
      setEditingProgram(program);
      form.reset({
        name: program.name,
        attendanceWeeks: program.attendanceWeeks,
      });
    } else {
      setEditingProgram(null);
      form.reset({
        name: "",
        attendanceWeeks: 10,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProgram(null);
    form.reset();
  };

  const onSubmit = (data: InsertProgram) => {
    if (editingProgram) {
      updateProgramMutation.mutate({ id: editingProgram.id, data });
    } else {
      createProgramMutation.mutate(data);
    }
  };

  const handleDelete = (program: Program) => {
    setDeleteConfirm(program);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteProgramMutation.mutate(deleteConfirm.id);
    }
  };

  const getParticipantCount = (programId: string) => {
    // This will be updated when we have participants data
    return 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold" data-testid="text-programs-title">
            Soccer Programs
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your soccer programs and their attendance schedules
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-create-program">
          <Plus className="h-4 w-4 mr-2" />
          Create Program
        </Button>
      </div>

      {programs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 px-4">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Programs Yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Create your first soccer program to start managing participants and tracking attendance.
            </p>
            <Button onClick={() => handleOpenDialog()} data-testid="button-create-first-program">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Program
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((program) => (
            <Card key={program.id} className="hover-elevate" data-testid={`card-program-${program.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg" data-testid="text-program-name">
                      {program.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {program.attendanceWeeks} week{program.attendanceWeeks !== 1 ? "s" : ""}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span data-testid="text-program-weeks">
                    {program.attendanceWeeks} attendance weeks
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 shrink-0" />
                  <span data-testid="text-participant-count">
                    {getParticipantCount(program.id)} participant{getParticipantCount(program.id) !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenDialog(program)}
                    className="flex-1"
                    data-testid="button-edit-program"
                  >
                    <Edit2 className="h-4 w-4 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(program)}
                    className="text-destructive hover:text-destructive"
                    data-testid="button-delete-program"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingProgram ? "Edit Program" : "Create New Program"}
            </DialogTitle>
            <DialogDescription>
              {editingProgram
                ? "Update the program details below."
                : "Add a new soccer program with a custom name and attendance schedule."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Monday Soccer, Youth Cup 02.12"
                        {...field}
                        data-testid="input-program-name"
                      />
                    </FormControl>
                    <FormDescription>
                      Give your program a descriptive name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attendanceWeeks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attendance Weeks</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={52}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        data-testid="input-attendance-weeks"
                      />
                    </FormControl>
                    <FormDescription>
                      Number of weeks for attendance tracking (1-52)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCloseDialog}
                  data-testid="button-cancel-program"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  data-testid="button-save-program"
                  disabled={createProgramMutation.isPending || updateProgramMutation.isPending}
                >
                  {editingProgram ? "Save Changes" : "Create Program"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Program?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm?.name}"? This action cannot be undone.
              All participants assigned to this program will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
              disabled={deleteProgramMutation.isPending}
            >
              Delete Program
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
