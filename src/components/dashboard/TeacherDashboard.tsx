
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  ClipboardCheck, 
  PenLine, 
  Bell,
  Calendar,
  ChevronRight
} from "lucide-react";
import { useClasses } from "@/hooks/useClasses";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { data: classes = [] } = useClasses();

  // In a real app, we'd filter by the teacher's assigned classes
  // For now, we'll show classes they are assigned to
  const myClasses = classes.slice(0, 2); 

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Welcome Back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Teacher'}!</h2>
        <p className="text-blue-100 opacity-90 text-sm max-w-md">
          Ready for today's lessons? You have {myClasses.length} classes scheduled for today.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Quick Teacher Actions */}
        <div className="md:col-span-2 space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              My Classes
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {myClasses.length > 0 ? (
                myClasses.map((cls) => (
                  <Card key={cls.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                          {cls.level || 'P.1'}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">Term 3</span>
                      </div>
                      <CardTitle className="text-xl mt-2">{cls.name}</CardTitle>
                      <CardDescription>Primary Section</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                      <div className="flex items-center justify-between text-sm py-2 border-y border-dashed">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>42 Learners</span>
                        </div>
                        <Badge variant="outline" className="text-success border-success/30 bg-success/5">
                          Active
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => navigate('/attendance')}>
                          <ClipboardCheck className="h-3 w-3 mr-1" /> Attendance
                        </Button>
                        <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => navigate('/marks')}>
                          <PenLine className="h-3 w-3 mr-1" /> Enter Marks
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-2 p-8 text-center border-dashed">
                  <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No classes assigned to you yet.</p>
                </Card>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-500" />
              Today's Schedule
            </h3>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {[
                    { time: '08:30 AM', subject: 'Mathematics', class: 'P.4 Blue' },
                    { time: '10:00 AM', subject: 'English', class: 'P.4 Red' },
                    { time: '11:30 AM', subject: 'Science', class: 'P.5 Green' },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center p-4 hover:bg-muted/50 transition-colors">
                      <div className="w-24 text-sm font-medium text-blue-600">{session.time}</div>
                      <div className="flex-1">
                        <p className="font-semibold">{session.subject}</p>
                        <p className="text-xs text-muted-foreground">{session.class}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px]">Upcoming</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Sidebar widgets for teacher */}
        <div className="space-y-6">
          <Card className="bg-indigo-50/50 border-indigo-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bell className="h-4 w-4 text-indigo-600" />
                Staff Notices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-white rounded-lg border text-xs">
                <p className="font-semibold text-indigo-900 mb-1">Assembly Meeting</p>
                <p className="text-muted-foreground mb-2">Morning briefing at 7:45 AM in the main hall.</p>
                <span className="text-[10px] text-indigo-500 font-medium">10 mins ago</span>
              </div>
              <div className="p-3 bg-white rounded-lg border text-xs">
                <p className="font-semibold text-indigo-900 mb-1">Exam Schedules</p>
                <p className="text-muted-foreground mb-2">Final Term 3 marks entry deadline is Friday.</p>
                <span className="text-[10px] text-indigo-500 font-medium">Yesterday</span>
              </div>
              <Button variant="link" className="text-xs p-0 h-auto text-indigo-600">
                View all notifications <ChevronRight className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Attendance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>P.4 Blue</span>
                  <span className="font-bold">98%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '98%' }} />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-xs">
                  <span>P.4 Red</span>
                  <span className="font-bold">92%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '92%' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
