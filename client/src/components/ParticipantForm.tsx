import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertParticipantSchema, type InsertParticipant, type Participant, ageGroups, ageGroupLabels } from "@shared/schema";
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InsertParticipant) => void;
}

export function ParticipantForm({
  participant,
  open,
  onOpenChange,
  onSubmit,
}: ParticipantFormProps) {
  const form = useForm<InsertParticipant>({
    resolver: zodResolver(insertParticipantSchema),
    defaultValues: participant
      ? {
          fullName: participant.fullName,
          parentEmail: participant.parentEmail,
          phoneNumber: participant.phoneNumber,
          ageGroup: participant.ageGroup,
        }
      : {
          fullName: "",
          parentEmail: "",
          phoneNumber: "",
          ageGroup: "5-7",
        },
  });

  const handleSubmit = (data: InsertParticipant) => {
    onSubmit(data);
    form.reset();
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
              Parent/Guardian Email *
            </Label>
            <Input
              id="parentEmail"
              type="email"
              data-testid="input-parentEmail"
              placeholder="parent@example.com"
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
              Phone Number *
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              data-testid="input-phoneNumber"
              placeholder="+61 412 345 678 or 0412 345 678"
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
            <Label htmlFor="ageGroup" className="font-medium text-sm">
              Age Group *
            </Label>
            <Select
              value={form.watch("ageGroup")}
              onValueChange={(value) =>
                form.setValue("ageGroup", value as typeof ageGroups[number])
              }
            >
              <SelectTrigger data-testid="select-ageGroup">
                <SelectValue placeholder="Select age group" />
              </SelectTrigger>
              <SelectContent>
                {ageGroups.map((group) => (
                  <SelectItem key={group} value={group} data-testid={`option-ageGroup-${group}`}>
                    {ageGroupLabels[group]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.ageGroup && (
              <p className="text-sm text-destructive">
                {form.formState.errors.ageGroup.message}
              </p>
            )}
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
            <Button type="submit" data-testid="button-submit">
              {participant ? "Save Changes" : "Add Participant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
