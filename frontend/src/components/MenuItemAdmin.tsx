import { sortIngredientSize, sortMenuSize } from "@/misc/helper";
import { MenuItem as MenuItemType } from "@/types/MenuItem";
import { useState } from "react";

export interface MenuItemAdminProps {
  menuItem: MenuItemType;
}

export default function MenuItemAdmin({ menuItem }: MenuItemAdminProps) {
  const [showImageOverlay, setShowImageOverlay] = useState<boolean>(false);

  return (
    <>
      <div className="flex gap-4 p-4 border rounded-lg shadow bg-orange-600 min-w-5xl h-fit">
        {/* Left: Image */}
        <div className="flex-shrink-0 cursor-pointer" onClick={() => setShowImageOverlay(true)}>
          {menuItem.imageUrl ? (
            <img
              src={menuItem.imageUrl}
              alt={menuItem.name}
              className="w-32 h-full object-cover rounded hover:opacity-90 transition-opacity"
            />
          ) : (
            <img
              src="/queens.jpg"
              alt="default"
              className="w-32 h-full object-cover rounded hover:opacity-90 transition-opacity"
            />
          )}
        </div>

        <div className="flex flex-col flex-1 gap-3">
          <div className="flex gap-4 h-1/3 bg-red-600 rounded-2xl p-2">
            {/* Name */}
            <div className="flex flex-col w-1/4  text-sm">
              <div>
                <span className="font-medium">Name:</span>
                <span className="text-black">{menuItem.name}</span>
              </div>

              <div>
                <span className="font-medium">Category:</span>
                <span className="text-black">{menuItem.category}</span>
              </div>
            </div>

            <div className="text-sm w-3/4">
              <span className="font-medium">Description:</span>
              <span className="text-black">{menuItem.description}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col w-1/4 text-sm font-medium mb-2">
              Sizes
              {menuItem.sizes && menuItem.sizes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {sortMenuSize(menuItem.sizes).map((size) => (
                    <button
                      key={size.size}
                      type="button"
                      disabled
                      className="px-3 py-1 rounded border bg-red-600 text-black cursor-default"
                    >
                      {size.size}: ${size.price.toFixed(2)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col w-3/4 text-sm font-medium">
              <div className="flex flex-row gap-4">
                <span className="font-bold">Ingredients</span>
                <div className="flex flex-row items-center">
                  <input type="checkbox" checked={menuItem.isCustomizable} readOnly />
                  <div className="pl-1 text-sm">Can be customized by customer?</div>
                </div>
              </div>
              {menuItem.ingredients && menuItem.ingredients.length > 0 && (
                <div className="flex flex-row flex-wrap gap-1">
                  {menuItem.ingredients.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className="text-sm text-black border-2 border-black p-1 bg-red-6"
                    >
                      <span className="font-medium">{ingredient.name}</span>
                      {ingredient.sizes && ingredient.sizes.length > 0 && (
                        <span className="ml-2 text-black">
                          (
                          {sortIngredientSize(ingredient.sizes)
                            .map((size) => `${size.size}: ${size.price.toFixed(2)}`)
                            .join(", ")}
                          )
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showImageOverlay && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowImageOverlay(false)}
        >
          <img
            src={menuItem.imageUrl || "/queens.jpg"}
            alt={menuItem.name}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
