import { fetchAllLectures } from "@/basic/apis";
import { useTimeTableContext } from "@/basic/Providers/TimeTableProvider/TimeTableContext";
import { Lecture, SearchInfo, SearchOption } from "@/basic/types";
import { parseSchedule } from "@/basic/utils";
import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import CreditCheckBoxGroup from "./Inputs/CreditCheckBoxGroup";
import DayCheckBoxGroup from "./Inputs/DayCheckBoxGroup";
import GradeOptions from "./Inputs/GradeOptions";
import MajorCheckBoxGroup from "./Inputs/MajorCheckBoxGroup";
import SearchBar from "./Inputs/SearchBar";
import TimeCheckBoxGroup from "./Inputs/TimeCheckBoxGroup";
import LectureTable from "./LectureTable/index";

interface Props {
  isOpen: boolean;
  searchInfo: SearchInfo | null;
  onClose: () => void;
}

const PAGE_SIZE = 100;

// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
const SearchDialog = ({ isOpen, searchInfo, onClose }: Props) => {
  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [page, setPage] = useState(1);
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: "",
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  const filteredLectures = useMemo(() => {
    const { query = "", credits, grades, days, times, majors } = searchOptions;
    return lectures
      .filter(
        (lecture) =>
          lecture.title.toLowerCase().includes(query.toLowerCase()) ||
          lecture.id.toLowerCase().includes(query.toLowerCase())
      )
      .filter(
        (lecture) => grades.length === 0 || grades.includes(lecture.grade)
      )
      .filter(
        (lecture) => majors.length === 0 || majors.includes(lecture.major)
      )
      .filter(
        (lecture) => !credits || lecture.credits.startsWith(String(credits))
      )
      .filter((lecture) => {
        if (days.length === 0) {
          return true;
        }
        const schedules = lecture.schedule
          ? parseSchedule(lecture.schedule)
          : [];
        return schedules.some((s) => days.includes(s.day));
      })
      .filter((lecture) => {
        if (times.length === 0) {
          return true;
        }
        const schedules = lecture.schedule
          ? parseSchedule(lecture.schedule)
          : [];
        return schedules.some((s) =>
          s.range.some((time) => times.includes(time))
        );
      });
  }, [lectures, searchOptions]);

  const lastPage = Math.ceil(filteredLectures.length / PAGE_SIZE);
  const visibleLectures = useMemo(
    () => filteredLectures.slice(0, page * PAGE_SIZE),
    [filteredLectures, page]
  );
  const allMajors = useMemo(
    () => [...new Set(lectures.map((lecture) => lecture.major))],
    [lectures]
  );

  const changeSearchOption = useCallback(
    (field: keyof SearchOption, value: SearchOption[typeof field]) => {
      setPage(1);
      setSearchOptions((prev) => ({ ...prev, [field]: value }));
      loaderWrapperRef.current?.scrollTo(0, 0);
    },
    []
  );

  const { appendAdditionalSchedule } = useTimeTableContext();
  const addNewSchedule = useCallback(
    (lecture: Lecture) => {
      if (!searchInfo) return;

      const { tableId } = searchInfo;

      const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
        ...schedule,
        lecture,
      }));

      appendAdditionalSchedule(tableId, schedules);

      onClose();
    },
    [searchInfo, onClose]
  );

  useEffect(() => {
    const start = performance.now();
    console.log("API 호출 시작: ", start);

    fetchAllLectures().then((results) => {
      const end = performance.now();
      console.log("모든 API 호출 완료 ", end);
      console.log("API 호출에 걸린 시간(ms): ", end - start);
      setLectures(results.flatMap((result) => result.data));
    });
  }, []);

  useEffect(() => {
    const $loader = loaderRef.current;
    const $loaderWrapper = loaderWrapperRef.current;

    if (!$loader || !$loaderWrapper) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => Math.min(lastPage, prevPage + 1));
        }
      },
      { threshold: 0, root: $loaderWrapper }
    );

    observer.observe($loader);

    return () => observer.unobserve($loader);
  }, [lastPage]);

  useEffect(() => {
    setSearchOptions((prev) => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    }));
    setPage(1);
  }, [searchInfo]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <SearchBar
                value={searchOptions.query}
                changeSearchOption={changeSearchOption}
              />
              <CreditCheckBoxGroup
                value={searchOptions.credits}
                changeSearchOption={changeSearchOption}
              />
            </HStack>

            <HStack spacing={4}>
              <GradeOptions
                value={searchOptions.grades}
                changeSearchOption={changeSearchOption}
              />
              <DayCheckBoxGroup
                value={searchOptions.days}
                changeSearchOption={changeSearchOption}
              />
            </HStack>

            <HStack spacing={4}>
              <TimeCheckBoxGroup
                value={searchOptions.times}
                changeSearchOption={changeSearchOption}
              />
              <MajorCheckBoxGroup
                value={searchOptions.majors}
                changeSearchOption={changeSearchOption}
                allMajors={allMajors}
              />
            </HStack>

            <Text align="right">검색결과: {filteredLectures.length}개</Text>
            <LectureTable
              visibleLectures={visibleLectures}
              addSchedule={addNewSchedule}
              loaderWrapperRef={loaderWrapperRef}
              loaderRef={loaderRef}
            />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default memo(SearchDialog);
