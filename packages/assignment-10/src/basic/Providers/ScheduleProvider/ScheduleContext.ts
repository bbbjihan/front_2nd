import { Schedule } from "@/basic/types";
import { createContext, useContext } from "react";

interface ScheduleContext {
  tableId: string;
  schedules: Array<Schedule>;
  updateSchedules: (schedules: Array<Schedule>) => void;
}
export const ScheduleContext = createContext<ScheduleContext | undefined>(
  undefined
);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error(
      "useScheduleContext must be used within a ScheduleProvider"
    );
  }
  return context;
};
