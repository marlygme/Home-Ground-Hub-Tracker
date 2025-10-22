import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { insertParticipantSchema, type InsertParticipant, type ParticipantWithPrograms, type Program } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ParticipantFormProps {
  participant?: ParticipantWithPrograms;
  programs: Program[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InsertParticipant) => void;
}

export function ParticipantForm({
  participant,
  programs,
  open,
  onOpenChange,
  onSubmit,
}: ParticipantFormProps) {
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);

  const form = useForm<InsertParticipant>({
    resolver: zodResolver(insertParticipantSchema),
    defaultValues: {
      fullName: "",
      parentEmail: "",
      phoneNumber: "",
      age: 8,
      programIds: [],
    },
  });

  // Reset form when participant changes or dialog opens
  useEffect(() => {
    if (open) {
      const existingProgramIds = participant?.programs?.map(p => p.id) || [];
      setSelectedPrograms(existingProgramIds);
      
      form.reset(participant
        ? {
            fullName: participant.fullName,
            parentEmail: participant.parentEmail || "",
            phoneNumber: participant.phoneNumber || "",
            age: participant.age,
            programIds: existingProgramIds,
          }
        : {
            fullName: "",
            parentEmail: "",
            phoneNumber: "",
            age: 8,
            programIds: [],
          }
      );
    }
  }, [open, participant, programs, form]);

  const handleSubmit = (data: InsertParticipant) => {
    onSubmit({ ...data, programIds: selectedPrograms });
    onOpenChange(false);
  };

  const toggleProgram = (programId: string) => {
    setSelectedPrograms(prev => 
      prev.includes(programId)
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
    
    // Update form value for validation
    const newPrograms = selectedPrograms.includes(programId)
      ? selectedPrograms.filter(id => id !== programId)
      : [...selectedPrograms, programId];
    form.setValue("programIds", newPrograms, { shouldValidate: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
          <DialogTitle className="text-xl font-semibold">
            {participant ? "Edit Participant" : "Add New Participant"}
          </DialogTitle>
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-4 top-4"
            onClick={() => onOpenChange(false)}
            data-testid="button-close-dialog"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="space-y-4 px-6 overflow-y-auto flex-1">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="font-medium text-sm">
                Full Name *
              </Label>
              <Input
                id="fullName"
                data-testid="input-fullName"
                placeholder="Enter participant's full name"
                {...form.register("fullName")}
                className={form.formState.errors.fullName ? "border-destructive" : ""}
              />
              {form.formState.errors.fullName && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentEmail" className="font-medium text-sm">
                Parent/Guardian Email
              </Label>
              <Input
                id="parentEmail"
                type="email"
                data-testid="input-parentEmail"
                placeholder="parent@example.com (optional)"
                {...form.register("parentEmail")}
                className={form.formState.errors.parentEmail ? "border-destructive" : ""}
              />
              {form.formState.errors.parentEmail && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.parentEmail.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="font-medium text-sm">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                data-testid="input-phoneNumber"
                placeholder="+61 412 345 678 or 0412 345 678 (optional)"
                {...form.register("phoneNumber")}
                className={form.formState.errors.phoneNumber ? "border-destructive" : ""}
              />
              {form.formState.errors.phoneNumber && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.phoneNumber.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Australian format (mobile or landline)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="font-medium text-sm">
                Age *
              </Label>
              <Input
                id="age"
                type="number"
                min={3}
                max={99}
                data-testid="input-age"
                placeholder="Enter age"
                {...form.register("age", { valueAsNumber: true })}
                className={form.formState.errors.age ? "border-destructive" : ""}
              />
              {form.formState.errors.age && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.age.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Current age (3-99 years)
              </p>
            </div>

            <div className="space-y-2">
              <Label className="font-medium text-sm">
                Programs * (Select at least one)
              </Label>
              <div className="border rounded-md p-3 space-y-3 max-h-48 overflow-y-auto">
                {programs.length === 0 ? (
                  <p className="text-sm text-muted-foreground" data-testid="text-no-programs">
                    No programs available - create one first
                  </p>
                ) : (
                  programs.map((program) => (
                    <div 
                      key={program.id} 
                      className="flex items-center space-x-2"
                      data-testid={`checkbox-program-${program.id}`}
                    >
                      <Checkbox
                        id={`program-${program.id}`}
                        checked={selectedPrograms.includes(program.id)}
                        onCheckedChange={() => toggleProgram(program.id)}
                        data-testid={`input-program-${program.id}`}
                      />
                      <label
                        htmlFor={`program-${program.id}`}
                        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {program.name}
                      </label>
                    </div>
                  ))
                )}
              </div>
              {form.formState.errors.programIds && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.programIds.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Participant can be enrolled in multiple programs
              </p>
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0 px-6 py-4 border-t flex-shrink-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              data-testid="button-submit"
              disabled={programs.length === 0}
            >
              {participant ? "Save Changes" : "Add Participant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
