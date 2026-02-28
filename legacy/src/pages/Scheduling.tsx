import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock, Plus, Users } from "lucide-react";
import { format, startOfWeek, endOfWeek, addDays, addWeeks, subWeeks, isSameDay } from "date-fns";
import { useIsTabletOrMobile } from "@/hooks/use-mobile";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Demo data for staff members
const staffMembers = [
  { id: "staff-1", name: "Maria Rodriguez", role: "Housekeeping", color: "bg-blue-500" },
  { id: "staff-2", name: "John Smith", role: "Maintenance", color: "bg-green-500" },
  { id: "staff-3", name: "Emily Johnson", role: "Front Desk", color: "bg-purple-500" },
  { id: "staff-4", name: "Daniel Brown", role: "Food & Beverage", color: "bg-amber-500" },
  { id: "staff-5", name: "Lisa Chen", role: "Administration", color: "bg-red-500" },
  { id: "staff-6", name: "Alex Wong", role: "Front Desk", color: "bg-indigo-500" },
];

// Demo shifts data
const initialShifts = [
  { 
    id: "shift-1", 
    staffId: "staff-1", 
    date: new Date(2025, 3, 17), // April 17, 2025
    startTime: "08:00", 
    endTime: "16:00", 
    notes: "Room cleaning 2nd floor" 
  },
  { 
    id: "shift-2", 
    staffId: "staff-2", 
    date: new Date(2025, 3, 17), 
    startTime: "09:00", 
    endTime: "17:00", 
    notes: "Regular maintenance" 
  },
  { 
    id: "shift-3", 
    staffId: "staff-3", 
    date: new Date(2025, 3, 17), 
    startTime: "16:00", 
    endTime: "00:00", 
    notes: "Evening shift" 
  },
  { 
    id: "shift-4", 
    staffId: "staff-4", 
    date: new Date(2025, 3, 18), 
    startTime: "10:00", 
    endTime: "18:00", 
    notes: "Dinner preparation" 
  },
  { 
    id: "shift-5", 
    staffId: "staff-5", 
    date: new Date(2025, 3, 19), 
    startTime: "09:00", 
    endTime: "17:00", 
    notes: "Administrative duties" 
  },
  { 
    id: "shift-6", 
    staffId: "staff-6", 
    date: new Date(2025, 3, 19), 
    startTime: "00:00", 
    endTime: "08:00", 
    notes: "Night shift" 
  },
];

