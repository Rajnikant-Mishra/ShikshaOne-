import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  MapPin,
  Trash,
  Edit
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { format, addMonths, subMonths, isSameDay, parseISO } from 'date-fns';
import { useToast } from '../components/ui/use-toast';

const initialEvents = [
  {
    id: '1',
    title: 'Parent-Teacher Meeting',
    date: '2025-05-25',
    startTime: '15:00',
    endTime: '18:00',
    location: 'School Auditorium',
    description: 'Quarterly parent-teacher meeting to discuss student progress.',
    type: 'meeting',
  },
  {
    id: '2',
    title: 'Science Exhibition',
    date: '2025-05-20',
    startTime: '10:00',
    endTime: '14:00',
    location: 'School Gymnasium',
    description: 'Annual science exhibition showcasing student projects.',
    type: 'event',
  },
  {
    id: '3',
    title: 'Final Exams - Mathematics',
    date: '2025-06-10',
    startTime: '09:00',
    endTime: '11:00',
    location: 'Examination Hall',
    description: 'Final examination for Mathematics.',
    type: 'exam',
  },
  {
    id: '4',
    title: 'Sports Day',
    date: '2025-06-15',
    startTime: '08:00',
    endTime: '16:00',
    location: 'School Playground',
    description: 'Annual sports day with various athletic competitions.',
    type: 'event',
  },
  {
    id: '5',
    title: 'Teacher Training Workshop',
    date: '2025-05-28',
    startTime: '09:00',
    endTime: '15:00',
    location: 'Conference Room',
    description: 'Professional development workshop for teachers.',
    type: 'meeting',
  },
  {
    id: '6',
    title: 'School Holiday - Memorial Day',
    date: '2025-05-27',
    startTime: '00:00',
    endTime: '23:59',
    location: 'N/A',
    description: 'School closed for Memorial Day.',
    type: 'holiday',
  },
];

const eventTypes = [
  { value: 'event', label: 'Event' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'exam', label: 'Exam' },
  { value: 'holiday', label: 'Holiday' },
];

const CalendarPage = () => {
  const [events, setEvents] = useState(initialEvents);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    description: '',
    type: 'event',
  });
  
  const { toast } = useToast();

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    const id = (events.length + 1).toString();
    const eventWithId = { ...newEvent, id };
    
    setEvents([...events, eventWithId]);
    setNewEvent({
      title: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      endTime: '10:00',
      location: '',
      description: '',
      type: 'event',
    });
    
    setIsAddEventDialogOpen(false);
    
    toast({
      title: 'Event added',
      description: `${newEvent.title} has been added to the calendar.`,
    });
  };

  const handleDeleteEvent = () => {
    if (!eventToDelete) return;
    
    setEvents(events.filter(event => event.id !== eventToDelete.id));
    setIsDeleteDialogOpen(false);
    setEventToDelete(null);
    
    toast({
      title: 'Event removed',
      description: 'The event has been removed from the calendar.',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setNewEvent({ ...newEvent, [name]: value });
  };

  const getEventsForDate = (date) => {
    return events.filter(event => isSameDay(parseISO(event.date), date));
  };

  const getEventsForSelectedDate = () => {
    return getEventsForDate(selectedDate);
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'event':
        return 'bg-blue-500';
      case 'meeting':
        return 'bg-purple-500';
      case 'exam':
        return 'bg-red-500';
      case 'holiday':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
          <p className="text-muted-foreground">
            Manage school events and schedules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Enter the details of the new event below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    placeholder="Parent-Teacher Meeting"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={newEvent.date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Event Type</Label>
                    <Select
                      value={newEvent.type}
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      value={newEvent.startTime}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="time"
                      value={newEvent.endTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={newEvent.location}
                    onChange={handleInputChange}
                    placeholder="School Auditorium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={newEvent.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the event"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddEventDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEvent}>Add Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {format(currentMonth, 'MMMM yyyy')}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              className="rounded-md border"
              components={{
                DayContent: ({ date, displayMonth }) => {
                  const dayEvents = getEventsForDate(date);
                  const isCurrentMonth = date.getMonth() === displayMonth.getMonth();
                  return (
                    <div className="relative h-full w-full p-1">
                      <div className={`absolute top-1 right-1 ${isCurrentMonth ? '' : 'text-muted-foreground'}`}>
                        {format(date, 'd')}
                      </div>
                      <div className="mt-6 flex flex-wrap gap-0.5 justify-center">
                        {dayEvents.slice(0, 3).map((event, i) => (
                          <div
                            key={i}
                            className={`h-1.5 w-1.5 rounded-full ${getEventTypeColor(event.type)}`}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{dayEvents.length - 3}</span>
                        )}
                      </div>
                    </div>
                  );
                },
              }}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {format(selectedDate, 'MMMM d, yyyy')}
              </CardTitle>
              <CardDescription>
                Events scheduled for this day
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getEventsForSelectedDate().length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <CalendarIcon className="h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No events</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    There are no events scheduled for this day.
                  </p>
                  <Button className="mt-4" onClick={() => setIsAddEventDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {getEventsForSelectedDate().map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-lg border p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${getEventTypeColor(event.type)}`} />
                            <h3 className="font-semibold">{event.title}</h3>
                          </div>
                          <div className="mt-2 space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {event.startTime} - {event.endTime}
                              </span>
                            </div>
                            {event.location && event.location !== 'N/A' && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                          {event.description && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              {event.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setEventToDelete(event);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events
                  .filter(event => parseISO(event.date) >= new Date() && !isSameDay(parseISO(event.date), selectedDate) )
                  .sort((a, b) => parseISO(a.date) - parseISO(b.date))
                  .slice(0, 3)
                  .map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${getEventTypeColor(event.type)}`} />
                        <div>
                          <h4 className="text-sm font-medium">{event.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {format(parseISO(event.date), 'MMM d, yyyy')} - {event.startTime}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                {events
                  .filter(event => parseISO(event.date) >= new Date() && !isSameDay(parseISO(event.date), selectedDate) )
                  .length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No other upcoming events.</p>
                  )
                }
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {eventToDelete && (
              <div>
                <p className="font-medium">{eventToDelete.title}</p>
                <p className="text-sm text-muted-foreground">
                  {format(parseISO(eventToDelete.date), 'MMMM d, yyyy')} at {eventToDelete.startTime}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;