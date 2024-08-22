import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import dummyScheduleMap from "../../mocks/dummyScheduleMap";
import { Schedule } from "../../types";
import { ScheduleContext } from "./ScheduleContext";

interface Props extends PropsWithChildren {
  tableId: string;
}
const ScheduleProvider = ({ children, tableId }: Props) => {
  const [schedules, setSchedules] = useState(
    (dummyScheduleMap[
      tableId as keyof typeof dummyScheduleMap
    ] as Array<Schedule>) || []
  );

  const updateSchedules = useCallback(
    (newSchedules: Array<Schedule>) => setSchedules(newSchedules),
    []
  );

  const addSchedule = useCallback((schedule: Schedule) => {
    setSchedules((prevSchedules) => [...prevSchedules, schedule]);
  }, []);

  const value = useMemo(
    () => ({ tableId, schedules, updateSchedules, addSchedule }),
    [tableId, schedules, updateSchedules, addSchedule]
  );

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};

export default ScheduleProvider;
