import SearchDialog from "@/basic/Components/SearchDialog";
import { useTimeTableContext } from "@/basic/Providers/TimeTableProvider/TimeTableContext";
import { SearchInfo } from "@/basic/types";
import { Flex } from "@chakra-ui/react";
import { memo, useCallback, useMemo, useState } from "react";
import ScheduleTableContainer from "./ScheduleTableContainer";

const ScheduleTables = () => {
  const { tableIds } = useTimeTableContext();
  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const disabledRemoveButton = useMemo(
    () => Object.keys(tableIds).length === 1,
    [tableIds]
  );

  const openDialog = useCallback(() => setIsDialogOpen(true), []);
  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableIds.map((tableId, index) => (
          <ScheduleTableContainer
            key={`table-${index}-${tableId}`}
            tableId={tableId}
            index={index}
            disabledRemoveButton={disabledRemoveButton}
            setSearchInfo={setSearchInfo}
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

export default memo(ScheduleTables);
