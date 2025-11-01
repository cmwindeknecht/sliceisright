export interface SizeSelectorProps<T extends { size: string; price: number }> {
  sizes: T[];
  setSizes: React.Dispatch<React.SetStateAction<T[]>>;
  sizeOptions: string[];
  label?: string;
}

export default function SizeSelector<T extends { size: string; price: number }>({
  sizes,
  setSizes,
  sizeOptions,
  label = "Sizes & Prices",
}: SizeSelectorProps<T>) {
  const toggleSize = (size: string) => {
    const isSelected = !!sizes.find((s) => s.size === size);
    if (isSelected) {
      setSizes(sizes.filter((s) => s.size !== size));
    } else {
      if (size === "None") {
        setSizes([{ size: "None", price: 0 } as T]);
      } else {
        const withoutNone = sizes.filter((s) => s.size !== "None");
        setSizes([...withoutNone, { size, price: 0 } as T]);
      }
    }
  };

  const updatePrice = (size: string, newPrice: number) => {
    setSizes(sizes.map((s) => (s.size === size ? { ...s, price: newPrice } : s)));
  };

  return (
    <div>
      <label className="block mb-2 font-medium">Sizes & Prices</label>

      <div className="grid grid-cols-2 gap-4">
        {/* LEFT COLUMN: None */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => toggleSize("None")}
            className={`px-3 py-1 rounded border min-w-[60px] text-center ${
              !!sizes.find((s) => s.size === "None")
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            None
          </button>

          {sizes.find((s) => s.size === "None") && (
            <div className="relative w-28">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                className="border rounded w-full p-1 pl-6 text-right 
                             [appearance:textfield] 
                             [&::-webkit-inner-spin-button]:appearance-none 
                             [&::-webkit-outer-spin-button]:appearance-none 
                             focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={sizes.find((s) => s.size === "None")!.price || ""}
                min={0}
                step={0.01}
                onChange={(e) => updatePrice("None", Number(e.target.value))}
              />
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: S, M, L, XL */}
        <div className="flex flex-col items-end gap-3">
          {sizeOptions
            .filter((s) => s !== "None")
            .map((size) => {
              const sizeObj = sizes.find((x) => x.size === size);
              const isSelected = !!sizeObj;

              return (
                <div key={size} className="flex items-center gap-3">
                  {isSelected ? (
                    <div className="relative w-28">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        className="border rounded w-full p-1 pl-6 text-right 
                                     [appearance:textfield] 
                                     [&::-webkit-inner-spin-button]:appearance-none 
                                     [&::-webkit-outer-spin-button]:appearance-none 
                                     focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={sizeObj!.price || ""}
                        min={0}
                        step={0.01}
                        onChange={(e) => updatePrice(size, Number(e.target.value))}
                      />
                    </div>
                  ) : (
                    <div className="w-28" />
                  )}

                  <button
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1 rounded border min-w-[48px] text-center ${
                      isSelected ? "bg-orange-600 text-white" : "bg-white text-gray-700"
                    }`}
                  >
                    {size}
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
