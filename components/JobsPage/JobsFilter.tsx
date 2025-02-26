import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "../ui/multi-select";
import { JobFilters } from "./types";

interface JobsFilterProps {
  filters: JobFilters;
  setFilters: (filters: JobFilters) => void;
  onFilterChange: () => void;
  isChanged: boolean;
}

export default function JobsFilter({
  filters,
  setFilters,
  onFilterChange,
  isChanged,
}: JobsFilterProps) {
  const updateFilter = <K extends keyof JobFilters>(
    key: K,
    value: JobFilters[K],
  ) => {
    setFilters({ ...filters, [key]: value });
  };

  const currentYear = new Date().getFullYear();
  const years = [...Array(currentYear + 5 - 2014 + 1)].map((_, i) =>
    (currentYear + 5 - i).toString(),
  );

  const batchOptions = years.map((year) => ({
    id: year,
    name: year,
  }));

  return (
    <div className="mb-4 flex gap-4 flex-wrap">
      <Select
        value={filters.month === "" ? "all" : filters.month.toString()}
        onValueChange={(v) =>
          updateFilter("month", v === "all" ? "" : Number(v))
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Month" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Upcoming Months</SelectItem>
          {[...Array(12)].map((_, i) => (
            <SelectItem key={i + 1} value={(i + 1).toString()}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.year === "" ? "all" : filters.year.toString()}
        onValueChange={(v) =>
          updateFilter("year", v === "all" ? "" : Number(v))
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Upcoming Years</SelectItem>
          {[...Array(new Date().getFullYear() - 2014 + 1)].map((_, i) => (
            <SelectItem
              key={i}
              value={(new Date().getFullYear() - i).toString()}
            >
              {new Date().getFullYear() - i}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.type === "" ? "all" : filters.type}
        onValueChange={(v) => updateFilter("type", v === "all" ? "" : v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Job Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="fulltime">Full Time</SelectItem>
          <SelectItem value="parttime">Part Time</SelectItem>
          <SelectItem value="internship">Internship</SelectItem>
          <SelectItem value="others">Others</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.workType === "" ? "all" : filters.workType}
        onValueChange={(v) => updateFilter("workType", v === "all" ? "" : v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Work Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Work Types</SelectItem>
          <SelectItem value="onsite">On-site</SelectItem>
          <SelectItem value="remote">Remote</SelectItem>
          <SelectItem value="hybrid">Hybrid</SelectItem>
        </SelectContent>
      </Select>

      <div className="w-[180px]">
        <MultiSelect
          options={batchOptions}
          selected={filters.batch}
          onChange={(selected) => updateFilter("batch", selected)}
          placeholder="Select batches"
        />
      </div>

      <Button onClick={onFilterChange} disabled={!isChanged}>
        Apply Filters
      </Button>
    </div>
  );
}
