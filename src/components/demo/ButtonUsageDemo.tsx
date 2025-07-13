
import { ActionButton } from "@/components/common/ActionButton";

export default function ButtonUsageDemo() {
  // Simple action example
  const handleSimpleAction = () => {
    console.log("Simple action executed");
    // Your action logic here
  };

  // Async action example
  const handleAsyncAction = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Async action completed");
    // Your async logic here
  };

  // Destructive action example
  const handleDeleteAction = async () => {
    // Simulate deletion
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Delete action completed");
    // Your deletion logic here
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Button Action Examples</h2>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Simple Button Action</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Basic button with simple functionality
        </p>
        <ActionButton 
          actionName="Simple Action"
          onAction={handleSimpleAction}
          successMessage="Simple action completed"
        >
          Simple Action
        </ActionButton>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Async Button Action</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Button with loading state during async operations
        </p>
        <ActionButton 
          actionName="Async Action"
          onAction={handleAsyncAction}
          successMessage="Async operation completed successfully"
          errorMessage="Failed to complete the async operation"
        >
          Async Action with Loading
        </ActionButton>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Destructive Action</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Button with confirmation dialog for dangerous actions
        </p>
        <ActionButton 
          actionName="Delete Item"
          onAction={handleDeleteAction}
          successMessage="Item deleted successfully"
          errorMessage="Failed to delete item"
          confirmationRequired={true}
          confirmationMessage="Are you sure you want to delete this item? This action cannot be undone."
          variant="destructive"
        >
          Delete Item
        </ActionButton>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Not Implemented Action</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Button without implementation showing info toast
        </p>
        <ActionButton 
          actionName="Future Feature"
          variant="outline"
        >
          Future Feature
        </ActionButton>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Different Button Variants</h3>
        <div className="flex flex-wrap gap-2">
          <ActionButton 
            actionName="Default Button"
            onAction={() => console.log("Default clicked")}
            variant="default"
          >
            Default
          </ActionButton>
          
          <ActionButton 
            actionName="Secondary Button"
            onAction={() => console.log("Secondary clicked")}
            variant="secondary"
          >
            Secondary
          </ActionButton>
          
          <ActionButton 
            actionName="Outline Button"
            onAction={() => console.log("Outline clicked")}
            variant="outline"
          >
            Outline
          </ActionButton>
          
          <ActionButton 
            actionName="Ghost Button"
            onAction={() => console.log("Ghost clicked")}
            variant="ghost"
          >
            Ghost
          </ActionButton>
          
          <ActionButton 
            actionName="Link Button"
            onAction={() => console.log("Link clicked")}
            variant="link"
          >
            Link
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
