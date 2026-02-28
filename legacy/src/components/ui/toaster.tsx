
import { useLanguage } from "@/lib/i18n/language-context";
import { Toaster as SonnerToaster } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

export function Toaster({ ...props }: ToasterProps) {
  const { locale } = useLanguage();
  
  return (
    <SonnerToaster
      {...props}
      // Apply language-specific configurations
      closeButton={true}
      richColors={true}
      expand={false}
      // Set language if available in Sonner
      toastOptions={{
        style: { 
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
        },
        duration: 4000,
        className: "group",
      }}
    />
  );
}
