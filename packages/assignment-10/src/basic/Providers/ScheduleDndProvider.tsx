import { CellSize, DAY_LABELS } from "@/basic/constants";
import {
  DndContext,
  DragEndEvent,
  Modifier,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { PropsWithChildren, useCallback } from "react";
import { useScheduleContext } from "./ScheduleProvider/ScheduleContext";

function createSnapModifier(): Modifier {
  return ({ transform, containerNodeRect, draggingNodeRect }) => {
    const containerTop = containerNodeRect?.top ?? 0;
    const containerLeft = containerNodeRect?.left ?? 0;
    const containerBottom = containerNodeRect?.bottom ?? 0;
    const containerRight = containerNodeRect?.right ?? 0;

    const { top = 0, left = 0, bottom = 0, right = 0 } = draggingNodeRect ?? {};

    const minX = containerLeft - left + 120 + 1;
    const minY = containerTop - top + 40 + 1;
    const maxX = containerRight - right;
    const maxY = containerBottom - bottom;

    const snappedX = Math.min(
      Math.max(Math.round(transform.x / CellSize.WIDTH) * CellSize.WIDTH, minX),
      maxX
    );
    const snappedY = Math.min(
      Math.max(
        Math.round(transform.y / CellSize.HEIGHT) * CellSize.HEIGHT,
        minY
      ),
      maxY
    );

    return {
      ...transform,
      x: snappedX,
      y: snappedY,
    };
  };
}

const modifiers = [createSnapModifier()];

export default function ScheduleDndProvider({ children }: PropsWithChildren) {
  const { tableId, schedules, updateSchedules } = useScheduleContext();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event;
      if (!active || !active.id || typeof active.id !== "string") {
        return;
      }

      const { x, y } = delta;
      const [draggingTableId, draggingIndex] = (active.id as string).split(":");

      if (draggingTableId !== tableId || isNaN(parseInt(draggingIndex))) {
        return;
      }

      const moveDayIndex = Math.floor(x / 80);
      const moveTimeIndex = Math.floor(y / 30);

      if (!schedules || !schedules.map) {
        return;
      }
      const updatedSchedules = schedules.map((schedule, scheduleIndex) => {
        if (scheduleIndex !== parseInt(draggingIndex)) return schedule;

        const prevDayIndex = DAY_LABELS.indexOf(
          schedule.day as (typeof DAY_LABELS)[number]
        );
        const newDayIndex =
          (prevDayIndex + moveDayIndex + DAY_LABELS.length) % DAY_LABELS.length;
        const day = DAY_LABELS[newDayIndex];
        const range = schedule.range.map((time) => time + moveTimeIndex);

        return { ...schedule, day, range };
      });

      updateSchedules(updatedSchedules);
    },
    [schedules, tableId, updateSchedules]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      modifiers={modifiers}
    >
      {children}
    </DndContext>
  );
}
