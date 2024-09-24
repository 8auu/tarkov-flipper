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

  console.log(response.status, response.statusText);

  const data = await response.json();
  console.log(data.errors.locations);
  console.log(data.errors.path);
  console.log(data);

  return data.data;
};
