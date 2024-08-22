import SearchDialog from "@/basic/Components/SearchDialog";
import { useScheduleContext } from "@/basic/Contexts/ScheduleContext";
import { SearchInfo } from "@/basic/types";
import { Flex } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import ScheduleTableContainer from "./ScheduleTableContainer";

export const ScheduleTables = () => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const disabledRemoveButton = useMemo(
    () => Object.keys(schedulesMap).length === 1,
    [schedulesMap]
  );

  const openDialog = useCallback(() => setIsDialogOpen(true), []);
  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <ScheduleTableContainer
            tableId={tableId}
            schedules={schedules}
            index={index}
            disabledRemoveButton={disabledRemoveButton}
            setSearchInfo={setSearchInfo}
            setSchedulesMap={setSchedulesMap}
            openDialog={openDialog}
          />
        ))}
      </Flex>
      <SearchDialog
        isOpen={isDialogOpen}
        searchInfo={searchInfo}
        onClose={closeDialog}
      />
    </>
  );
};
