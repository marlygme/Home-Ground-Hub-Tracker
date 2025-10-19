import { useState } from "react";
import { Plus, Edit2, Trash2, Calendar } from "lucide-react";
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
import { localStorageService } from "@/lib/localStorage";
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
    try {
      if (editingProgram) {
        const updatedProgram: Program = {
          ...editingProgram,
          name: data.name,
          attendanceWeeks: data.attendanceWeeks,
        };
        localStorageService.updateProgram(editingProgram.id, updatedProgram);
        toast({
          title: "Program updated",
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        const newProgram: Program = {
          id: crypto.randomUUID(),
          name: data.name,
          attendanceWeeks: data.attendanceWeeks,
          createdAt: new Date().toISOString(),
        };
        localStorageService.addProgram(newProgram);
        toast({
          title: "Program created",
          description: `${data.name} has been created successfully.`,
        });
      }
      handleCloseDialog();
      onProgramsChange();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save program. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (program: Program) => {
    setDeleteConfirm(program);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      localStorageService.deleteProgram(deleteConfirm.id);
      toast({
        title: "Program deleted",
        description: `${deleteConfirm.name} and all its participants have been deleted.`,
      });
      setDeleteConfirm(null);
      onProgramsChange();
    }
  };

  const getParticipantCount = (programId: string) => {
    const participants = localStorageService.getParticipants();
    return participants.filter(p => p.programId === programId).length;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Programs & Events</h2>
          <p className="text-muted-foreground">
            Create and manage soccer programs and events
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-add-program">
          <Plus className="h-4 w-4 mr-2" />
          Add Program
        </Button>
      </div>

      {programs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-1">No programs yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first soccer program to get started
            </p>
            <Button onClick={() => handleOpenDialog()} data-testid="button-add-first-program">
              <Plus className="h-4 w-4 mr-2" />
              Add Program
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <Card key={program.id} data-testid={`card-program-${program.id}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{program.name}</span>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleOpenDialog(program)}
                      data-testid={`button-edit-program-${program.id}`}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(program)}
                      data-testid={`button-delete-program-${program.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  {program.attendanceWeeks} weeks • {getParticipantCount(program.id)} participants
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent data-testid="dialog-program-form">
          <DialogHeader>
            <DialogTitle>
              {editingProgram ? "Edit Program" : "Create New Program"}
            </DialogTitle>
            <DialogDescription>
              {editingProgram 
                ? "Update the program details below." 
                : "Create a new soccer program or event for participants to join."}
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
                    <FormLabel>Number of Weeks</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={52}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        data-testid="input-attendance-weeks"
                      />
                    </FormControl>
                    <FormDescription>
                      How many weeks will this program run? (1-52)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCloseDialog}
                  data-testid="button-cancel-program"
                >
                  Cancel
                </Button>
                <Button type="submit" data-testid="button-save-program">
                  {editingProgram ? "Update" : "Create"} Program
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent data-testid="dialog-delete-program">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Program</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>? 
              This will also delete all {getParticipantCount(deleteConfirm?.id || "")} participants 
              enrolled in this program. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-program">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-program"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