// Shift card component for mobile view
const ShiftCard = ({ shift, staff }: { 
  shift: typeof initialShifts[number],
  staff: typeof staffMembers[number]
}) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full", staff.color)} />
            <CardTitle className="text-lg">{staff.name}</CardTitle>
          </div>
          <Badge>{staff.role}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date:</span>
            <span>{format(shift.date, "EEEE, MMM d, yyyy")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Time:</span>
            <span>{shift.startTime} - {shift.endTime}</span>
          </div>
          {shift.notes && (
            <div className="text-sm">
              <span className="text-muted-foreground">Notes:</span>
              <p className="mt-1">{shift.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function Scheduling() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [shifts, setShifts] = useState(initialShifts);
  const [showAddShiftDialog, setShowAddShiftDialog] = useState(false);
  const [newShift, setNewShift] = useState({
    staffId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "17:00",
    notes: ""
  });
  const [view, setView] = useState<"week" | "day" | "staff">("week");
  const isMobile = useIsTabletOrMobile();
  
  console.log("Scheduling page rendering, shifts count:", shifts.length);
  
  // Calculate start and end of current week for the weekly view
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 1 });
  
  // Generate week days for the header
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));
  
  // Handle date navigation
  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const today = () => setCurrentDate(new Date());
  
  // Filter shifts for the current week view
  const currentWeekShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.date);
    return shiftDate >= startOfCurrentWeek && shiftDate <= endOfCurrentWeek;
  });
  
  // Filter shifts for the current day view
  const currentDayShifts = shifts.filter(shift => 
    isSameDay(new Date(shift.date), currentDate)
  );
  
  // Handle creating a new shift
  const handleAddShift = () => {
    const newShiftObj = {
      id: `shift-${shifts.length + 1}`,
      staffId: newShift.staffId,
      date: new Date(newShift.date),
      startTime: newShift.startTime,
      endTime: newShift.endTime,
      notes: newShift.notes
    };
    
    setShifts([...shifts, newShiftObj]);
    setShowAddShiftDialog(false);
    // Reset form
    setNewShift({
      staffId: "",
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "09:00",
      endTime: "17:00",
      notes: ""
    });
  };
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Staff Scheduling"
        description="Manage work schedules and staff shifts"
        showSyncStatus={true}
      />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={today}>Today</Button>
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            {format(startOfCurrentWeek, "MMM d")} - {format(endOfCurrentWeek, "MMM d, yyyy")}
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Dialog open={showAddShiftDialog} onOpenChange={setShowAddShiftDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Shift
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Shift</DialogTitle>
                <DialogDescription>
                  Create a new shift assignment for staff members.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="staff">Staff Member</Label>
                  <Select 
                    onValueChange={(value) => setNewShift({...newShift, staffId: value})}
                    value={newShift.staffId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffMembers.map(staff => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name} ({staff.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={newShift.date}
                    onChange={(e) => setNewShift({...newShift, date: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input 
                      id="startTime" 
                      type="time" 
                      value={newShift.startTime}
                      onChange={(e) => setNewShift({...newShift, startTime: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input 
                      id="endTime" 
                      type="time" 
                      value={newShift.endTime}
                      onChange={(e) => setNewShift({...newShift, endTime: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input 
                    id="notes" 
                    placeholder="Add shift notes" 
                    value={newShift.notes}
                    onChange={(e) => setNewShift({...newShift, notes: e.target.value})}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddShiftDialog(false)}>Cancel</Button>
                <Button onClick={handleAddShift}>Add Shift</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs value={view} onValueChange={(v) => setView(v as "week" | "day" | "staff")} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>
        
        <TabsContent value="week" className="mt-6">
          {isMobile ? (
            <div className="space-y-6">
              {weekDays.map((day) => {
                const dayShifts = shifts.filter(shift => isSameDay(new Date(shift.date), day));
                if (dayShifts.length === 0) return null;
                
                return (
                  <div key={format(day, 'yyyy-MM-dd')} className="space-y-3">
                    <h3 className="font-medium">{format(day, 'EEEE, MMMM d')}</h3>
                    {dayShifts.map(shift => {
                      const staff = staffMembers.find(s => s.id === shift.staffId);
                      if (!staff) return null;
                      return <ShiftCard key={shift.id} shift={shift} staff={staff} />;
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <div className="grid grid-cols-8 divide-x divide-border">
                <div className="p-3 bg-muted/50 text-xs font-medium text-muted-foreground uppercase">Staff</div>
                {weekDays.map((day) => (
                  <div 
                    key={format(day, 'yyyy-MM-dd')}
                    className={cn(
                      "p-3 text-center bg-muted/50 text-xs font-medium text-muted-foreground uppercase",
                      isSameDay(day, new Date()) && "bg-primary/5"
                    )}
                  >
                    {format(day, 'EEE')}<br />
                    {format(day, 'MMM d')}
                  </div>
                ))}
              </div>
              
              <div className="divide-y divide-border">
                {staffMembers.map((staff) => (
                  <div key={staff.id} className="grid grid-cols-8 divide-x divide-border">
                    <div className="p-3 flex items-center">
                      <div className={cn("w-2 h-2 rounded-full mr-2", staff.color)} />
                      <div>
                        <div className="font-medium">{staff.name}</div>
                        <div className="text-xs text-muted-foreground">{staff.role}</div>
                      </div>
                    </div>
                    
                    {weekDays.map((day) => {
                      const dayShifts = shifts.filter(shift => 
                        shift.staffId === staff.id && isSameDay(new Date(shift.date), day)
                      );
                      
                      return (
                        <div 
                          key={format(day, 'yyyy-MM-dd')}
                          className={cn(
                            "p-2 min-h-[100px]",
                            isSameDay(day, new Date()) && "bg-primary/5"
                          )}
                        >
                          {dayShifts.map(shift => (
                            <div 
                              key={shift.id} 
                              className={cn(
                                "p-2 text-xs rounded mb-1",
                                staff.color.replace("bg-", "bg-opacity-20 "),
                                staff.color.replace("bg-", "border-l-2 border-")
                              )}
                            >
                              <div className="font-medium">{shift.startTime} - {shift.endTime}</div>
                              {shift.notes && <div className="truncate">{shift.notes}</div>}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="day" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {format(currentDate, 'EEEE, MMMM d, yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentDayShifts.length > 0 ? (
                <div className="space-y-4">
                  {isMobile ? (
                    currentDayShifts.map(shift => {
                      const staff = staffMembers.find(s => s.id === shift.staffId);
                      if (!staff) return null;
                      return <ShiftCard key={shift.id} shift={shift} staff={staff} />;
                    })
                  ) : (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Staff</th>
                          <th className="text-left p-2">Role</th>
                          <th className="text-left p-2">Time</th>
                          <th className="text-left p-2">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentDayShifts.map(shift => {
                          const staff = staffMembers.find(s => s.id === shift.staffId);
                          if (!staff) return null;
                          
                          return (
                            <tr key={shift.id} className="border-b">
                              <td className="p-2">
                                <div className="flex items-center">
                                  <div className={cn("w-2 h-2 rounded-full mr-2", staff.color)} />
                                  {staff.name}
                                </div>
                              </td>
                              <td className="p-2">{staff.role}</td>
                              <td className="p-2">{shift.startTime} - {shift.endTime}</td>
                              <td className="p-2">{shift.notes}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No shifts scheduled for this day
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="staff" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffMembers.map(staff => {
              const staffShifts = shifts.filter(shift => 
                shift.staffId === staff.id &&
                new Date(shift.date) >= startOfCurrentWeek && 
                new Date(shift.date) <= endOfCurrentWeek
              );
              
              return (
                <Card key={staff.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", staff.color)} />
                        <CardTitle>{staff.name}</CardTitle>
                      </div>
                      <Badge>{staff.role}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {staffShifts.length > 0 ? (
                      <div className="space-y-2">
                        {staffShifts.map(shift => (
                          <div key={shift.id} className="flex justify-between text-sm border-b pb-2">
                            <div>
                              <div>{format(new Date(shift.date), 'EEE, MMM d')}</div>
                              <div className="text-muted-foreground">{shift.notes}</div>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span>{shift.startTime} - {shift.endTime}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No shifts this week
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
