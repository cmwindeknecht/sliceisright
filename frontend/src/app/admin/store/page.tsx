"use client";

import { useAuth } from "@/components/context/Auth";
import ItemSelector from "@/components/ItemSelector";
import { logger } from "@/misc/logger";
import { OrderIntervalCategory } from "@/types/Order";
import { useEffect, useState } from "react";

export default function AdminStorePage() {
  const { user } = useAuth();

  const [maxPointsPerInterval, setMaxPointsPerInterval] = useState<number>(0);
  // TODO on mount, hit endpoint to get previous settings
  const [pointsByCategory, setPointsByCategory] = useState<Map<OrderIntervalCategory, number>>(
    new Map()
  );
  const [selectedCategory, setSelectedCategory] = useState<OrderIntervalCategory | null>(null);
  const [intervalPoints, setIntervalPoints] = useState<number>(0);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {}, [maxPointsPerInterval, [...pointsByCategory.values()].length]);

  const handleIntervalCategoryUpdate = () => {};

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const value = Number(e.target.value as unknown as OrderIntervalCategory);
      const hasValue = Object.values(OrderIntervalCategory).includes(value);
      if (hasValue) {
        setSelectedCategory(value);

        if (pointsByCategory.has(value)) {
          setIntervalPoints(Number(pointsByCategory.get(value)));
        } else {
          setIntervalPoints(0);
        }
      }
    } catch (exception: any) {
      logger.error("Failed to handle category change", { value: e.target.value, exception });
    }
  };

  const getIntervalCategories = () => {
    return Object.values(OrderIntervalCategory)
      .filter((orderIntervalCategory) => typeof orderIntervalCategory === "string")
      .filter(
        (orderIntervalCategory) =>
          orderIntervalCategory !== orderIntervalCategory[OrderIntervalCategory.MAX_PER_INTERVAL]
      );
  };

  const handleSubmit = () => {
    try {
      const intervalTotal = [...pointsByCategory.values()].reduce(
        (memo, points) => (memo += points),
        0
      );

      if (intervalTotal > maxPointsPerInterval) {
        setError("Interval will exceed the max!");
        return;
      }

      const orderInterval = {
        category: selectedCategory,
        amount: intervalPoints,
      };

      setSelectedCategory(null);
      setIntervalPoints(0);
      setError(null);
    } catch (exception: any) {
      setError("Failed to submit interval change");
      logger.error("Failed to submit interval change", { exception });
    }
  };

  return (
    <div>
      {user == null || !user.isAdmin ? (
        <h1> Forbidden</h1>
      ) : (
        <div>
          <h1 className="text-3xl font-bold">Admin Store Configuration</h1>
          <div>
            <div className="text-2xl font-bold">Configure Store Hours</div>
          </div>
          <div>
            <div className="text-2xl font-bold">Configure Intervals</div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-lg mx-auto p-4 border rounded-lg shadow"
            >
              <div>
                <label className="block mb-1 font-medium">Maximum Points Per Interval</label>
                <input
                  type="text"
                  placeholder="Name"
                  className="border p-2 rounded w-full"
                  value={maxPointsPerInterval}
                  onChange={(e) => setMaxPointsPerInterval(Number(e.target.value))}
                />
              </div>
              <ItemSelector
                label="Select Interval Category (optional)"
                value={selectedCategory?.toString() || ""}
                onChange={handleCategoryChange}
                items={getIntervalCategories()}
                defaultText="-- Create New Interval --"
              />
              <div>
                <div>
                  <label className="block mb-1 font-medium">Category: {selectedCategory}</label>
                  <input
                    type="text"
                    placeholder="Name"
                    className="border p-2 rounded w-full"
                    value={intervalPoints}
                    onChange={(e) => setIntervalPoints(Number(e.target.value))}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
