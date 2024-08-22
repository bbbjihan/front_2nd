import dummyScheduleMap from "@/basic/mocks/dummyScheduleMap";
import { Schedule } from "@/basic/types";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { TimeTableContext } from "./TimeTableContext";

export const TimeTableProvider = ({ children }: PropsWithChildren) => {
  const [tableIds, setTableIds] = useState<Array<string>>(
    Object.keys(dummyScheduleMap)
  );
  const [additionalSchedules, setAdditionalSchedules] = useState<{
    tableId: string;
    schedules: Array<Schedule>;
  }>();
  const resetAdditionalSchedules = useCallback(
    () => setAdditionalSchedules(undefined),
    []
  );

  const [copySchedules, setCopyScheuldes] = useState<{
    from: string;
    to: string;
  }>();
  const resetCopySchedules = useCallback(() => setCopyScheuldes(undefined), []);

  const addTable = useCallback(
    (tableId: string) => setTableIds((prev) => [...prev, tableId]),
    []
  );

  const removeTable = useCallback(
    (tableId: string) =>
      setTableIds((prev) => prev.filter((id) => id !== tableId)),
    []
  );

  const appendAdditionalSchedule = useCallback(
    (tableId: string, schedules: Array<Schedule>) => {
      setAdditionalSchedules({ tableId, schedules });
    },
    []
  );

  const duplicateTable = useCallback((tableId: string) => {
    const newTableId = crypto.randomUUID();
    setTableIds((prev) => [...prev, newTableId]);
    setCopyScheuldes({ from: tableId, to: newTableId });
  }, []);

  const value = useMemo(
    () => ({
      tableIds,
      addTable,
      removeTable,
      duplicateTable,
      additionalSchedules,
      resetAdditionalSchedules,
      copySchedules,
      resetCopySchedules,
      appendAdditionalSchedule,
    }),
    [
      tableIds,
      addTable,
      removeTable,
      duplicateTable,
      additionalSchedules,
      resetAdditionalSchedules,
      copySchedules,
      resetCopySchedules,
      appendAdditionalSchedule,
    ]
  );

  return (
    <TimeTableContext.Provider value={value}>
      {children}
    </TimeTableContext.Provider>
  );
};
