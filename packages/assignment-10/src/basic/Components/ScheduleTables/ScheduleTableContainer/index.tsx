import ScheduleTable from "@/basic/Components/ScheduleTables/ScheduleTableContainer/ScheduleTable";
import ScheduleDndProvider from "@/basic/Providers/ScheduleDndProvider";
import ScheduleProvider from "@/basic/Providers/ScheduleProvider/ScheduleProvider";
import { useTimeTableContext } from "@/basic/Providers/TimeTableProvider/TimeTableContext";
import { SearchInfo, TimeInfo } from "@/basic/types";
import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import { Dispatch, memo, SetStateAction, useCallback } from "react";

interface Props {
  tableId: string;
  index: number;
  disabledRemoveButton: boolean;
  setSearchInfo: Dispatch<SetStateAction<SearchInfo | null>>;
  openDialog: () => void;
}
const ScheduleTableContainer = ({
  tableId,
  index,
  disabledRemoveButton,
  setSearchInfo,
  openDialog,
}: Props) => {
  const { removeTable, duplicateTable } = useTimeTableContext();

  const onClickAddTable = useCallback(() => {
    setSearchInfo({ tableId });
    openDialog();
  }, [setSearchInfo, tableId, openDialog]);

  const onClickDuplicateTable = useCallback(() => {
    duplicateTable(tableId);
  }, [duplicateTable, tableId]);

  const onClickRemoveTable = useCallback(() => {
    removeTable(tableId);
  }, [removeTable, tableId]);

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

      <ScheduleProvider tableId={tableId}>
        <ScheduleDndProvider>
          <ScheduleTable
            key={`schedule-table-${index}`}
            tableId={tableId}
            onClickScheduleTime={onClickScheduleTime}
          />
        </ScheduleDndProvider>
      </ScheduleProvider>
    </Stack>
  );
};

export default memo(ScheduleTableContainer);
