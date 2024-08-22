import { Schedule, TimeInfo } from "@/basic/types";
import { Box } from "@chakra-ui/react";
import { useDndContext } from "@dnd-kit/core";
import { memo, useCallback, useMemo } from "react";
import DraggableSchedule from "./DraggableSchedule";
import ScheduleTableGrid from "./ScheduleTableGrid";

interface Props {
  tableId: string;
  schedules: Schedule[];
  onClickScheduleTime?: (timeInfo: TimeInfo) => void;
  onDeleteButtonClick?: (timeInfo: TimeInfo) => void;
}

const ScheduleTable = ({
  tableId,
  schedules,
  onClickScheduleTime,
  onDeleteButtonClick,
}: Props) => {
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

  return (
    <Box
      position="relative"
      outline={activeTableId === tableId ? "5px dashed" : undefined}
      outlineColor="blue.300"
    >
      <ScheduleTableGrid onClickScheduleTime={onClickScheduleTime} />

      {schedules.map((schedule, index) => (
        <DraggableSchedule
          key={`${schedule.lecture.title}-${index}`}
          id={`${tableId}:${index}`}
          data={schedule}
          bg={getColor(schedule.lecture.id)}
          onDeleteButtonClick={() =>
            onDeleteButtonClick?.({
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
