import ScheduleTable from "@/basic/Components/ScheduleTables/ScheduleTableContainer/ScheduleTable";
import { Schedule, SearchInfo, TimeInfo } from "@/basic/types";
import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import { Dispatch, memo, SetStateAction, useCallback } from "react";

interface Props {
  tableId: string;
  schedules: Schedule[];
  index: number;
  disabledRemoveButton: boolean;
  setSearchInfo: Dispatch<SetStateAction<SearchInfo | null>>;
  setSchedulesMap: Dispatch<SetStateAction<Record<string, Schedule[]>>>;
  openDialog: () => void;
}
const ScheduleTableContainer = ({
  tableId,
  schedules,
  index,
  disabledRemoveButton,
  setSearchInfo,
  setSchedulesMap,
  openDialog,
}: Props) => {
  const onClickAddTable = useCallback(
    () => setSearchInfo({ tableId }),
    [setSearchInfo, tableId]
  );

  const onClickDuplicateTable = useCallback(() => {
    setSchedulesMap((prev) => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[tableId]],
    }));
  }, [setSchedulesMap, tableId]);

  const onClickRemoveTable = useCallback(() => {
    setSchedulesMap((prev) => {
      delete prev[tableId];
      return { ...prev };
    });
  }, [setSchedulesMap, tableId]);

  const onClickDeleteSchedule = useCallback(
    ({ day, time }: TimeInfo) =>
      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: prev[tableId].filter(
          (schedule) => schedule.day !== day || !schedule.range.includes(time)
        ),
      })),
    [setSchedulesMap, tableId]
  );

  const onClickScheduleTime = useCallback(
    (timeInfo: TimeInfo) => {
      setSearchInfo({ tableId, ...timeInfo });
      openDialog();
    },
    [setSearchInfo, tableId, openDialog]
  );

  return (
    <Stack key={tableId} width="600px">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" fontSize="lg">
          시간표 {index + 1}
        </Heading>
        <ButtonGroup size="sm" isAttached>
          <Button colorScheme="green" onClick={onClickAddTable}>
            시간표 추가
          </Button>
          <Button colorScheme="green" mx="1px" onClick={onClickDuplicateTable}>
            복제
          </Button>
          <Button
            colorScheme="green"
            isDisabled={disabledRemoveButton}
            onClick={onClickRemoveTable}
          >
            삭제
          </Button>
        </ButtonGroup>
      </Flex>

      <ScheduleTable
        key={`schedule-table-${index}`}
        schedules={schedules}
        tableId={tableId}
        onClickScheduleTime={onClickScheduleTime}
        onDeleteButtonClick={onClickDeleteSchedule}
      />
    </Stack>
  );
};

export default memo(ScheduleTableContainer);
