import { Skeleton } from "@/components/ui/shadcn/skeleton";

export default function LoadingSkelaton({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div className="m-auto mt-[10vh] grid w-[50vw] gap-3 p-5">
      <Skeleton className="from-boa-sky/30 to-boa-blue/10 h-6 w-[90vw] bg-gradient-to-br sm:w-[50vw]">
        <p className="text-center">{message}</p>
      </Skeleton>

      <div className="flex flex-col space-y-3">
        <Skeleton className="from-boa-sky/30 to-boa-blue/10 h-[50vh] rounded-xl bg-gradient-to-br sm:w-[50vw]" />
        <div className="space-y-2">
          <Skeleton className="from-boa-sky/30 to-boa-blue/10 ml-auto h-6 w-[50vw] bg-gradient-to-br sm:w-[20vw]" />
          <Skeleton className="bg-boa-sky/10 h-6 w-[300px] max-w-[90vw]" />
        </div>
      </div>
    </div>
  );
}
