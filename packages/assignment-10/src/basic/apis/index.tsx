import { Lecture } from "@/basic/types";
import axios from "axios";

function attachCache<T>(fetch: () => Promise<T>): () => Promise<T> {
  let cache: T | undefined;

  return async function () {
    if (!cache) {
      cache = await fetch();
    }

    return cache;
  };
}

const fetchMajors = attachCache(() =>
  axios.get<Lecture[]>("/schedules-majors.json")
);
const fetchLiberalArts = attachCache(() =>
  axios.get<Lecture[]>("/schedules-liberal-arts.json")
);

// TODO: 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해주세요.
export const fetchAllLectures = async () =>
  await Promise.all([
    (console.log("API Call 1", performance.now()), fetchMajors()),
    (console.log("API Call 2", performance.now()), fetchLiberalArts()),
    (console.log("API Call 3", performance.now()), fetchMajors()),
    (console.log("API Call 4", performance.now()), fetchLiberalArts()),
    (console.log("API Call 5", performance.now()), fetchMajors()),
    (console.log("API Call 6", performance.now()), fetchLiberalArts()),
  ]);