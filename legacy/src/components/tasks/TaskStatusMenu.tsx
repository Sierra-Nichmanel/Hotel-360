
import React from "react";
import { ChevronRight, MoreHorizontal, Loader2, X, CheckCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useButtonAction } from "@/hooks/use-button-action";

// Task status options with icons
const taskStatus = [
  { value: "pending", label: "Pending", icon: <Circle className="h-4 w-4 text-yellow-500" /> },
  { value: "in-progress", label: "In Progress", icon: <Loader2 className="h-4 w-4 text-blue-500" /> },
  { value: "completed", label: "Completed", icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> },
  { value: "cancelled", label: "Cancelled", icon: <X className="h-4 w-4 text-red-500" /> },
];

interface TaskStatusMenuProps {
  taskId: string;
  onStatusChange: (taskId: string, newStatus: string) => void;
  onEditTask?: (taskId: string) => void;
  onReassignTask?: (taskId: string) => void;
  onViewTaskDetails?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
}

// Circle component needed for status icon
function Circle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export const TaskStatusMenu = ({ 
  taskId, 
  onStatusChange,
  onEditTask,
  onReassignTask,
  onViewTaskDetails,
  onDeleteTask
}: TaskStatusMenuProps) => {
  // Use the button action hook for each action
  const editAction = useButtonAction({
    actionName: "Edit Task",
    onAction: onEditTask ? () => onEditTask(taskId) : undefined,
    successMessage: "Task opened for editing"
  });

  const reassignAction = useButtonAction({
    actionName: "Reassign Task",
    onAction: onReassignTask ? () => onReassignTask(taskId) : undefined,
    successMessage: "Ready to reassign task"
  });

  const viewDetailsAction = useButtonAction({
    actionName: "View Task Details",
    onAction: onViewTaskDetails ? () => onViewTaskDetails(taskId) : undefined,
    successMessage: "Viewing task details"
  });

  const deleteAction = useButtonAction({
    actionName: "Delete Task",
    onAction: onDeleteTask ? () => onDeleteTask(taskId) : undefined,
    successMessage: "Task deleted successfully",
    errorMessage: "Failed to delete task",
    confirmationRequired: true,
    confirmationMessage: "Are you sure you want to delete this task? This action cannot be undone."
  });

  const handleStatusChange = (status: string) => {
    const statusAction = useButtonAction({
      actionName: `Update Status to ${status}`,
      onAction: () => onStatusChange(taskId, status),
      successMessage: `Task status updated to ${status}`,
      errorMessage: "Failed to update task status"
    });
    
    statusAction.handleAction();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={editAction.handleAction}
          disabled={editAction.isLoading || !onEditTask}
        >
          {editAction.isLoading ? "Processing..." : "Edit"}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={reassignAction.handleAction}
          disabled={reassignAction.isLoading || !onReassignTask}
        >
          {reassignAction.isLoading ? "Processing..." : "Reassign"}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={viewDetailsAction.handleAction}
          disabled={viewDetailsAction.isLoading || !onViewTaskDetails}
        >
          {viewDetailsAction.isLoading ? "Processing..." : "View details"}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <div className="flex justify-between w-full items-center">
              <span>Status</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {taskStatus.map((status) => (
              <DropdownMenuItem
                key={status.value}
                onClick={() => handleStatusChange(status.value)}
              >
                <div className="flex items-center">
                  {status.icon}
                  <span className="ml-2">{status.label}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive"
          onClick={deleteAction.handleAction}
          disabled={deleteAction.isLoading || !onDeleteTask}
        >
          {deleteAction.isLoading ? "Processing..." : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
