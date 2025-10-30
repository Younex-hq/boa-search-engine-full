import { useIsMobile } from "@/hooks/use-mobile";
import { InfoIcon } from "lucide-react";

type PageHeaderProps = {
  title: string;
  info?: string;
  responsive?: boolean;
  className?: string;
};

export default function PageHeader({
  title,
  info,
  responsive = false,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={`m-auto grid w-[100vw] gap-2 sm:my-5 sm:w-fit ${className}`}
    >
      <h1
        className={`from-boa-sky text-boa-sky to-boa-blue m-auto w-[100vw] bg-gradient-to-r bg-clip-text px-3 text-center leading-tight sm:w-fit sm:px-0 sm:leading-none md:text-transparent ${useIsMobile() ? "text-[1.8rem]" : "text-[2.5rem]"}`}
      >
        {title}
      </h1>
      {info && (
        <p className="m-auto mb-5 flex w-fit items-center gap-3 rounded-xl bg-gray-200/50 p-2 px-3 text-xs text-gray-500">
          <InfoIcon size={18} />
          {info}
        </p>
      )}
    </div>
  );
}
