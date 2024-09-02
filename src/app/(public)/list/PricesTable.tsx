"use client";

import { Clipboard } from "lucide-react";
import { api, type RouterOutputs } from "~/trpc/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../_components/ui/table";
import Image from "next/image";
import { Input } from "~/app/_components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import { Button } from "~/app/_components/ui/button";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Skeleton } from "~/app/_components/ui/skeleton";
import { type z } from "zod";
import { getLatestPricesSchema } from "~/schemas/getLatestPricesSchema";
import { useToast } from "~/app/_components/ui/use-toast";
import { Switch } from "~/app/_components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/app/_components/ui/tooltip";
import { MultiSelect } from "~/app/_components/ui/multi-select";
import { ItemTypes } from "~/types/ItemTypes";

export const PricesTable = () => {
  const { toast } = useToast();
  const [prices, setPrices] = useState<
    RouterOutputs["tarkov"]["getLatestPrices"]
  >([]);

  const form = useForm<z.infer<typeof getLatestPricesSchema>>({
    resolver: zodResolver(getLatestPricesSchema),
    defaultValues: {
      smartFilter: true,
      limit: 100,
      minimumLastOfferCount: 5,
      itemTypes: Object.values(ItemTypes)
        .map((item) => {
          if (item === ItemTypes.GUN || item === ItemTypes.PRESET) return null;
          return item;
        })
        .filter((item) => item !== null),
      traderLevels: {
        prapor: 4,
        therapist: 4,
        fence: 4,
        skier: 4,
        peacekeeper: 4,
        mechanic: 4,
        ragman: 4,
        jaeger: 4,
      },
    },
  });

  const { data, refetch, isFetching } = api.tarkov.getLatestPrices.useQuery(
    {
      ...form.getValues(),
    },
    { enabled: true },
  );

  const handleSubmit = async () => {
    setPrices([]);
    const response = await refetch();
    if (!response.data) return;
    setPrices(response.data);
  };

  useEffect(() => {
    setPrices(data ?? []);
  }, [data]);

  return (
    <div className="mb-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="my-2 space-y-2"
        >
          <div className="flex gap-5">
            <TraderCard trader={"prapor"} form={form} />
            <TraderCard trader={"therapist"} form={form} />
            <TraderCard trader={"fence"} form={form} />
            <TraderCard trader={"skier"} form={form} />
            <TraderCard trader={"peacekeeper"} form={form} />
            <TraderCard trader={"mechanic"} form={form} />
            <TraderCard trader={"ragman"} form={form} />
            <TraderCard trader={"jaeger"} form={form} />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="smartFilter"
              render={({ field }) => (
                <FormItem className="rounded-md border p-2">
                  <div>
                    <FormLabel>Smart filter</FormLabel>
                    <FormDescription>
                      Prioritise items which will sell faster whilst still
                      having a high total profit. Disabling this option may
                      result in items with a very high profit, which will likely
                      never sell.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minimumLastOfferCount"
              render={({ field }) => (
                <FormItem className="rounded-md border p-2">
                  <div>
                    <FormLabel>Minimum last offer count</FormLabel>
                    <FormDescription>
                      The minimum amount of offers that have been made in the
                      last 24 hours. This is used to filter out prices which are
                      not likely to sell due to low demand.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Input
                          disabled={form.getValues().smartFilter}
                          placeholder="Minimum last offer"
                          {...field}
                          type={"number"}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value > 5000 || value < 1) return;
                            return field.onChange(parseInt(e.target.value));
                          }}
                          min={1}
                          max={5000}
                        />
                      </TooltipTrigger>
                      <TooltipContent
                        className="bg-destructive"
                        disabled={!form.getValues("smartFilter")}
                      >
                        <p>
                          You must disable the smart filter before configuring
                          this option
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="limit"
              render={({ field }) => (
                <FormItem className="rounded-md border p-2">
                  <div>
                    <FormLabel>Total results</FormLabel>
                    <FormDescription>
                      The amount of items to display in the table.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="limit"
                      {...field}
                      type={"number"}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value > 5000 || value < 1) return;
                        return field.onChange(parseInt(e.target.value));
                      }}
                      min={1}
                      max={5000}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="limit"
              render={({ field }) => (
                <FormItem className="rounded-md border p-2">
                  <div>
                    <FormLabel>Item types</FormLabel>
                    <FormDescription>
                      Only show specific item types, eg ammo, rigs, etc.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <MultiSelect
                      options={Object.values(ItemTypes)
                        .map((item) => {
                          if (
                            item === ItemTypes.GUN ||
                            item === ItemTypes.PRESET
                          )
                            return null;
                          return { label: item, value: item };
                        })
                        .filter((item) => item !== null)}
                      defaultValue={form.getValues("itemTypes")}
                      onValueChange={(value) => {
                        form.setValue("itemTypes", value as ItemTypes[]);
                      }}
                      placeholder="Item types"
                      variant="inverted"
                      animation={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" variant={"secondary"}>
            Update list
          </Button>
        </form>
      </Form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Trader</TableHead>
            <TableHead>Item</TableHead>
            <TableHead className="text-right">Buy limit</TableHead>
            <TableHead>Buy price</TableHead>
            <TableHead>Auction price</TableHead>
            <TableHead className="text-right">Last offer count</TableHead>
            <TableHead>Profit per item</TableHead>
            <TableHead className="text-right">Total profit (est)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isFetching ? (
            <>
              {Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-6 w-11/12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-11/12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-11/12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-11/12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-11/12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-11/12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-11/12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-11/12" />
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : (
            <>
              {prices.map((price, index) => {
                if (price.totalProfit <= 0) return null;
                return (
                  <TableRow key={price.id}>
                    <TableCell className="flex items-center gap-5 font-medium">
                      <h1 className="font-lg">{index + 1}</h1>
                      <div className="flex flex-col items-center">
                        <Image
                          className="h-12 w-12 rounded-md lg:h-24 lg:w-24"
                          src={`/traders/${price.trader.toLowerCase()}.webp`}
                          alt={`${price.trader} profile picture`}
                          width={128}
                          height={128}
                        />
                        <span>
                          {price.trader} {price.minTraderLevel}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <Image
                            className="h-12 w-12 rounded-md lg:h-28 lg:w-28"
                            src={`${price.itemImageUrl}`}
                            alt={`${price.trader} profile picture`}
                            width={128}
                            height={128}
                          />
                          <span>{price.name}</span>
                        </div>
                        <Clipboard
                          className="cursor-pointer text-gray"
                          onClick={async () => {
                            await navigator.clipboard.writeText(price.name);
                            toast({
                              title: "Copied to clipboard",
                              description: price.name,
                            });
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {price.buyLimit.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {price.buyFor.toLocaleString()}
                      <span className="text-xl font-semibold">₽</span>
                    </TableCell>
                    <TableCell className="text-right">
                      {price.sellFor.toLocaleString()}
                      <span className="text-xl font-semibold">₽</span>
                    </TableCell>
                    <TableCell className="text-right">
                      {price.lastTotalOfferCount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {price.profitPerItem.toLocaleString()}
                      <span className="text-xl font-semibold">₽</span>
                    </TableCell>
                    <TableCell className="text-right">
                      {price.totalProfit.toLocaleString()}
                      <span className="text-xl font-semibold">₽</span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

interface TraderCardProps {
  trader: keyof typeof getLatestPricesSchema._input.traderLevels;
  form: UseFormReturn<z.infer<typeof getLatestPricesSchema>>;
}

export const TraderCard = ({ trader, form }: TraderCardProps) => {
  return (
    <div className="flex flex-col">
      <FormField
        control={form.control}
        name={`traderLevels.${trader}`}
        render={({ field }) => (
          <FormItem>
            <Image
              className="rounded-md"
              src={`/traders/${trader}.webp`}
              alt={`${trader} profile picture`}
              width={64}
              height={64}
            />
            <Input
              type="number"
              placeholder="Trader level"
              {...field}
              value={field.value ?? ""}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value > 4 || value < 1) return;
                return field.onChange(parseInt(e.target.value));
              }}
              min={1}
              max={4}
            />
            <FormMessage />
          </FormItem>
        )}
      ></FormField>
    </div>
  );
};
