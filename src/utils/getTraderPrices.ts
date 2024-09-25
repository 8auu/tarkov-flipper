import { type TradersResponse } from "../types/traderResponse";

export const getTraderPrices = async (): Promise<TradersResponse> => {
  const query = `
    {
      traders {
        name
        cashOffers {
          buyLimit
          item {
            id
            name
            types
            basePrice
            lastLowPrice
            avg24hPrice
            lastOfferCount
            inspectImageLink
            sellFor {
              currency
              priceRUB
              vendor {
                name
              }
            }
          }
          currency
          price
          minTraderLevel
          buyLimit
        }
      }
    }
  `;

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
  console.log("TRADER", response.status, response.statusText);
  console.log("TRADER", JSON.stringify(data.errors, null, 2));
  console.log("TRADER", data);

  return data.data;
};
