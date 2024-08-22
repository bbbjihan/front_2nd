import { ScheduleTables } from "@/basic/Components/ScheduleTables";
import { ScheduleProvider } from "@/basic/Contexts/ScheduleContext";
import ScheduleDndProvider from "@/basic/Contexts/ScheduleDndProvider";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider>
      <ScheduleProvider>
        <ScheduleDndProvider>
          <ScheduleTables />
        </ScheduleDndProvider>
      </ScheduleProvider>
    </ChakraProvider>
  );
}

export default App;
