import { SearchOption } from "@/basic/types";
import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
} from "@chakra-ui/react";
import { memo } from "react";

interface Props {
  changeSearchOption: (
    field: keyof SearchOption,
    value: SearchOption[typeof field]
  ) => void;
  value: number[] | undefined;
}
const GradeOptions = ({ value, changeSearchOption }: Props) => {
  return (
    <FormControl>
      <FormLabel>학년</FormLabel>
      <CheckboxGroup
        value={value}
        onChange={(value) => changeSearchOption("grades", value.map(Number))}
      >
        <HStack spacing={4}>
          {[1, 2, 3, 4].map((grade) => (
            <Checkbox key={grade} value={grade}>
              {grade}학년
            </Checkbox>
          ))}
        </HStack>
      </CheckboxGroup>
    </FormControl>
  );
};

export default memo(GradeOptions);
