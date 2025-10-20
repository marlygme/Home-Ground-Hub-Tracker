import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { insertParticipantSchema, type InsertParticipant, type Participant, type Program } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ParticipantFormProps {
  participant?: Participant;
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
  const form = useForm<InsertParticipant>({
    resolver: zodResolver(insertParticipantSchema),
    defaultValues: {
      fullName: "",
      parentEmail: "",
      phoneNumber: "",
      age: 8,
      programId: programs.length > 0 ? programs[0].id : "",
    },
  });

  // Reset form when participant changes or dialog opens
  useEffect(() => {
    if (open) {
      form.reset(participant
        ? {
            fullName: participant.fullName,
            parentEmail: participant.parentEmail || "",
            phoneNumber: participant.phoneNumber || "",
            age: participant.age,
            programId: participant.programId,
          }
        : {
            fullName: "",
            parentEmail: "",
            phoneNumber: "",
            age: 8,
            programId: programs.length > 0 ? programs[0].id : "",
          }
      );
    }
  }, [open, participant, programs, form]);

  const handleSubmit = (data: InsertParticipant) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
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

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
            <Label htmlFor="programId" className="font-medium text-sm">
              Program *
            </Label>
            <Select
              value={form.watch("programId")}
              onValueChange={(value) => form.setValue("programId", value)}
            >
              <SelectTrigger data-testid="select-programId">
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                {programs.length === 0 ? (
                  <SelectItem value="" disabled data-testid="option-no-programs">
                    No programs available - create one first
                  </SelectItem>
                ) : (
                  programs.map((program) => (
                    <SelectItem 
                      key={program.id} 
                      value={program.id}
                      data-testid={`option-program-${program.id}`}
                    >
                      {program.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {form.formState.errors.programId && (
              <p className="text-sm text-destructive">
                {form.formState.errors.programId.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Assign participant to a program or event
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
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
