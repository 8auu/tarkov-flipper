import { PricesTable } from "./PricesTable";

export default async function Trader() {
  return (
    <>
      <div>
        <h1>Latest Tarkov Prices</h1>
        <p className="text-sm text-gray">
          Prices can be slightly, they are updated every 5minutes. Currently it
          doesnt calculated flea market fees, but those are usually minimal.
          Keep an eye for the{" "}
          <span className="text-white">last offer count</span> field as it can
          be a good indicator of how quickly an item will sell. If the count is
          very low (less than 5), you likely will not make any money from the
          item
        </p>
        <PricesTable />
      </div>
    </>
  );
}
