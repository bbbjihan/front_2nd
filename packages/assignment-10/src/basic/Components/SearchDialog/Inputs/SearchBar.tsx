import { SearchOption } from "@/basic/types";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { memo } from "react";

interface Props {
  changeSearchOption: (
    field: keyof SearchOption,
    value: SearchOption[typeof field]
  ) => void;
  value: string | undefined;
}
const SearchBar = ({ value, changeSearchOption }: Props) => {
  return (
    <FormControl>
      <FormLabel>검색어</FormLabel>
      <Input
        placeholder="과목명 또는 과목코드"
        value={value}
        onChange={(e) => changeSearchOption("query", e.target.value)}
      />
    </FormControl>
  );
};

export default memo(SearchBar);
