import { describe, test } from "vitest";

describe("시나리오 테스트1", () => {
  test("사용자는 매주 월요일 오전 10시에 있는 팀 회의를 캘린더에 등록하려고 한다.", () => {});
  test("사용자는 새 일정 추가 버튼을 클릭하고 다음과 같이 정보를 입력한다:", () => {});
  test('반복 설정에서 "매주"를 선택하고, 반복 간격을 1주로 설정한다.', () => {});
  test('요일 선택에서 "월요일"을 선택한다.', () => {});
  test('반복 종료 조건으로 "종료일 지정"을 선택하고, 2024년 12월 31일로 설정한다.', () => {});
  test('알림 설정을 "10분 전"으로 선택한다.', () => {});
  test("일정을 저장하면, 캘린더에 2024년 7월 1일부터 12월 30일까지 매주 월요일마다 해당 회의가 표시된다.", () => {});
  test("9월부터 회의 시간이 30분 연장되어, 사용자는 9월 이후의 모든 회의 시간을 수정하려고 한다.", () => {});
  test('9월 2일 일정을 선택하고 "이후 모든 일정 수정" 옵션을 선택한 후, 종료 시간을 오전 11:30으로 변경한다.', () => {});
  test("변경 사항을 저장하면, 9월 2일부터 12월 30일까지의 모든 회의 일정이 10:00-11:30으로 업데이트된다.", () => {});
  test("9월 셋째 주 월요일이 공휴일(2024년 9월 16일, 추석)이라는 것을 알게 된 김철수는 해당 날짜의 회의를 취소하려고 한다.", () => {});
  test('9월 16일 일정을 선택하고 "이 일정만 삭제" 옵션을 선택하여 해당 날짜의 회의만 취소한다.', () => {});
});
