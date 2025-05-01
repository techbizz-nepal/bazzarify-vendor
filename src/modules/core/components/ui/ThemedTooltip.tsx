import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipConfig } from "@/modules/product.management";
import { ReactNode } from "react";
import { FaCircleInfo } from "react-icons/fa6";

export function ThemedTooltip(props: TooltipConfig) {
  const { trigger, texts } = props;
  const renderTrigger = (): ReactNode => {
    if (trigger?.type === "icon") {
      return <FaCircleInfo className="cursor-pointer" aria-label="Info" />;
    }

    return (
      <span className="underline cursor-help">
        {trigger.label || "More Info"}
      </span>
    );
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{renderTrigger()}</TooltipTrigger>
        <TooltipContent>
          <ol>
            {texts.map((item, i) => (
              <li key={item[i].toLowerCase().replaceAll(" ", "-")}>{item}</li>
            ))}
          </ol>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
