import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Video, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from 'date-fns';

export default function CoachSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate, { weekStartsOn: 1 }),
    end: endOfWeek(currentDate, { weekStartsOn: 1 }),
  });

  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const prevWeek = () => setCurrentDate(subDays(currentDate, 7));
  const goToToday = () => setCurrentDate(new Date());

  // Dummy data for demonstration
  const schedule = {
    [format(new Date(), 'yyyy-MM-dd')]: [
      { time: '10:00 AM', client: 'John Doe', type: 'Virtual' },
      { time: '02:00 PM', client: 'Jane Smith', type: 'In-Person' },
    ],
    [format(addDays(new Date(), 2), 'yyyy-MM-dd')]: [
      { time: '11:30 AM', client: 'Peter Jones', type: 'Virtual' },
    ],
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-h1">Schedule</h1>
            <p className="text-body-large text-text-secondary">Manage your coaching sessions and appointments</p>
          </div>
          <Button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            New Session
          </Button>
        </div>

        <Card className="base-card">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <CardTitle className="flex items-center gap-2 text-h3">
              <CalendarIcon className="w-6 h-6 text-[var(--brand-primary)]" />
              Week of {format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMMM d, yyyy')}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" className="btn-secondary" onClick={prevWeek}>
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Previous</span>
              </Button>
              <Button variant="outline" className="btn-secondary" onClick={goToToday}>Today</Button>
              <Button variant="outline" className="btn-secondary" onClick={nextWeek}>
                <span className="hidden sm:inline mr-2">Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-px bg-border-color border border-border-color rounded-lg overflow-hidden">
              {weekDays.map(day => (
                <div key={day.toString()} className={`p-4 bg-[var(--bg-secondary)] ${isToday(day) ? 'bg-opacity-50' : ''}`}>
                  <div className="text-center">
                    <p className={`text-sm ${isToday(day) ? 'text-[var(--brand-primary)]' : 'text-text-muted'}`}>
                      {format(day, 'EEE')}
                    </p>
                    <p className={`text-2xl font-bold ${isToday(day) ? 'text-[var(--brand-primary)]' : 'text-text-primary'}`}>
                      {format(day, 'd')}
                    </p>
                  </div>
                  <div className="mt-4 space-y-3">
                    {schedule[format(day, 'yyyy-MM-dd')]?.map((session, index) => (
                      <div key={index} className="p-3 rounded-lg border border-border-color bg-white shadow-sm">
                        <p className="font-semibold text-sm text-text-primary">{session.client}</p>
                        <p className="text-xs text-text-secondary flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3"/>
                          {session.time}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          {session.type === 'Virtual' ? 
                            <Video className="w-3 h-3 text-blue-500" /> : 
                            <MapPin className="w-3 h-3 text-green-500" />
                          }
                          <span className="text-xs text-text-muted">{session.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}