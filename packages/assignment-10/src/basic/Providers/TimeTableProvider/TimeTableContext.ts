import { Schedule } from "@/basic/types";
import { createContext, useContext } from "react";

interface TimeTableContext {
  tableIds: Array<string>;
  addTable: (tableId: string) => void;
  removeTable: (tableId: string) => void;
  duplicateTable: (tableId: string) => void;
  additionalSchedules:
    | {
        tableId: string;
        schedules: Array<Schedule>;
      }
    | undefined;
  resetAdditionalSchedules: () => void;
  copySchedules:
    | {
        from: string;
        to: string;
      }
    | undefined;
  resetCopySchedules: () => void;
  appendAdditionalSchedule: (
    tableId: string,
    schedules: Array<Schedule>
  ) => void;
}

export const TimeTableContext = createContext<TimeTableContext | undefined>(
  undefined
);

export const useTimeTableContext = () => {
  const context = useContext(TimeTableContext);
  if (context === undefined) {
    throw new Error(
      "useTimTableContext must be used within a TimeTableProvider"
    );
  }
  return context;
};
