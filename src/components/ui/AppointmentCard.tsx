import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Check, X, LogIn, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { DialogTrigger } from '@/components/ui/dialog';
import { CheckInDialog } from '@/components/visitors/CheckInDialog'; // adjust import path if needed

interface AppointmentCardProps {
  appointment: any; // shape from useVisitors hook
  onCheckIn: (appointment: any) => void;
}

export const AppointmentCard = ({ appointment, onCheckIn }: AppointmentCardProps) => {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-col space-y-2 p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm font-medium">
              {format(new Date(appointment.scheduled_for), 'HH:mm')}
            </CardTitle>
          </div>
          <Badge variant="outline" className="capitalize text-xs">
            {appointment.status}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground truncate">
          {appointment.visitor_name} – {appointment.purpose}
        </CardDescription>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
          {appointment.host_name && (
            <span className="flex items-center gap-1"><User className="h-3 w-3" />{appointment.host_name}</span>
          )}
          {appointment.location && (
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{appointment.location}</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-2 flex justify-end">
        <CheckInDialog
          appointment={appointment}
          trigger={<Button size="sm" variant="outline"><LogIn className="h-4 w-4 mr-1" />Check In</Button>}
        />
      </CardContent>
    </Card>
  );
};
