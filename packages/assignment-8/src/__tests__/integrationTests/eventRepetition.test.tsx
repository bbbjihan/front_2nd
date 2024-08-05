import { createHandlers } from "@/mocks/mockServiceWorker/handlers";
import { Event } from "@/types";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import Scheduler from "../../Scheduler";
import { expectEventListHasEvent, typeEventForm } from "../testModules";

let server = setupServer(...createHandlers());

beforeEach(() => {
  const fakeTime = new Date("2024-07-25T08:00:00Z");
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(fakeTime);
});

afterEach(() => {
  vi.useRealTimers();
  server.close();
});

describe("반복 일정 테스트", () => {
  describe("일정 생성 또는 수정 시 일정 반복 설정값들을 선택 및 입력할 수 있다.", () => {
    beforeEach(() => {
      server = setupServer(...createHandlers());
      server.listen();
    });

    test("event form에 일정 반복 설정을 위한 요소들이 존재한다.", async () => {
      render(<Scheduler />);

      const $repetitionCheckBox = screen.getByLabelText("반복 설정");

      expect(document.body).toContainElement($repetitionCheckBox);
      await userEvent.click($repetitionCheckBox);

      const $repetitionType = screen.getByLabelText("반복 유형");
      const $repetitionInterval = screen.getByLabelText("반복 간격");
      const $repetitionEndDate = screen.getByLabelText("반복 종료일");

      expect(document.body).toContainElement($repetitionType);
      expect(document.body).toContainElement($repetitionInterval);
      expect(document.body).toContainElement($repetitionEndDate);
    });

    test("event form에 일정 반복 설정의 위한 요소들이 반복 유형에 따라 다르게 렌더링된다.", async () => {
      render(<Scheduler />);

      const $repetitionCheckBox = screen.getByLabelText("반복 설정");

      expect(document.body).toContainElement($repetitionCheckBox);
      await userEvent.click($repetitionCheckBox);

      const $repetitionType = screen.getByLabelText("반복 유형");
      await userEvent.selectOptions($repetitionType, "weekly");
      const $weekdaySelector = screen.getByLabelText("요일 설정");
      expect(document.body).toContainElement($weekdaySelector);

      await userEvent.selectOptions($repetitionType, "monthly");
      expect(document.body).not.toContainElement($weekdaySelector);
      const $monthdaySelector = screen.getByLabelText("날짜 설정");
      expect(document.body).toContainElement($monthdaySelector);
      const $monthRepetitionWeekSelector =
        screen.getByLabelText("주 기준 반복 설정");
      expect(document.body).toContainElement($monthRepetitionWeekSelector);

      await userEvent.selectOptions($repetitionType, "daily");
      expect(document.body).not.toContainElement($monthdaySelector);
      expect(document.body).not.toContainElement($monthRepetitionWeekSelector);
    });
  });

  describe("반복 일정 생성", () => {
    beforeEach(() => {
      server = setupServer(...createHandlers([]));
      server.listen();
    });

    describe("반복 일정 생성 시 설정한 반복 유형과 반복 주기에 따라 반복 일정이 생성된다.", async () => {
      test("일 단위 반복 일정 테스트", async () => {
        render(<Scheduler />);
        const testEvent: Omit<Event, "id"> = {
          title: "반복 일정 생성 테스트",
          date: "2024-07-01",
          startTime: "12:00",
          endTime: "12:30",
          description: "daily scrum",
          location: "회의실",
          category: "개인",
          repeat: { type: "daily", interval: 2 },
          notificationTime: 10,
        };

        await typeEventForm(testEvent);
        await userEvent.click(screen.getByTestId("event-submit-button"));
        await expectEventListHasEvent(testEvent);
        await expectEventListHasEvent({ ...testEvent, date: "2024-07-03" });
        await expectEventListHasEvent({ ...testEvent, date: "2024-07-05" });
        await expectEventListHasEvent({ ...testEvent, date: "2024-07-07" });
        await expectEventListHasEvent({ ...testEvent, date: "2024-07-09" });
        await expectEventListHasEvent({ ...testEvent, date: "2024-07-11" });
        await expectEventListHasEvent({ ...testEvent, date: "2024-07-13" });
        await expectEventListHasEvent({ ...testEvent, date: "2024-07-15" });
        await expectEventListHasEvent({ ...testEvent, date: "2024-07-17" });
      });

      test("주 단위 반복 일정 테스트", async () => {
        render(<Scheduler />);
        const testEvent: Omit<Event, "id"> = {
          title: "반복 일정 생성 테스트",
          date: "2024-07-01",
          startTime: "14:00",
          endTime: "14:30",
          description: "weekly meeting",
          location: "회의실",
          category: "개인",
          repeat: { type: "weekly", interval: 2 },
          notificationTime: 10,
        };

        await typeEventForm(testEvent);
        await userEvent.click(screen.getByTestId("event-submit-button"));
        await expectEventListHasEvent(testEvent);
        await expectEventListHasEvent({ ...testEvent, date: "2024-07-15" });
        await expectEventListHasEvent({ ...testEvent, date: "2024-07-29" });

        const $nextButton = screen.getByRole("button", {
          name: /next/i,
        });

        await userEvent.click($nextButton);
        await expectEventListHasEvent({ ...testEvent, date: "2024-08-12" });
      });

      test("월 단위 반복 일정 테스트", async () => {
        render(<Scheduler />);
        const testEvent: Omit<Event, "id"> = {
          title: "반복 일정 생성 테스트",
          date: "2024-07-01",
          startTime: "10:00",
          endTime: "12:00",
          description: "월간 업무 보고",
          location: "회의실",
          category: "개인",
          repeat: { type: "monthly", interval: 2 },
          notificationTime: 10,
        };

        await typeEventForm(testEvent);
        await userEvent.click(screen.getByTestId("event-submit-button"));
        await expectEventListHasEvent(testEvent);

        const $nextButton = screen.getByRole("button", {
          name: /next/i,
        });

        await userEvent.click($nextButton);
        await expectEventListHasEvent({ ...testEvent, date: "2024-08-01" });

        await userEvent.click($nextButton);
        await expectEventListHasEvent({ ...testEvent, date: "2024-09-01" });

        await userEvent.click($nextButton);
        await expectEventListHasEvent({ ...testEvent, date: "2024-10-01" });
        await userEvent.click($nextButton);

        await expectEventListHasEvent({ ...testEvent, date: "2024-11-01" });
        await userEvent.click($nextButton);
      });

      test("연 단위 반복 일정 테스트", async () => {
        render(<Scheduler />);
        const testEvent: Omit<Event, "id"> = {
          title: "반복 일정 생성 테스트",
          date: "2024-07-29",
          startTime: "00:01",
          endTime: "23:59",
          description: "지한 생일파티",
          location: "지한이네",
          category: "개인",
          repeat: { type: "yearly", interval: 2 },
          notificationTime: 10,
        };

        await typeEventForm(testEvent);
        await userEvent.click(screen.getByTestId("event-submit-button"));
        await expectEventListHasEvent(testEvent);

        const $calendarHeader = screen.getByRole("heading", {
          name: /2024년 7월/,
        });

        const $nextButton = screen.getByRole("button", {
          name: /next/i,
        });

        await userEvent.click($nextButton);
        while (!$calendarHeader.innerHTML.includes("7월")) {
          await userEvent.click($nextButton);
        }
        const $eventList = screen.getByTestId("event-list");
        expect($eventList).not.toHaveTextContent("반복 일정 생성 테스트");

        await userEvent.click($nextButton);
        while (!$calendarHeader.innerHTML.includes("7월")) {
          await userEvent.click($nextButton);
        }
        await expectEventListHasEvent(testEvent);
      });
    });

    describe("반복 일정으로 생성된 일정은 반복 일정이 아닌 다른 일정과 시각적으로 구분되어야 한다.", () => {});
  });

  describe("선택한 반복 유형에 따라 여러 옵션이 나타나며, 설정값에 따라 반복 일정이 생성된다.", () => {
    describe("일간 반복을 선택할 경우 반복 간격에 따라 반복 일정이 생성된다.", () => {});

    describe("주간 반복을 선택한 경우", () => {
      describe("반복 간격에 따라 반복 일정이 생성된다.", () => {});
      describe("특정 요일을 선택하여 주기마다 그 요일에 반복 일정을 생성할 수 있다.", () => {});
    });

    describe("월간 반복을 선택한 경우", () => {
      describe("매월 특정 날짜에 반복되도록 설정할 수 있다.", () => {});
      describe("매월 특정 주차의 특정 요일에 반복되도록 설정할 수 있다.", () => {});
    });
  });

  describe("반복 일정 중 특정 날짜의 일정을 수정 및 삭제할 수 있다.", () => {
    describe("반복 일정 중 부모 일정을 수정 및 삭제할 경우 모든 일정이 수정 및 삭제된다.", () => {});

    describe("반복 일정 중 자식 일정을 수정 및 삭제할 경우 그 일정에만 반영할 것인지 전체 반복 일정에 반영할 것인지 선택할 수 있다.", () => {
      describe("그 일정에만 반영한다고 선택할 경우 반복 일정 중 그 일정에만 수정 및 삭제가 반영된다.", () => {});

      describe("전체 반복 일정에 반영할 것이라 선택한 경우 같은 부모 일정을 가진 반복 일정에 대해 모두 수정 및 삭제가 반영된다.", () => {});
    });
  });
});
