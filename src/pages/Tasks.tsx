
import { useState } from "react";
import { 
  Check, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Filter, 
  Loader2, 
  MoreHorizontal, 
  Plus, 
  Search, 
  X,
  ChevronRight
} from "lucide-react";
import { useBreakpoint } from "@/hooks/use-mobile";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TaskStatusMenu } from "@/components/tasks/TaskStatusMenu";
import { PageHeader } from "@/components/layout/PageHeader";

// Demo data
const taskCategories = ["Housekeeping", "Maintenance", "Front Desk", "Food & Beverage", "Administration"];

const taskStatus = [
  { value: "pending", label: "Pending", icon: <Circle className="h-4 w-4 text-yellow-500" /> },
  { value: "in-progress", label: "In Progress", icon: <Loader2 className="h-4 w-4 text-blue-500" /> },
  { value: "completed", label: "Completed", icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> },
  { value: "cancelled", label: "Cancelled", icon: <X className="h-4 w-4 text-red-500" /> },
];

const priorityLevels = [
  { value: "low", label: "Low", badgeVariant: "outline" },
  { value: "medium", label: "Medium", badgeVariant: "secondary" },
  { value: "high", label: "High", badgeVariant: "warning" },
  { value: "critical", label: "Critical", badgeVariant: "destructive" },
];

const demoTasks = [
  {
    id: "task-1",
    title: "Clean Room 101",
    description: "Full cleaning including bathroom, change linens, vacuum, and dust.",
    assignee: "Maria Rodriguez",
    category: "Housekeeping",
    status: "completed",
    priority: "medium",
    dueDate: "2023-06-10T14:00:00",
    createdAt: "2023-06-09T09:15:00",
    updatedAt: "2023-06-10T13:45:00",
    completedAt: "2023-06-10T13:45:00",
    notes: "Guest checking in at 3pm.",
  },
  {
    id: "task-2",
    title: "Fix leaking faucet in Room 205",
    description: "Bathroom sink faucet is dripping continuously.",
    assignee: "John Smith",
    category: "Maintenance",
    status: "in-progress",
    priority: "high",
    dueDate: "2023-06-11T12:00:00",
    createdAt: "2023-06-10T08:30:00",
    updatedAt: "2023-06-10T10:15:00",
    completedAt: null,
    notes: "Requires new washer and possibly valve replacement.",
  },
  {
    id: "task-3",
    title: "Restock minibar in Room 304",
    description: "Replace consumed items and verify inventory.",
    assignee: "Emily Johnson",
    category: "Housekeeping",
    status: "pending",
    priority: "low",
    dueDate: "2023-06-11T16:00:00",
    createdAt: "2023-06-10T14:00:00",
    updatedAt: "2023-06-10T14:00:00",
    completedAt: null,
    notes: "Guest reported consuming several items.",
  },
  {
    id: "task-4",
    title: "Process refund for cancellation",
    description: "Process full refund for reservation #12345 due to medical emergency.",
    assignee: "Alex Wong",
    category: "Front Desk",
    status: "pending",
    priority: "critical",
    dueDate: "2023-06-10T17:00:00",
    createdAt: "2023-06-10T11:20:00",
    updatedAt: "2023-06-10T11:20:00",
    completedAt: null,
    notes: "Guest provided doctor's note. Refund should include all fees.",
  },
  {
    id: "task-5",
    title: "Replace light bulbs in hallway",
    description: "Three light bulbs on 2nd floor hallway need replacement.",
    assignee: "John Smith",
    category: "Maintenance",
    status: "completed",
    priority: "medium",
    dueDate: "2023-06-10T15:00:00",
    createdAt: "2023-06-09T16:45:00",
    updatedAt: "2023-06-10T09:30:00",
    completedAt: "2023-06-10T09:30:00",
    notes: "Used LED bulbs as per new energy policy.",
  },
  {
    id: "task-6",
    title: "Prepare meeting room for conference",
    description: "Set up A/V equipment, arrange seating for 20 people, provide water and notepads.",
    assignee: "Lisa Chen",
    category: "Administration",
    status: "in-progress",
    priority: "high",
    dueDate: "2023-06-11T08:00:00",
    createdAt: "2023-06-10T13:00:00",
    updatedAt: "2023-06-10T15:30:00",
    completedAt: null,
    notes: "Client requested extra microphones and a podium.",
  },
  {
    id: "task-7",
    title: "Update weekly menu",
    description: "Create and print new dinner menu for the week.",
    assignee: "Daniel Brown",
    category: "Food & Beverage",
    status: "pending",
    priority: "medium",
    dueDate: "2023-06-12T10:00:00",
    createdAt: "2023-06-10T09:00:00",
    updatedAt: "2023-06-10T09:00:00",
    completedAt: null,
    notes: "Chef suggested featuring seasonal vegetables.",
  },
  {
    id: "task-8",
    title: "Check HVAC system in Room 401",
    description: "Guest reported that air conditioning is not cooling properly.",
    assignee: "John Smith",
    category: "Maintenance",
    status: "pending",
    priority: "high",
    dueDate: "2023-06-10T18:00:00",
    createdAt: "2023-06-10T15:15:00",
    updatedAt: "2023-06-10T15:15:00",
    completedAt: null,
    notes: "May need to relocate guest if repair takes too long.",
  },
];

