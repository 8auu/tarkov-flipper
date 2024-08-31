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

export const PricesTable = () => {
  const { toast } = useToast();
  const [prices, setPrices] = useState<
    RouterOutputs["tarkov"]["getLatestPrices"]
  >([]);

  const form = useForm<z.infer<typeof getLatestPricesSchema>>({
    resolver: zodResolver(getLatestPricesSchema),
    defaultValues: {
      limit: 100,
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
    <div className="mt-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-2/3 space-y-2"
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
          <FormField
            control={form.control}
            name="limit"
            render={({ field }) => (
              <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                <FormLabel>Total results</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Limt"
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
              {prices.map((price, index) => (
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
                    <div className="flex items-center gap-4">
                      <Image
                        className="h-12 w-12 rounded-md lg:h-28 lg:w-28"
                        src={`${price.itemImageUrl}`}
                        alt={`${price.trader} profile picture`}
                        width={128}
                        height={128}
                      />
                      <span>{price.name}</span>
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
              ))}
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
