import { cn } from "~/app/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-lightGray animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
