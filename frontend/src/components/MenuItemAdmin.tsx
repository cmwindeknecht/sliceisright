import { MenuItem as MenuItemType } from "@/types/MenuItem";
import { useState } from "react";

export interface MenuItemAdminProps {
  menuItem: MenuItemType;
}

export default function MenuItemAdmin({ menuItem }: MenuItemAdminProps) {
  const [showImageOverlay, setShowImageOverlay] = useState<boolean>(false);

  return (
    <>
      <div className="flex gap-4 p-4 border rounded-lg shadow bg-white min-w-5xl h-fit">
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

        {/* Right: Content */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Name and Description - Side by Side */}
          <div className="flex gap-4">
            {/* Name */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{menuItem.name}</h3>

              <div className="text-sm">
                <span className="font-medium">Category:</span>{" "}
                <span className="text-gray-700">{menuItem.category}</span>
              </div>
            </div>

            {/* Description */}
            {menuItem.description && (
              <div className="flex-1">
                <p className="text-gray-600 text-sm">{menuItem.description}</p>
              </div>
            )}
          </div>

          {/* Available Sizes and Ingredients - Side by Side */}
          <div className="flex gap-4">
            {/* Available Sizes */}
            {menuItem.sizes && menuItem.sizes.length > 0 && (
              <div className="flex-1">
                <div className="text-sm font-medium mb-2">Available Sizes:</div>
                <div className="flex flex-wrap gap-2">
                  {menuItem.sizes.map((size) => (
                    <button
                      key={size.size}
                      type="button"
                      disabled
                      className="px-3 py-1 rounded border bg-gray-100 text-gray-700 cursor-default"
                    >
                      {size.size}: ${size.price.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Default Ingredients */}
            {menuItem.ingredients && menuItem.ingredients.length > 0 && (
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-sm font-medium">Ingredients:</div>
                  <div className="flex flex-row items-center">
                    <input type="checkbox" checked={menuItem.isCustomizable} readOnly />
                    <div className="pl-1 text-sm">Can be customized by customer?</div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {menuItem.ingredients.map((ingredient) => (
                    <div key={ingredient.id} className="text-sm text-gray-700">
                      <span className="font-medium">{ingredient.name}</span>
                      {ingredient.sizes && ingredient.sizes.length > 0 && (
                        <span className="ml-2 text-gray-500">
                          (
                          {ingredient.sizes
                            .map((size) => `${size.size}: ${size.price.toFixed(2)}`)
                            .join(", ")}
                          )
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
