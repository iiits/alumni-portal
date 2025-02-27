import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReferralFilters } from "./types";
import { toast } from "sonner";

interface ReferralFilterProps {
  filters: ReferralFilters;
  setFilters: (filters: ReferralFilters) => void;
  onFilterChange: () => void;
  isChanged: boolean;
}

export default function ReferralFilter({
  filters,
  setFilters,
  onFilterChange,
  isChanged,
}: ReferralFilterProps) {
  const handleFilterChange = () => {
    if (filters.month !== "" && filters.year === "") {
      toast.warning("Please select a year for correct filtering");
      return;
    }
    onFilterChange();
  };
  const updateFilter = <K extends keyof ReferralFilters>(
    key: K,
    value: ReferralFilters[K],
  ) => {
    setFilters({ ...filters, [key]: value });
  };

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
          {[...Array(10)].map((_, i) => (
            <SelectItem
              key={i}
              value={(new Date().getFullYear() - i).toString()}
            >
              {new Date().getFullYear() - i}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={handleFilterChange} disabled={!isChanged}>
        Apply Filters
      </Button>
    </div>
  );
}
