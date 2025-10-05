/**
 * DataTableFilter - Individual filter component
 *
 * Renders different filter types:
 * - select: Single choice dropdown
 * - multi-select: Multiple choice with checkboxes
 * - date-range: Date range picker
 * - number-range: Min/max inputs
 * - boolean: Toggle switch
 */

import { useTableParams } from "@/hooks/use-table-params";
import type { FilterDef } from "./types";

interface DataTableFilterProps {
  filter: FilterDef;
}

export function DataTableFilter({ filter }: DataTableFilterProps) {
  const { filters, setFilter } = useTableParams();

  const currentValue = filters[filter.key];

  // Select filter
  if (filter.type === "select") {
    return (
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          {filter.label}:
        </label>
        <select
          value={(currentValue as string) || ""}
          onChange={(e) => setFilter(filter.key, e.target.value || null)}
          className="block rounded-md border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:border-indigo-500 focus:ring-indigo-500">
          <option value="">All</option>
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Multi-select filter (simplified - uses comma-separated values)
  if (filter.type === "multi-select") {
    const selectedValues = Array.isArray(currentValue)
      ? currentValue
      : currentValue
      ? [currentValue as string]
      : [];

    return (
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          {filter.label}:
        </label>
        <div className="relative">
          <select
            multiple
            value={selectedValues}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions).map(
                (o) => o.value
              );
              setFilter(filter.key, values.length > 0 ? values : null);
            }}
            className="block rounded-md border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            size={Math.min(filter.options.length + 1, 5)}>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {selectedValues.includes(option.value) ? "✓ " : ""}
                {option.label}
              </option>
            ))}
          </select>
          {selectedValues.length > 0 && (
            <button
              type="button"
              onClick={() => setFilter(filter.key, null)}
              className="absolute top-1 right-1 rounded bg-gray-200 px-1.5 py-0.5 text-xs hover:bg-gray-300">
              Clear
            </button>
          )}
        </div>
      </div>
    );
  }

  // Boolean filter
  if (filter.type === "boolean") {
    const isChecked = currentValue === "true";

    return (
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) =>
              setFilter(filter.key, e.target.checked ? "true" : null)
            }
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          {filter.label}
        </label>
      </div>
    );
  }

  // Date range filter (basic implementation)
  if (filter.type === "date-range") {
    const [startDate, endDate] = Array.isArray(currentValue)
      ? currentValue
      : currentValue
      ? (currentValue as string).split(",")
      : ["", ""];

    return (
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          {filter.label}:
        </label>
        <div className="flex items-center gap-1">
          <input
            type="date"
            value={startDate || ""}
            onChange={(e) => {
              const newStart = e.target.value;
              if (newStart || endDate) {
                setFilter(filter.key, [newStart, endDate].filter(Boolean));
              } else {
                setFilter(filter.key, null);
              }
            }}
            className="block rounded-md border-gray-300 py-1.5 px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={endDate || ""}
            onChange={(e) => {
              const newEnd = e.target.value;
              if (startDate || newEnd) {
                setFilter(filter.key, [startDate, newEnd].filter(Boolean));
              } else {
                setFilter(filter.key, null);
              }
            }}
            className="block rounded-md border-gray-300 py-1.5 px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    );
  }

  // Number range filter
  if (filter.type === "number-range") {
    const [min, max] = Array.isArray(currentValue)
      ? currentValue
      : currentValue
      ? (currentValue as string).split(",")
      : ["", ""];

    return (
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          {filter.label}:
        </label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            placeholder="Min"
            value={min || ""}
            min={filter.min}
            max={filter.max}
            step={filter.step}
            onChange={(e) => {
              const newMin = e.target.value;
              if (newMin || max) {
                setFilter(filter.key, [newMin, max].filter(Boolean));
              } else {
                setFilter(filter.key, null);
              }
            }}
            className="block w-24 rounded-md border-gray-300 py-1.5 px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max"
            value={max || ""}
            min={filter.min}
            max={filter.max}
            step={filter.step}
            onChange={(e) => {
              const newMax = e.target.value;
              if (min || newMax) {
                setFilter(filter.key, [min, newMax].filter(Boolean));
              } else {
                setFilter(filter.key, null);
              }
            }}
            className="block w-24 rounded-md border-gray-300 py-1.5 px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    );
  }

  return null;
}
