import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UserProgress } from '@/lib/completion';
import { Trophy, Clock, Flame, Target } from 'lucide-react';

interface ProgressStatsProps {
  progress: UserProgress;
}

export const ProgressStats: React.FC<ProgressStatsProps> = ({ progress }) => {
  const weeklyGoal = 5; // sessions per week
  const weeklyProgress = Math.min((progress.currentStreak / weeklyGoal) * 100, 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="card-gradient border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {progress.totalCompletedSessions}
          </div>
          <p className="text-xs text-muted-foreground">
            Sessions completed
          </p>
        </CardContent>
      </Card>

      <Card className="card-gradient border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Minutes</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {progress.totalMinutesPracticed}
          </div>
          <p className="text-xs text-muted-foreground">
            Minutes practiced
          </p>
        </CardContent>
      </Card>

      <Card className="card-gradient border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Flame className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {progress.currentStreak}
          </div>
          <p className="text-xs text-muted-foreground">
            Consecutive days
          </p>
        </CardContent>
      </Card>

      <Card className="card-gradient border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground mb-2">
            {Math.min(progress.currentStreak, weeklyGoal)}/{weeklyGoal}
          </div>
          <Progress value={weeklyProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {weeklyProgress >= 100 ? 'Goal achieved!' : 'Keep going!'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};