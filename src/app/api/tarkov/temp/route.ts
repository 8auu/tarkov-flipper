import { NextResponse } from "next/server";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function GET() {
  const query = `
    {
      traders {
        name
        cashOffers {
          buyLimit
          currency
          price
          minTraderLevel
          buyLimit
        }
      }
    }
  `;
  // const query = `
  //   {
  //     traders {
  //       name
  //       cashOffers {
  //         buyLimit
  //         item {
  //           id
  //           name
  //           types
  //           basePrice
  //           lastLowPrice
  //           avg24hPrice
  //           lastOfferCount
  //           inspectImageLink
  //           sellFor {
  //             currency
  //             priceRUB
  //             vendor {
  //               name
  //             }
  //           }
  //         }
  //         currency
  //         price
  //         minTraderLevel
  //         buyLimit
  //       }
  //     }
  //   }
  // `;

  const response = await fetch("https://api.tarkov.dev/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch prices ${response.status}, ${response.statusText}`,
    );
  }

  const data = await response.json();
  console.log("TRADER1", response.status, response.statusText);
  console.log("TRADER1", JSON.stringify(data.errors, null, 2));
  console.log("TRADER1", data);
  return NextResponse.json(data, { status: 200 });
}
