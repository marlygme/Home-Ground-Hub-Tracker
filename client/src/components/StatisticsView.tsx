import { Participant, Program } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Calendar, Award } from "lucide-react";

interface StatisticsViewProps {
  participants: Participant[];
  programs: Program[];
}

export function StatisticsView({ participants, programs }: StatisticsViewProps) {
  const totalParticipants = participants.length;
  
  const getProgramMaxWeeks = (programId: string): number => {
    const program = programs.find(p => p.id === programId);
    return program?.attendanceWeeks || 10;
  };

  const totalAttendance = participants.reduce(
    (sum, p) => sum + p.attendance.filter(Boolean).length,
    0
  );
  
  const maxPossibleAttendance = participants.reduce(
    (sum, p) => sum + getProgramMaxWeeks(p.programId),
    0
  );

  const overallAttendanceRate = maxPossibleAttendance > 0
    ? Math.round((totalAttendance / maxPossibleAttendance) * 100)
    : 0;

  const maxWeeks = programs.length > 0 
    ? Math.max(...programs.map(p => p.attendanceWeeks))
    : 10;

  const weeklyStats = Array.from({ length: maxWeeks }, (_, weekIndex) => {
    const eligibleParticipants = participants.filter(p => {
      const programWeeks = getProgramMaxWeeks(p.programId);
      return weekIndex < programWeeks;
    });
    const present = eligibleParticipants.filter((p) => p.attendance[weekIndex]).length;
    const rate = eligibleParticipants.length > 0 
      ? Math.round((present / eligibleParticipants.length) * 100) 
      : 0;
    return { week: weekIndex + 1, present, total: eligibleParticipants.length, rate };
  });

  const bestWeek = weeklyStats.reduce((best, week) =>
    week.rate > best.rate ? week : best
  , weeklyStats[0]);

  const programStats = programs.map((program) => {
    const programParticipants = participants.filter(p => p.programId === program.id);
    const totalProgramAttendance = programParticipants.reduce(
      (sum, p) => sum + p.attendance.filter(Boolean).length,
      0
    );
    const maxProgramAttendance = programParticipants.length * program.attendanceWeeks;
    const avgAttendance = maxProgramAttendance > 0
      ? Math.round((totalProgramAttendance / maxProgramAttendance) * 100)
      : 0;
    
    return {
      programId: program.id,
      programName: program.name,
      count: programParticipants.length,
      avgAttendance,
    };
  }).filter(stat => stat.count > 0);

  const perfectAttendance = participants.filter((p) => {
    const programWeeks = getProgramMaxWeeks(p.programId);
    return p.attendance.filter(Boolean).length === programWeeks;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total-participants">
              {totalParticipants}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary" data-testid="stat-overall-attendance">
              {overallAttendanceRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalAttendance} / {maxPossibleAttendance} sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-best-week">
              Week {bestWeek?.week || "-"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {bestWeek?.rate || 0}% attendance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perfect Attendance</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary" data-testid="stat-perfect-attendance">
              {perfectAttendance.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All weeks completed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyStats.map((week) => (
                <div key={week.week} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Week {week.week}</span>
                    <span className="text-muted-foreground">
                      {week.present}/{week.total} ({week.rate}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${week.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Program Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {programStats.length > 0 ? (
                programStats.map((stat) => (
                  <div key={stat.programId} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{stat.programName}</p>
                      <p className="text-sm text-muted-foreground">
                        {stat.count} participant{stat.count !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{stat.avgAttendance}%</p>
                      <p className="text-xs text-muted-foreground">avg attendance</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No program data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {perfectAttendance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Perfect Attendance Recognition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {perfectAttendance.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg border border-primary/20"
                >
                  <Award className="h-4 w-4 text-primary" />
                  <span className="font-medium">{p.fullName}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
