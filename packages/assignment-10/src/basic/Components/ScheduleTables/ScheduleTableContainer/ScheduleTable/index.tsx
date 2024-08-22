import { useScheduleContext } from "@/basic/Providers/ScheduleProvider/ScheduleContext";
import { useTimeTableContext } from "@/basic/Providers/TimeTableProvider/TimeTableContext";
import { TimeInfo } from "@/basic/types";
import { Box } from "@chakra-ui/react";
import { useDndContext } from "@dnd-kit/core";
import { memo, useCallback, useEffect, useMemo } from "react";
import DraggableSchedule from "./DraggableSchedule";
import ScheduleTableGrid from "./ScheduleTableGrid";

interface Props {
  tableId: string;
  onClickScheduleTime?: (timeInfo: TimeInfo) => void;
}

const ScheduleTable = ({ tableId, onClickScheduleTime }: Props) => {
  const {
    appendAdditionalSchedule,
    additionalSchedules,
    resetAdditionalSchedules,
    copySchedules,
    resetCopySchedules,
  } = useTimeTableContext();
  const { schedules, updateSchedules } = useScheduleContext();
  const getColor = useCallback(
    (lectureId: string): string => {
      const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
      const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
      return colors[lectures.indexOf(lectureId) % colors.length];
    },
    [schedules]
  );

  const dndContext = useDndContext();

  const activeTableId = useMemo(() => {
    const activeId = dndContext.active?.id;
    if (activeId) {
      return String(activeId).split(":")[0];
    }
    return null;
  }, [dndContext.active?.id]);

  const onClickDeleteSchedule = useCallback(
    ({ day, time }: TimeInfo) => {
      updateSchedules(
        schedules.filter(
          (schedule) => schedule.day !== day || !schedule.range.includes(time)
        )
      );
    },
    [updateSchedules, schedules]
  );

  useEffect(() => {
    if (!additionalSchedules) {
      return;
    }

    if (additionalSchedules.tableId !== tableId) {
      return;
    }

    updateSchedules([...schedules, ...additionalSchedules.schedules]);
    resetAdditionalSchedules();
  }, [additionalSchedules]);

  useEffect(() => {
    if (!copySchedules) {
      return;
    }

    if (copySchedules.from !== tableId) {
      return;
    }

    appendAdditionalSchedule(copySchedules.to, schedules);
    resetCopySchedules();
  }, [copySchedules]);

  return (
    <Box
      position="relative"
      outline={activeTableId === tableId ? "5px dashed" : undefined}
      outlineColor="blue.300"
    >
      <ScheduleTableGrid onClickScheduleTime={onClickScheduleTime} />

      {!!schedules &&
        schedules.length > 0 &&
        schedules.map((schedule, index) => (
          <DraggableSchedule
            key={`${schedule.lecture.title}-${index}`}
            id={`${tableId}:${index}`}
            data={schedule}
            bg={getColor(schedule.lecture.id)}
            onDeleteButtonClick={() =>
              onClickDeleteSchedule?.({
                day: schedule.day,
                time: schedule.range[0],
              })
            }
          />
        ))}
    </Box>
  );
};

export default memo(ScheduleTable);
