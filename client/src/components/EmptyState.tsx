import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";

interface EmptyStateProps {
  onAddParticipant: () => void;
  isFiltered?: boolean;
}

export function EmptyState({ onAddParticipant, isFiltered = false }: EmptyStateProps) {
  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4" data-testid="empty-state-filtered">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Users className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No participants found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4" data-testid="empty-state">
      <div className="rounded-full bg-primary/10 p-6 mb-4">
        <UserPlus className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No participants yet</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Get started by adding your first participant to the soccer program.
      </p>
      <Button onClick={onAddParticipant} size="lg" data-testid="button-add-first-participant">
        <UserPlus className="h-5 w-5 mr-2" />
        Add First Participant
      </Button>
    </div>
  );
}
