export interface AdminSizeSelectorProps<T extends { size: string; price: number }> {
  sizes: T[];
  setSizes: React.Dispatch<React.SetStateAction<T[]>>;
  sizeOptions: string[];
  label?: string;
}

export default function AdminSizeSelector<T extends { size: string; price: number }>({
  sizes,
  setSizes,
  sizeOptions,
  label = "Sizes & Prices",
}: AdminSizeSelectorProps<T>) {
  const toggleSize = (size: string) => {
    const isSelected = !!sizes.find((s) => s.size === size);
    if (isSelected) {
      setSizes(sizes.filter((s) => s.size !== size));
    } else {
      setSizes([...sizes, { size, price: 0 } as T]);
    }
  };

  const updatePrice = (size: string, newPrice: number) => {
    setSizes(sizes.map((s) => (s.size === size ? { ...s, price: newPrice } : s)));
  };

  return (
    <div>
      <label className="block mb-2 font-medium">Sizes & Prices</label>

      <div className="gap-4">
        <div className="flex flex-col items-start gap-3">
          {sizeOptions.map((size) => {
            const sizeObj = sizes.find((x) => x.size === size);
            const isSelected = !!sizeObj;

            return (
              <div key={size} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1 rounded border min-w-[48px] text-center ${
                    isSelected ? "bg-orange-600 text-white" : "bg-white text-gray-700"
                  }`}
                >
                  {size}
                </button>
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