// Helper function to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleString('en-US', options);
};

// Task card component
const TaskCard = ({ task, onStatusChange }: { 
  task: typeof demoTasks[number], 
  onStatusChange: (taskId: string, newStatus: string) => void 
}) => {
  const status = taskStatus.find(s => s.value === task.status);
  const priority = priorityLevels.find(p => p.value === task.priority);
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{task.title}</CardTitle>
            <CardDescription className="text-sm mt-1">
              <Badge variant="outline" className="mr-2">{task.category}</Badge>
              <Badge variant={priority?.badgeVariant as any || "outline"}>
                {priority?.label}
              </Badge>
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Reassign</DropdownMenuItem>
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
        <div className="flex flex-col space-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Assignee:</span>
            <span className="font-medium">{task.assignee}</span>
          </div>
          <div className="flex justify-between">
            <span>Due:</span>
            <span className="font-medium">{formatDate(task.dueDate)}</span>
          </div>
          <div className="flex justify-between">
            <span>Created:</span>
            <span className="font-medium">{formatDate(task.createdAt)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <div className="flex items-center text-xs">
          <span className="mr-1 text-muted-foreground">Status:</span>
          <div className="flex items-center">
            {status?.icon}
            <span className="ml-1">{status?.label}</span>
          </div>
        </div>
        <TaskStatusMenu taskId={task.id} onStatusChange={onStatusChange} />
      </CardFooter>
    </Card>
  );
};

// Task table row component
const TaskTableRow = ({ task, onStatusChange }: {
  task: typeof demoTasks[number],
  onStatusChange: (taskId: string, newStatus: string) => void
}) => {
  const status = taskStatus.find(s => s.value === task.status);
  const priority = priorityLevels.find(p => p.value === task.priority);

  return (
    <tr>
      <td className="py-2 pl-4 pr-3">
        <div className="flex items-center gap-2">
          {status?.icon}
          <span className="font-medium">{task.title}</span>
        </div>
      </td>
      <td className="py-2 px-3 hidden md:table-cell">{task.assignee}</td>
      <td className="py-2 px-3 hidden lg:table-cell">{task.category}</td>
      <td className="py-2 px-3">
        <Badge variant={priority?.badgeVariant as any || "outline"}>
          {priority?.label}
        </Badge>
      </td>
      <td className="py-2 px-3 hidden md:table-cell">{formatDate(task.dueDate)}</td>
      <td className="py-2 pl-3 pr-4 text-right">
        <TaskStatusMenu taskId={task.id} onStatusChange={onStatusChange} />
      </td>
    </tr>
  );
};

