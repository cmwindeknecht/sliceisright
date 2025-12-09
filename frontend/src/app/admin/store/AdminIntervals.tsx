"use client";

import { useAuth } from "@/components/context/Auth";
import ItemSelector from "@/components/ItemSelector";
import { logger } from "@/misc/logger";
import { OrderIntervalCategory, OrderIntervalDay } from "@/types/Order";
import clsx from "clsx";
import { useEffect, useState } from "react";
export default function AdminIntervals() {
  const [pointsMap, setPointsMap] = useState<
    Map<OrderIntervalDay, Map<OrderIntervalCategory, number>>
  >(new Map());

  const [selectedDay, setSelectedDay] = useState<OrderIntervalDay>(OrderIntervalDay.ALL_DAYS);
  const [selectedCategory, setSelectedCategory] = useState<OrderIntervalCategory | null>(null);
  const [intervalPoints, setIntervalPoints] = useState<number>(0);

  const [show, setShow] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize all days with empty maps
  useEffect(() => {
    // TODO I need to load from the backend and if its empty then do this default map
    // let initialMap = GET request
    // if (initialMap.size == 0) { make default map }
    const initialMap = new Map<OrderIntervalDay, Map<OrderIntervalCategory, number>>();
    Object.values(OrderIntervalDay).forEach((day) => {
      initialMap.set(day as OrderIntervalDay, new Map<OrderIntervalCategory, number>());
    });
    setPointsMap(initialMap);
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const value = Number(e.target.value);
      if (Number.isNaN(value)) {
        setSelectedCategory(null);
        return;
      } else {
        setSelectedCategory(value);
      }

      const dayMap = pointsMap.get(selectedDay);
      if (dayMap && dayMap.has(value)) {
        setIntervalPoints(dayMap.get(value)!);
      } else {
        setIntervalPoints(0);
      }
    } catch (exception: any) {
      logger.error("Failed to handle category change", { value: e.target.value, exception });
    }
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const value = Number(e.target.value);
      setSelectedDay(value);
      setSelectedCategory(null);
      setIntervalPoints(0);
    } catch (exception: any) {
      logger.error("Failed to handle day change", { value: e.target.value, exception });
    }
  };

  const handleSubmit = () => {
    try {
      if (selectedCategory === null) {
        setError("Please select a category!");
        return;
      }

      const maxPoints =
        selectedDay === OrderIntervalDay.ALL_DAYS
          ? (pointsMap
              .get(OrderIntervalDay.ALL_DAYS)
              ?.get(OrderIntervalCategory.MAX_INTERVAL_POINTS) ?? Infinity)
          : (pointsMap.get(selectedDay)?.get(OrderIntervalCategory.MAX_INTERVAL_POINTS) ??
            pointsMap
              .get(OrderIntervalDay.ALL_DAYS)
              ?.get(OrderIntervalCategory.MAX_INTERVAL_POINTS) ??
            Infinity);

      // Validate that category points don't exceed max (unless setting max itself)
      if (
        selectedCategory !== OrderIntervalCategory.MAX_INTERVAL_POINTS &&
        intervalPoints > maxPoints
      ) {
        setError(
          `Category points (${intervalPoints}) cannot exceed maximum points per interval (${maxPoints})!`
        );
        return;
      }

      const updatedPointsByCategory = new Map(pointsMap);

      if (selectedDay === OrderIntervalDay.ALL_DAYS) {
        [
          OrderIntervalDay.ALL_DAYS,
          OrderIntervalDay.MONDAY,
          OrderIntervalDay.TUESDAY,
          OrderIntervalDay.WEDNESDAY,
          OrderIntervalDay.THURSDAY,
          OrderIntervalDay.FRIDAY,
          OrderIntervalDay.SATURDAY,
          OrderIntervalDay.SUNDAY,
        ].forEach((day) => {
          const dayMap = new Map(updatedPointsByCategory.get(day) || new Map());
          dayMap.set(selectedCategory, intervalPoints);
          updatedPointsByCategory.set(day, dayMap);
        });
      } else {
        // Update specific day only
        const dayMap = new Map(updatedPointsByCategory.get(selectedDay) || new Map());
        dayMap.set(selectedCategory, intervalPoints);
        updatedPointsByCategory.set(selectedDay, dayMap);
      }

      setPointsMap(updatedPointsByCategory);
      setSelectedCategory(null);
      setIntervalPoints(0);
      setError(null);
      setSuccess("Successfully updated!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (exception: any) {
      setError("Failed to update!");
      logger.error("Failed to submit interval change", { exception });
    }
  };

  const createIntervals = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // TODO: Implement POST request to save intervals
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess("Successly created!");
      console.log("Intervals created:", pointsMap);
    } catch (exception: any) {
      setError("Failed to create!");
      logger.error("Failed to create intervals", { exception });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryValue = (
    day: OrderIntervalDay,
    category: OrderIntervalCategory
  ): number | string => {
    const dayMap = pointsMap.get(day);
    if (dayMap && dayMap.has(category)) {
      return dayMap.get(category)!;
    }

    return "unset";
  };

  const getIntervalCategories = () => {
    return Object.values(OrderIntervalCategory)
      .filter((value) => typeof value === "number")
      .sort((a, b) => (a as number) - (b as number));
  };

  const getIntervalDays = () => {
    return Object.values(OrderIntervalDay)
      .filter((value) => typeof value === "number")
      .sort((a, b) => (a as number) - (b as number));
  };

  const getDisplayDays = () => {
    return Object.values(OrderIntervalDay)
      .filter((value) => typeof value === "number" && value !== OrderIntervalDay.ALL_DAYS)
      .sort((a, b) => (a as number) - (b as number));
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold">Configure Intervals</h2>
        <button
          onClick={() => setShow((prev) => !prev)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
      {show && (
        <div className="flex flex-row gap-4">
          <div className="min-w-[300px] max-w-[300px]">
            <div className="flex flex-col gap-4 p-4 border rounded-lg shadow">
              <ItemSelector
                label="Select Interval Day"
                value={selectedDay.toString()}
                onChange={handleDayChange}
                items={getIntervalDays().map((day) => OrderIntervalDay[day])}
                defaultText={null}
                shouldSort={false}
              />

              <ItemSelector
                label="Select Category"
                value={selectedCategory?.toString() || ""}
                onChange={handleCategoryChange}
                items={getIntervalCategories().map((category) => OrderIntervalCategory[category])}
                defaultText="-- Select Category --"
                shouldSort={false}
              />

              <div>
                <div className="font-medium">Interval points per 15 minutes</div>
                <div className="text-xs">
                  e.g. if max points is 12, and I can make 3 pizzas in 15 minutes, PIZZAS should be
                  set to 4 points, or I can make 6 garlic breads, APPETIZERS should be set to 2
                  points
                </div>
                <input
                  type="number"
                  className={clsx(
                    "border p-2 rounded w-full",
                    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                    selectedCategory === null && "bg-gray-500"
                  )}
                  value={selectedCategory !== null && intervalPoints !== 0 ? intervalPoints : ""}
                  onChange={(e) => setIntervalPoints(Number(e.target.value))}
                  disabled={selectedCategory === null}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={selectedCategory === null}
                className={clsx(
                  "bg-blue-600 py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed",
                  error === null && success === null && "text-white hover:bg-blue-700",
                  error && "bg-red-700 text-black",
                  success && "bg-green-700 text-black"
                )}
              >
                {error !== null ? error : success !== null ? success : "Update Category"}
              </button>
            </div>

            <button
              onClick={createIntervals}
              disabled={loading}
              className="w-full mt-4 bg-orange-600 text-white py-3 rounded hover:bg-orange-700 disabled:opacity-50 font-semibold"
            >
              {loading ? "Saving..." : "Save All Intervals"}
            </button>
          </div>

          <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {getDisplayDays().map((day) => {
              const maxPoints = getCategoryValue(day, OrderIntervalCategory.MAX_INTERVAL_POINTS);

              return (
                <div key={day} className="p-4 border rounded-lg shadow bg-gray-50">
                  <h3 className="font-bold text-lg mb-2">{OrderIntervalDay[day]}</h3>
                  <div className="text-sm mb-2">
                    <span className="font-semibold">Maximum: </span>
                    <span className={maxPoints === "unset" ? "text-red-600" : ""}>
                      {maxPoints} points
                    </span>
                  </div>

                  <div className="space-y-1 text-sm">
                    {getIntervalCategories()
                      .filter((cat) => cat !== OrderIntervalCategory.MAX_INTERVAL_POINTS)
                      .map((category) => {
                        const value = getCategoryValue(day, category);
                        return (
                          <div key={category} className="flex justify-between">
                            <span>{OrderIntervalCategory[category]}:</span>
                            <span className={value === "unset" ? "text-gray-400" : "font-medium"}>
                              {value === "unset" ? "unset" : `${value} points`}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
