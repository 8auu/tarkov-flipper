"use client";

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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Skeleton } from "~/app/_components/ui/skeleton";

interface Props {
  data: RouterOutputs["tarkov"]["getLatestPrices"];
}

export const PricesTable = ({ data }: Props) => {
  const [prices, setPrices] =
    useState<RouterOutputs["tarkov"]["getLatestPrices"]>(data);
  const formSchema = z.object({
    traderLevel: z.coerce.number().min(1).max(4),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      traderLevel: 4,
    },
  });

  const { refetch, isFetching } = api.tarkov.getLatestPrices.useQuery(
    {
      limit: 100,
      traderLevel: form.getValues("traderLevel"),
    },
    { enabled: false },
  );

  const handleSubmit = async () => {
    setPrices([]);
    const response = await refetch();
    if (!response.data) return;
    setPrices(response.data);
  };

  return (
    <div className="mt-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-2/3 space-y-2"
        >
          <FormField
            control={form.control}
            name="traderLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trader level</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Trader level"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                </FormControl>
                <FormDescription>
                  Trader level from 1 to 4. Higher trader levels make more
                  money.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant={"secondary"}>
            Submit
          </Button>
        </form>
      </Form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Trader</TableHead>
            <TableHead>Item</TableHead>
            <TableHead className="text-right">Buy limit</TableHead>
            <TableHead className="text-right">Last offer count</TableHead>
            <TableHead>Profit per item</TableHead>
            <TableHead className="text-right">Max profit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isFetching ? (
            <>
              {Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="flex items-center gap-5 font-medium">
                    <Skeleton className="h-6 w-11/12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-11/12" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-6 w-11/12" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-6 w-11/12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-11/12" />
                  </TableCell>
                  <TableCell className="text-right">
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
                        className="rounded-md"
                        src={`/traders/${price.trader}.webp`}
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
                        className="rounded-md"
                        src={`${price.itemImageUrl}`}
                        alt={`${price.trader} profile picture`}
                        width={128}
                        height={128}
                      />
                      <span>{price.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {price.buyLimit.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {price.lastTotalOfferCount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {price.profitPerItem.toLocaleString()}
                    <span className="text-xl font-semibold">₽</span>
                  </TableCell>
                  <TableCell className="text-right">
                    {price.maxProfit.toLocaleString()}
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
