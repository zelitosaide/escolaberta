import { fetchFilteredComps } from "@/lib/data";
import { formatCurrencyMZ } from "@/lib/utils";
import Image from "next/image";
import CompStatus from "./comp-status";
import { DeleteComp, UpdateComp } from "./buttons";

interface CompsTableProps {
  q: string;
  currentPage: number;
}

export default async function CompsTable({ q, currentPage }: CompsTableProps) {
  const comps = await fetchFilteredComps(q, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-slate-50 p-2 md:pt-0">
          <div className="md:hidden">
            {comps?.map((comp, index) => (
              <div
                key={comp.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      {comp.images.length ? (
                        <Image
                          src={comp.images[0]}
                          className="mr-2 rounded-md"
                          width={28}
                          height={28}
                          alt={`${comp.name} image`}
                        />
                      ) : (
                        <Image
                          src={index % 2 === 0 ? "/comps/comp1.png" : "/comps/comp2.png"}
                          className="mr-2 rounded-md"
                          width={28}
                          height={28}
                          alt={`${comp.name} image`}
                        />
                      )}
                      <p>
                        {comp.name.length > 50 ? (
                          `${comp.name.slice(0, 50)}...`
                        ) : (
                          comp.name
                        )}  
                      </p>
                    </div>
                    <p className="text-sm text-slate-500">{comp.type}</p>
                  </div>
                  <CompStatus isActive={comp.isActive} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrencyMZ(comp.price)}
                    </p>
                    <p>Stock: {comp.stock}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateComp id={comp.id} />
                    <DeleteComp id={comp.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-slate-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Component Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Type
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Price
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Stock
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {comps?.map((comp, index) => (
                <tr
                  key={comp.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      {comp.images.length ? (
                        <Image
                          src={comp.images[0]}
                          className="rounded-md"
                          width={28}
                          height={28}
                          alt={`${comp.name} image`}
                        />
                      ) : (
                        <Image
                          src={index % 2 === 0 ? "/comps/comp1.png" : "/comps/comp2.png"}
                          className="rounded-md"
                          width={28}
                          height={28}
                          alt={`${comp.name} image`}
                        />
                      )}
                      <p>
                        {comp.name.length > 50 ? (
                          `${comp.name.slice(0, 50)}...`
                        ) : (
                          comp.name
                        )}  
                      </p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {comp.type}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrencyMZ(comp.price)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {comp.stock}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <CompStatus isActive={comp.isActive} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateComp id={comp.id} />
                      <DeleteComp id={comp.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}