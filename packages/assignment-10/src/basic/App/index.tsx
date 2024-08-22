import { TimeTableProvider } from "@/basic/Providers/TimeTableProvider/TimeTableProvider";
import { ChakraProvider } from "@chakra-ui/react";
import ScheduleTables from "../Components/ScheduleTables";

function App() {
  return (
    <ChakraProvider>
      <TimeTableProvider>
        <ScheduleTables />
      </TimeTableProvider>
    </ChakraProvider>
  );
}

export default App;
