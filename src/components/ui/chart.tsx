"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
  };
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const ctx = React.useContext(ChartContext);
  if (!ctx) throw new Error("useChart must be used within a <ChartContainer />");
  return ctx;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  // Recharts' ResponsiveContainer measures DOM on mount; during SSR/SSG the
  // parent has 0 width which triggers a console warning. Defer until mounted.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video min-h-[200px] w-full justify-center text-xs",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
          "[&_.recharts-cartesian-grid_line]:stroke-border/60",
          "[&_.recharts-polar-grid_line]:stroke-border/60",
          "[&_.recharts-reference-line_line]:stroke-border",
          "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-layer]:outline-none",
          "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-sector]:outline-none",
          "[&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        {mounted ? (
          <RechartsPrimitive.ResponsiveContainer>
            {children}
          </RechartsPrimitive.ResponsiveContainer>
        ) : null}
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "ChartContainer";

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorEntries = Object.entries(config).filter(([, v]) => v.color);
  if (!colorEntries.length) return null;

  const css = colorEntries
    .map(([key, v]) => `  --color-${key}: ${v.color};`)
    .join("\n");

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `[data-chart="${id}"] {\n${css}\n}`,
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

type TooltipItem = {
  name?: string | number;
  value?: number | string | (number | string)[];
  dataKey?: string | number;
  color?: string;
  payload?: Record<string, unknown>;
};

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    active?: boolean;
    payload?: TooltipItem[];
    label?: React.ReactNode;
    labelFormatter?: (
      label: React.ReactNode,
      payload: TooltipItem[]
    ) => React.ReactNode;
    formatter?: (
      value: TooltipItem["value"],
      name: TooltipItem["name"],
      item: TooltipItem
    ) => React.ReactNode;
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
  }
>(
  (
    {
      active,
      payload,
      label,
      labelFormatter,
      formatter,
      className,
      hideLabel = false,
      hideIndicator = false,
      indicator = "dot",
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart();

    if (!active || !payload?.length) return null;

    const tooltipLabel = !hideLabel
      ? (() => {
          const key = labelKey || (payload[0]?.dataKey as string) || "value";
          const itemConfig = config[key];
          const rendered = itemConfig?.label ?? label;
          if (labelFormatter) return labelFormatter(rendered, payload);
          return rendered;
        })()
      : null;

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[10rem] items-start gap-1.5 rounded-lg border border-border/60 bg-popover px-3 py-2 text-xs shadow-lg",
          className
        )}
      >
        {tooltipLabel ? (
          <div className="font-medium text-foreground">{tooltipLabel}</div>
        ) : null}
        <div className="grid gap-1.5">
          {payload.map((item, i) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = config[key];
            const color = item.color || itemConfig?.color;

            return (
              <div
                key={`${item.dataKey}-${i}`}
                className="flex w-full items-center gap-2 [&>svg]:size-2.5 [&>svg]:text-muted-foreground"
              >
                {formatter && item.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item)
                ) : (
                  <>
                    {!hideIndicator && (
                      <span
                        className={cn("shrink-0 rounded-[2px]", {
                          "size-2.5": indicator === "dot",
                          "w-1 h-3": indicator === "line",
                          "w-0 border-[1.5px] border-dashed h-3":
                            indicator === "dashed",
                        })}
                        style={{
                          background:
                            indicator === "dot" ? color : "transparent",
                          borderColor:
                            indicator !== "dot" ? color : "transparent",
                        }}
                      />
                    )}
                    <div className="flex flex-1 justify-between leading-none">
                      <span className="text-muted-foreground">
                        {itemConfig?.label || item.name}
                      </span>
                      {item.value !== undefined && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {typeof item.value === "number"
                            ? item.value.toLocaleString()
                            : Array.isArray(item.value)
                              ? item.value.join(" – ")
                              : item.value}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

const ChartLegend = RechartsPrimitive.Legend;

type LegendItem = {
  value?: string;
  dataKey?: string | number;
  color?: string;
};

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    payload?: LegendItem[];
    verticalAlign?: "top" | "bottom";
    nameKey?: string;
  }
>(({ className, payload, verticalAlign = "bottom", nameKey }, ref) => {
  const { config } = useChart();
  if (!payload?.length) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = config[key];
        return (
          <div
            key={`${item.value}`}
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <span
              className="size-2 shrink-0 rounded-[2px]"
              style={{ background: item.color }}
            />
            {itemConfig?.label || item.value}
          </div>
        );
      })}
    </div>
  );
});
ChartLegendContent.displayName = "ChartLegendContent";

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
