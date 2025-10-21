import { ParticipantWithPrograms } from "@shared/schema";
import { formatAustralianPhone } from "@/lib/phoneUtils";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar, Mail, Phone } from "lucide-react";

interface ParticipantCardProps {
  participant: ParticipantWithPrograms;
  onEdit: (participant: ParticipantWithPrograms) => void;
  onDelete: (id: string) => void;
  onViewAttendance: (participant: ParticipantWithPrograms) => void;
}

export function ParticipantCard({
  participant,
  onEdit,
  onDelete,
  onViewAttendance,
}: ParticipantCardProps) {
  const hasMultiplePrograms = participant.programs.length > 1;

  return (
    <Card className="hover-elevate" data-testid={`card-participant-${participant.id}`}>
      <CardHeader className="space-y-0 pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg" data-testid="text-participant-name">
            {participant.fullName}
          </h3>
          <Badge variant="secondary" className="text-xs font-medium" data-testid="badge-age">
            {participant.age} yrs
          </Badge>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {participant.programs.map((program) => (
            <Badge 
              key={program.id} 
              variant="outline" 
              className="text-xs" 
              data-testid={`badge-program-${program.id}`}
            >
              {program.name}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pb-4">
        {participant.parentEmail && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4 shrink-0" />
            <span className="truncate" data-testid="text-email">{participant.parentEmail}</span>
          </div>
        )}
        {participant.phoneNumber && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0" />
            <span data-testid="text-phone">{formatAustralianPhone(participant.phoneNumber)}</span>
          </div>
        )}
        {hasMultiplePrograms ? (
          <div className="space-y-1">
            {participant.programs.map((program) => {
              const attended = program.attendance.filter(Boolean).length;
              const total = program.attendance.length;
              const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
              return (
                <div key={program.id} className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="font-medium text-xs" data-testid={`text-attendance-${program.id}`}>
                    {program.name.substring(0, 20)}{program.name.length > 20 ? '...' : ''}:
                  </span>
                  <span className="font-medium" data-testid={`text-attendance-weeks-${program.id}`}>
                    {attended}/{total} weeks
                  </span>
                  <span className="text-muted-foreground">
                    ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="font-medium" data-testid="text-attendance-weeks">
              {participant.programs[0]?.attendance.filter(Boolean).length || 0}/{participant.programs[0]?.attendance.length || 0} weeks attended
            </span>
            <span className="text-muted-foreground">
              ({participant.programs[0]?.attendance.length > 0 ? Math.round((participant.programs[0]?.attendance.filter(Boolean).length / participant.programs[0]?.attendance.length) * 100) : 0}%)
            </span>
          </div>
        )}
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
