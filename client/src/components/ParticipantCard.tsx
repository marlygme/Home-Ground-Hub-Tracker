import { Participant, ageGroupColors, ageGroupLabels } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar, Mail, Phone } from "lucide-react";

interface ParticipantCardProps {
  participant: Participant;
  onEdit: (participant: Participant) => void;
  onDelete: (id: string) => void;
  onViewAttendance: (participant: Participant) => void;
}

export function ParticipantCard({
  participant,
  onEdit,
  onDelete,
  onViewAttendance,
}: ParticipantCardProps) {
  const attendedWeeks = participant.attendance.filter(Boolean).length;

  return (
    <Card className="hover-elevate" data-testid={`card-participant-${participant.id}`}>
      <CardHeader className="space-y-0 pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg" data-testid="text-participant-name">
            {participant.fullName}
          </h3>
          <Badge className={`${ageGroupColors[participant.ageGroup]} text-xs font-medium`} data-testid="badge-ageGroup">
            {ageGroupLabels[participant.ageGroup]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4 shrink-0" />
          <span className="truncate" data-testid="text-email">{participant.parentEmail}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4 shrink-0" />
          <span data-testid="text-phone">{participant.phoneNumber}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="font-medium" data-testid="text-attendance-weeks">
            {attendedWeeks}/10 weeks attended
          </span>
          <span className="text-muted-foreground">
            ({Math.round((attendedWeeks / 10) * 100)}%)
          </span>
        </div>
      </CardContent>

      <CardFooter className="gap-2 pt-3 border-t flex-wrap">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onViewAttendance(participant)}
          className="flex-1"
          data-testid="button-view-attendance"
        >
          <Calendar className="h-4 w-4 mr-1.5" />
          Attendance
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onEdit(participant)}
          data-testid="button-edit"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(participant.id)}
          className="text-destructive hover:text-destructive"
          data-testid="button-delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
