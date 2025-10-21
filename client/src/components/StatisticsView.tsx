import { ParticipantWithPrograms, Program } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Calendar, Award } from "lucide-react";

interface StatisticsViewProps {
  participants: ParticipantWithPrograms[];
  programs: Program[];
}

export function StatisticsView({ participants, programs }: StatisticsViewProps) {
  const totalParticipants = participants.length;
  
  // Calculate total attendance across all programs
  const totalAttendance = participants.reduce((sum, p) => {
    return sum + p.programs.reduce((pSum, prog) => 
      pSum + prog.attendance.filter(Boolean).length, 0
    );
  }, 0);
  
  const maxPossibleAttendance = participants.reduce((sum, p) => {
    return sum + p.programs.reduce((pSum, prog) => 
      pSum + prog.attendance.length, 0
    );
  }, 0);

  const overallAttendanceRate = maxPossibleAttendance > 0
    ? Math.round((totalAttendance / maxPossibleAttendance) * 100)
    : 0;

  const maxWeeks = programs.length > 0 
    ? Math.max(...programs.map(p => p.attendanceWeeks))
    : 10;

  const weeklyStats = Array.from({ length: maxWeeks }, (_, weekIndex) => {
    let totalEligible = 0;
    let totalPresent = 0;
    
    participants.forEach(p => {
      p.programs.forEach(prog => {
        if (weekIndex < prog.attendance.length) {
          totalEligible++;
          if (prog.attendance[weekIndex]) {
            totalPresent++;
          }
        }
      });
    });
    
    const rate = totalEligible > 0 ? Math.round((totalPresent / totalEligible) * 100) : 0;
    return { week: weekIndex + 1, present: totalPresent, total: totalEligible, rate };
  });

  const bestWeek = weeklyStats.reduce((best, week) =>
    week.rate > best.rate ? week : best
  , weeklyStats[0] || { week: 1, present: 0, total: 0, rate: 0 });

  const programStats = programs.map((program) => {
    let totalProgramAttendance = 0;
    let totalEnrollments = 0;
    
    participants.forEach(p => {
      const programData = p.programs.find(prog => prog.id === program.id);
      if (programData) {
        totalEnrollments++;
        totalProgramAttendance += programData.attendance.filter(Boolean).length;
      }
    });
    
    const maxProgramAttendance = totalEnrollments * program.attendanceWeeks;
    const avgAttendance = maxProgramAttendance > 0
      ? Math.round((totalProgramAttendance / maxProgramAttendance) * 100)
      : 0;
    
    return {
      programId: program.id,
      programName: program.name,
      count: totalEnrollments,
      avgAttendance,
    };
  }).filter(stat => stat.count > 0);

  const perfectAttendance = participants.filter((p) => {
    return p.programs.some(prog => {
      return prog.attendance.filter(Boolean).length === prog.attendance.length &&
             prog.attendance.length > 0;
    });
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
              Week {bestWeek.week}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {bestWeek.rate}% attendance
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
              participants
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Program Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {programStats.map((stat) => (
            <div key={stat.programId} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{stat.programName}</span>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span>{stat.count} participants</span>
                  <span className="font-semibold text-foreground">{stat.avgAttendance}%</span>
                </div>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${stat.avgAttendance}%` }}
                  data-testid={`program-bar-${stat.programId}`}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Attendance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyStats.map((stat) => (
              <div key={stat.week} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Week {stat.week}</span>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span>{stat.present} / {stat.total}</span>
                    <span className="font-semibold text-foreground">{stat.rate}%</span>
                  </div>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${stat.rate}%` }}
                    data-testid={`week-bar-${stat.week}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {perfectAttendance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Perfect Attendance Recognition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {perfectAttendance.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-secondary rounded-lg"
                  data-testid={`perfect-${p.id}`}
                >
                  <p className="font-medium">{p.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {p.programs.map(prog => prog.name).join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
