import { type Item } from "../types/Item";

interface Props {
  limit: number;
  offset: number;
}

export const getFleaPrices = async ({
  limit,
  offset,
}: Props): Promise<Item[]> => {
  const query = `
    {
    items(limit: ${limit}, offset: ${offset}) {
      id
      name
      types
      basePrice
      lastLowPrice
      avg24hPrice
      lastOfferCount
      inspectImageLink
      updated
      sellFor {
        currency
        priceRUB
        vendor {
          name
        }
      }
      historicalPrices {
        timestamp
        price
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

  console.log("FLEA", response.status, response.statusText);
  console.log("FLEA", JSON.stringify(data.errors, null, 2));
  console.log("FLEA", data);

  return data.data.items;
};
