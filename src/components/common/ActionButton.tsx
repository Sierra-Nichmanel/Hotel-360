
import { Button } from "@/components/ui/button";
import { useButtonAction } from "@/hooks/use-button-action";
import { Loader2 } from "lucide-react";

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  actionName: string;
  onAction?: () => Promise<any> | void;
  successMessage?: string;
  errorMessage?: string;
  confirmationRequired?: boolean;
  confirmationMessage?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ActionButton({
  children,
  actionName,
  onAction,
  successMessage,
  errorMessage,
  confirmationRequired,
  confirmationMessage,
  variant = "default",
  size = "default",
  ...props
}: ActionButtonProps) {
  const { isLoading, handleAction } = useButtonAction({
    actionName,
    onAction,
    successMessage,
    errorMessage,
    confirmationRequired,
    confirmationMessage,
  });

  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        handleAction();
      }}
      disabled={isLoading || props.disabled}
      variant={variant}
      size={size}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
