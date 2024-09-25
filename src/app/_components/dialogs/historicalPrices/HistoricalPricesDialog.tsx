import { type Price } from "~/types/Price";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../../ui/charts";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { TrendingUp } from "lucide-react";

interface Props {
  price: Price | undefined;
  opened: boolean;
  setOpened: (opened: boolean) => void;
}

export const HistoricalPricesDialog = ({ price, opened, setOpened }: Props) => {
  if (!price) return;

  return (
    <Dialog open={opened} onOpenChange={(opened) => setOpened(opened)}>
      <DialogContent className="w-80 sm:w-full sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Historical prices</DialogTitle>
          <DialogDescription>
            Historical prices for{" "}
            <span className="font-bold text-white">{price.name}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <HistoricalPricesChart historicalPrices={price.historicalPrices} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

interface HistoricalPricesChartProps {
  historicalPrices: { timestamp: string; price: number }[];
}

const HistoricalPricesChart = ({
  historicalPrices,
}: HistoricalPricesChartProps) => {
  const formattedData = historicalPrices.map((price) => ({
    price: price.price,
    timestamp: new Date(Number(price.timestamp)).getHours(),
  }));

  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={formattedData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={true}
              axisLine={true}
              tickFormatter={(hour) => `${hour}:00`}
            />
            <YAxis dataKey="price" />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="price"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-desktop)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
