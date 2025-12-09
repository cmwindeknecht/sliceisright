"use client";

import ItemSelector from "@/components/ItemSelector";
import { convertLocalTimeToUTC, convertUTCToLocalTime, getInputTimeFromUTC } from "@/misc/helper";
import { logger } from "@/misc/logger";
import { OrderIntervalDay } from "@/types/Order";
import clsx from "clsx";
import { useState } from "react";

interface StoreHours {
  storeOpen: string;
  firstOrderTime: string;
  storeClose: string;
  lastOrderTime: string;
  breakfastStart: string;
  breakfastEnd: string;
  lunchStart: string;
  lunchEnd: string;
  dinnerStart: string;
  dinnerEnd: string;
}

export default function AdminStoreHours() {
  const [hoursByDay, setHoursByDay] = useState<Map<OrderIntervalDay, StoreHours>>(new Map());
  const [selectedDay, setSelectedDay] = useState<OrderIntervalDay>(OrderIntervalDay.ALL_DAYS);
  const [showHours, setShowHours] = useState<boolean>(true);

  const [storeOpen, setStoreOpen] = useState<string>("");
  const [firstOrderTime, setFirstOrderTime] = useState<string>("");
  const [storeClose, setStoreClose] = useState<string>("");
  const [lastOrderTime, setLastOrderTime] = useState<string>("");
  const [breakfastStart, setBreakfastStart] = useState<string>("");
  const [breakfastEnd, setBreakfastEnd] = useState<string>("");
  const [lunchStart, setLunchStart] = useState<string>("");
  const [lunchEnd, setLunchEnd] = useState<string>("");
  const [dinnerStart, setDinnerStart] = useState<string>("");
  const [dinnerEnd, setDinnerEnd] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const value = Number(e.target.value);
      setSelectedDay(value);

      const existingHours = hoursByDay.get(value);
      if (existingHours) {
        setStoreOpen(getInputTimeFromUTC(existingHours.storeOpen));
        setFirstOrderTime(getInputTimeFromUTC(existingHours.firstOrderTime));
        setStoreClose(getInputTimeFromUTC(existingHours.storeClose));
        setLastOrderTime(getInputTimeFromUTC(existingHours.lastOrderTime));
        setBreakfastStart(getInputTimeFromUTC(existingHours.breakfastStart));
        setBreakfastEnd(getInputTimeFromUTC(existingHours.breakfastEnd));
        setLunchStart(getInputTimeFromUTC(existingHours.lunchStart));
        setLunchEnd(getInputTimeFromUTC(existingHours.lunchEnd));
        setDinnerStart(getInputTimeFromUTC(existingHours.dinnerStart));
        setDinnerEnd(getInputTimeFromUTC(existingHours.dinnerEnd));
      } else {
        // Reset all fields
        setStoreOpen("");
        setFirstOrderTime("");
        setStoreClose("");
        setLastOrderTime("");
        setBreakfastStart("");
        setBreakfastEnd("");
        setLunchStart("");
        setLunchEnd("");
        setDinnerStart("");
        setDinnerEnd("");
      }
    } catch (exception: any) {
      logger.error("Failed to handle day change", { value: e.target.value, exception });
    }
  };

  const handleSubmit = () => {
    try {
      if (!storeOpen || !storeClose) {
        setError("Store open and close times are required!");
        return;
      }

      const hours: StoreHours = {
        storeOpen: convertLocalTimeToUTC(storeOpen),
        firstOrderTime: convertLocalTimeToUTC(firstOrderTime || storeOpen),
        storeClose: convertLocalTimeToUTC(storeClose),
        lastOrderTime: convertLocalTimeToUTC(lastOrderTime || storeClose),
        breakfastStart: convertLocalTimeToUTC(breakfastStart),
        breakfastEnd: convertLocalTimeToUTC(breakfastEnd),
        lunchStart: convertLocalTimeToUTC(lunchStart),
        lunchEnd: convertLocalTimeToUTC(lunchEnd),
        dinnerStart: convertLocalTimeToUTC(dinnerStart),
        dinnerEnd: convertLocalTimeToUTC(dinnerEnd),
      };

      const updatedHoursByDay = new Map(hoursByDay);

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
          updatedHoursByDay.set(day, { ...hours });
        });
      } else {
        updatedHoursByDay.set(selectedDay, hours);
      }

      setHoursByDay(updatedHoursByDay);
      setError(null);
      setSuccess("Successfully updated!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (exception: any) {
      setError("Failed to update!");
      logger.error("Failed to submit hours", { exception });
    }
  };

  const saveStoreHours = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // TODO: Implement POST request to save store hours
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess("Successfully saved!");
      console.log("Store hours to save:", hoursByDay);
    } catch (exception: any) {
      setError("Failed to save!");
      logger.error("Failed to save store hours", { exception });
    } finally {
      setLoading(false);
    }
  };

  const getHoursForDay = (day: OrderIntervalDay): StoreHours | null => {
    const dayHours = hoursByDay.get(day);
    if (dayHours) return dayHours;
    return null;
  };

  const handleDeleteDay = (day: OrderIntervalDay) => {
    console.log("Delete clicked for day:", day, OrderIntervalDay[day]);
    console.log("Current hoursByDay:", hoursByDay);

    try {
      const updatedHoursByDay = new Map(hoursByDay);
      console.log("Before delete:", updatedHoursByDay.has(day));
      updatedHoursByDay.delete(day);
      console.log("After delete:", updatedHoursByDay.has(day));

      setHoursByDay(updatedHoursByDay);

      // Clear the form if we're deleting the currently selected day
      if (selectedDay === day) {
        setStoreOpen("");
        setFirstOrderTime("");
        setStoreClose("");
        setLastOrderTime("");
        setBreakfastStart("");
        setBreakfastEnd("");
        setLunchStart("");
        setLunchEnd("");
        setDinnerStart("");
        setDinnerEnd("");
      }

      setSuccess("Successfully deleted!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (exception: any) {
      setError("Failed to delete!");
      logger.error("Failed to delete day hours", { exception, day });
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold">Configure Store Hours</h2>
        <button
          onClick={() => setShowHours((prev) => !prev)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
        >
          {showHours ? "Hide" : "Show"}
        </button>
      </div>

      {showHours && (
        <div className="flex flex-row gap-4">
          <div className="min-w-[300px]">
            <div className="flex flex-col gap-4 p-4 border rounded-lg shadow">
              <ItemSelector
                label="Select Day"
                value={selectedDay.toString()}
                onChange={handleDayChange}
                items={getIntervalDays().map((day) => OrderIntervalDay[day])}
                defaultText={null}
                shouldSort={false}
              />

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Store Hours</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">Store Open</label>
                    <input
                      type="time"
                      className="border p-2 rounded w-full text-sm"
                      value={storeOpen}
                      onChange={(e) => setStoreOpen(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">First Order Time</label>
                    <input
                      type="time"
                      className="border p-2 rounded w-full text-sm"
                      value={firstOrderTime}
                      onChange={(e) => setFirstOrderTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Store Close</label>
                    <input
                      type="time"
                      className="border p-2 rounded w-full text-sm"
                      value={storeClose}
                      onChange={(e) => setStoreClose(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Last Order Time</label>
                    <input
                      type="time"
                      className="border p-2 rounded w-full text-sm"
                      value={lastOrderTime}
                      onChange={(e) => setLastOrderTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Breakfast Hours</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">Start</label>
                    <input
                      type="time"
                      className="border p-2 rounded w-full text-sm"
                      value={breakfastStart}
                      onChange={(e) => setBreakfastStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">End</label>
                    <input
                      type="time"
                      className="border p-2 rounded w-full text-sm"
                      value={breakfastEnd}
                      onChange={(e) => setBreakfastEnd(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Lunch Hours</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">Start</label>
                    <input
                      type="time"
                      className="border p-2 rounded w-full text-sm"
                      value={lunchStart}
                      onChange={(e) => setLunchStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">End</label>
                    <input
                      type="time"
                      className="border p-2 rounded w-full text-sm"
                      value={lunchEnd}
                      onChange={(e) => setLunchEnd(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Dinner Hours</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">Start</label>
                    <input
                      type="time"
                      className="border p-2 rounded w-full text-sm"
                      value={dinnerStart}
                      onChange={(e) => setDinnerStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">End</label>
                    <input
                      type="time"
                      className="border p-2 rounded w-full text-sm"
                      value={dinnerEnd}
                      onChange={(e) => setDinnerEnd(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className={clsx(
                  "py-2 px-4 rounded",
                  error === null && success === null && "bg-blue-600 text-white hover:bg-blue-700",
                  error && "bg-red-700 text-black",
                  success && "bg-green-700 text-black"
                )}
              >
                {error !== null ? error : success !== null ? success : "Update Hours"}
              </button>
            </div>

            <button
              onClick={saveStoreHours}
              disabled={loading}
              className="w-full mt-4 bg-orange-600 text-white py-3 rounded hover:bg-orange-700 disabled:opacity-50 font-semibold"
            >
              {loading ? "Saving..." : "Save All Hours"}
            </button>
          </div>

          <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {getDisplayDays().map((day) => {
              const hours = getHoursForDay(day);

              return (
                <div key={day} className="p-4 border rounded-lg shadow bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">{OrderIntervalDay[day]}</h3>
                    {hours && (
                      <button
                        onClick={() => handleDeleteDay(day as OrderIntervalDay)}
                        className="outline outline-black text-red-600 hover:text-red-800 text-sm font-medium"
                        title="Delete hours for this day"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  {hours ? (
                    <div className="space-y-2 text-sm">
                      <div className="border-b pb-2">
                        <div className="font-semibold mb-1">Store Hours</div>
                        <div className="flex justify-between">
                          <span>Open:</span>
                          <span className="font-medium">
                            {convertUTCToLocalTime(hours.storeOpen)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>First Order:</span>
                          <span className="font-medium">
                            {convertUTCToLocalTime(hours.firstOrderTime)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Close:</span>
                          <span className="font-medium">
                            {convertUTCToLocalTime(hours.storeClose)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Order:</span>
                          <span className="font-medium">
                            {convertUTCToLocalTime(hours.lastOrderTime)}
                          </span>
                        </div>

                        {/* And for meal periods: */}
                        {(hours.breakfastStart || hours.breakfastEnd) && (
                          <div>
                            <div className="font-semibold">Breakfast</div>
                            <div className="text-gray-600">
                              {convertUTCToLocalTime(hours.breakfastStart)} -{" "}
                              {convertUTCToLocalTime(hours.breakfastEnd)}
                            </div>
                          </div>
                        )}

                        {(hours.lunchStart || hours.lunchEnd) && (
                          <div>
                            <div className="font-semibold">Lunch</div>
                            <div className="text-gray-600">
                              {convertUTCToLocalTime(hours.lunchStart)} -{" "}
                              {convertUTCToLocalTime(hours.lunchEnd)}
                            </div>
                          </div>
                        )}

                        {(hours.dinnerStart || hours.dinnerEnd) && (
                          <div>
                            <div className="font-semibold">Dinner</div>
                            <div className="text-gray-600">
                              {convertUTCToLocalTime(hours.dinnerStart)} -{" "}
                              {convertUTCToLocalTime(hours.dinnerEnd)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">No hours set</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