export default function Tasks() {
  const [tasks, setTasks] = useState([...demoTasks]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const breakpoint = useBreakpoint();
  const isTabletOrMobile = breakpoint === "mobile" || breakpoint === "tablet";

  console.log("Tasks page rendering, tasks count:", tasks.length);

  // Filter tasks based on search, selected tab, etc.
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Tab filtering
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending") return matchesSearch && task.status === "pending";
    if (activeTab === "in-progress") return matchesSearch && task.status === "in-progress";
    if (activeTab === "completed") return matchesSearch && task.status === "completed";
    
    return matchesSearch;
  });

  const handleStatusChange = (taskId: string, newStatus: string) => {
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: newStatus, 
              updatedAt: new Date().toISOString(),
              completedAt: newStatus === 'completed' ? new Date().toISOString() : task.completedAt
            } 
          : task
      )
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Task Management"
        description="Manage and track staff tasks and assignments"
        showSyncStatus={true}
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Clock className="mr-2 h-4 w-4" />
                  Due Date
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Today</DropdownMenuItem>
                <DropdownMenuItem>Tomorrow</DropdownMenuItem>
                <DropdownMenuItem>This Week</DropdownMenuItem>
                <DropdownMenuItem>Next Week</DropdownMenuItem>
                <DropdownMenuItem>All Time</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task to assign to staff members.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Task Title</Label>
                <Input id="title" placeholder="Enter task title" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter task description" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {taskCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityLevels.map(priority => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input id="assignee" placeholder="Enter staff name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="datetime-local" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Add any additional notes" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowNewTaskDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={() => setShowNewTaskDialog(false)}>
                Create Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full sm:w-auto overflow-x-auto">
          <TabsTrigger value="all" className="flex-1 sm:flex-none">All Tasks</TabsTrigger>
          <TabsTrigger value="pending" className="flex-1 sm:flex-none">Pending</TabsTrigger>
          <TabsTrigger value="in-progress" className="flex-1 sm:flex-none">In Progress</TabsTrigger>
          <TabsTrigger value="completed" className="flex-1 sm:flex-none">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {isTabletOrMobile ? (
            <div className="space-y-4">
              {filteredTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onStatusChange={handleStatusChange} 
                />
              ))}
              {filteredTasks.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No tasks found</p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Task</th>
                    <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Assignee</th>
                    <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Category</th>
                    <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Priority</th>
                    <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Due Date</th>
                    <th scope="col" className="py-3 pl-3 pr-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTasks.map(task => (
                    <TaskTableRow 
                      key={task.id} 
                      task={task} 
                      onStatusChange={handleStatusChange} 
                    />
                  ))}
                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-muted-foreground">
                        No tasks found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending">
          {/* Similar content to "all" but with pending tasks only */}
          {isTabletOrMobile ? (
            <div className="space-y-4">
              {filteredTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onStatusChange={handleStatusChange} 
                />
              ))}
              {filteredTasks.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No pending tasks found</p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              {/* Table structure for desktop view */}
              <table className="min-w-full divide-y divide-border">
                {/* Same table structure as "all" tab */}
                <thead>
                  <tr className="bg-muted/50">
                    <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Task</th>
                    <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Assignee</th>
                    <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Category</th>
                    <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Priority</th>
                    <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Due Date</th>
                    <th scope="col" className="py-3 pl-3 pr-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTasks.map(task => (
                    <TaskTableRow 
                      key={task.id} 
                      task={task} 
                      onStatusChange={handleStatusChange} 
                    />
                  ))}
                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-muted-foreground">
                        No pending tasks found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="in-progress">
          {/* Similar content for in-progress tasks */}
          {/* Use the same pattern as pending tab */}
          {isTabletOrMobile ? (
            <div className="space-y-4">
              {filteredTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onStatusChange={handleStatusChange} 
                />
              ))}
              {filteredTasks.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No in-progress tasks found</p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Task</th>
                    <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Assignee</th>
                    <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Category</th>
                    <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Priority</th>
                    <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Due Date</th>
                    <th scope="col" className="py-3 pl-3 pr-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTasks.map(task => (
                    <TaskTableRow 
                      key={task.id} 
                      task={task} 
                      onStatusChange={handleStatusChange} 
                    />
                  ))}
                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-muted-foreground">
                        No in-progress tasks found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {/* Similar content for completed tasks */}
          {/* Use the same pattern as pending tab */}
          {isTabletOrMobile ? (
            <div className="space-y-4">
              {filteredTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onStatusChange={handleStatusChange} 
                />
              ))}
              {filteredTasks.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No completed tasks found</p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Task</th>
                    <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Assignee</th>
                    <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Category</th>
                    <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Priority</th>
                    <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Due Date</th>
                    <th scope="col" className="py-3 pl-3 pr-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTasks.map(task => (
                    <TaskTableRow 
                      key={task.id} 
                      task={task} 
                      onStatusChange={handleStatusChange} 
                    />
                  ))}
                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-muted-foreground">
                        No completed tasks found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
