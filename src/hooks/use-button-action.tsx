
import { useState } from "react";
import { toast } from "sonner";

interface ButtonActionProps {
  actionName: string;
  onAction?: () => Promise<any> | void;
  successMessage?: string;
  errorMessage?: string;
  confirmationRequired?: boolean;
  confirmationMessage?: string;
}

export function useButtonAction({
  actionName,
  onAction,
  successMessage = "Action completed successfully",
  errorMessage = "An error occurred",
  confirmationRequired = false,
  confirmationMessage = "Are you sure you want to proceed?",
}: ButtonActionProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    if (confirmationRequired) {
      const confirmed = window.confirm(confirmationMessage);
      if (!confirmed) return;
    }

    if (!onAction) {
      toast.info(`${actionName} functionality not yet implemented`);
      return;
    }

    try {
      setIsLoading(true);
      await onAction();
      toast.success(successMessage);
    } catch (error) {
      console.error(`Error in ${actionName}:`, error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleAction,
  };
}
