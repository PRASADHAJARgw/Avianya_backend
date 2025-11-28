import { cn } from "@/lib/utils";

interface TWLoaderProps {
  className?: string;
}

export default function TWLoader({ className }: TWLoaderProps) {
  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-solid border-current border-e-transparent",
        className
      )}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}