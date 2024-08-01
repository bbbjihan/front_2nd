import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import App from "../App";
import events from "../mocks/mockdata/events";
import { createHandlers } from "../mocks/mockServiceWorker/handlers";
import { Event } from "../types";

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

describe("일정 관리 애플리케이션 통합 테스트", () => {
  describe("일정 CRUD 및 기본 기능", () => {
    beforeEach(() => {
      server = setupServer(...createHandlers());
      server.listen();
    });

    test("[mock up] 일정의 초기 값을 서버에서 잘 받아올 수 있다.", async () => {
      render(<App />);
      const initEventTexts: Array<string> = [];
      events
        .filter((event) => event.title !== "알림 테스트")
        .forEach((event) => {
          initEventTexts.push(event.title);
          initEventTexts.push(event.date);
          initEventTexts.push(event.startTime);
          initEventTexts.push(event.endTime);
          initEventTexts.push(event.description);
          initEventTexts.push(event.location);
          initEventTexts.push(event.category);
        });

      const $eventList = await screen.findByTestId("event-list");
      initEventTexts.forEach((text) =>
        expect($eventList).toHaveTextContent(text)
      );
    });

    test("[CREATE] form을 통해 새로운 일정을 생성하였을 때 이벤트 리스트에서 생성된 이벤트를 확인할 수 있다.", async () => {
      render(<App />);
      const testEvent: Omit<Event, "id"> = {
        title: "CREATE 테스트 이벤트",
        date: "2024-07-29",
        startTime: "00:01",
        endTime: "23:59",
        description: "지한 생일파티",
        location: "지한이네",
        category: "개인",
        repeat: { type: "yearly", interval: 1 },
        notificationTime: 10,
      };
      await userEvent.type(screen.getByLabelText("제목"), testEvent.title);
      await userEvent.type(screen.getByLabelText("날짜"), testEvent.date);
      await userEvent.type(
        screen.getByLabelText("시작 시간"),
        testEvent.startTime
      );
      await userEvent.type(
        screen.getByLabelText("종료 시간"),
        testEvent.endTime
      );
      await userEvent.type(
        screen.getByLabelText("설명"),
        testEvent.description
      );
      await userEvent.type(screen.getByLabelText("위치"), testEvent.location);
      await userEvent.type(
        screen.getByLabelText("카테고리"),
        testEvent.category
      );
      await userEvent.click(screen.getByTestId("event-submit-button"));

      const $eventList = await screen.findByTestId("event-list");

      await waitFor(() => {
        const testEventTexts = [
          testEvent.title,
          testEvent.date,
          testEvent.startTime,
          testEvent.endTime,
          testEvent.description,
          testEvent.location,
          testEvent.category,
        ];

        testEventTexts.forEach((text) => {
          expect($eventList).toHaveTextContent(text);
        });
      });
    });

    test("[UPDATE] 특정 이벤트를 form을 통해 수정하였을 때 수정이 반영된 이벤트를 이벤트 리스트에서 확인할 수 있다.", async () => {
      render(<App />);

      const $eventList = await screen.findByTestId("event-list");
      const $targetEvent = $eventList.children[1].children[0];
      const $EventEditButton = $targetEvent.children[1].children[0];

      await userEvent.click($EventEditButton);

      const updateEvent: Omit<Event, "id"> = {
        title: "UPDATE 테스트 이벤트",
        date: "2024-07-29",
        startTime: "00:01",
        endTime: "23:59",
        description: "지한 생일파티",
        location: "지한이네",
        category: "개인",
        repeat: { type: "yearly", interval: 1 },
        notificationTime: 10,
      };

      const $eventFormTitle = screen.getByLabelText("제목");
      await userEvent.clear($eventFormTitle);
      await userEvent.type($eventFormTitle, updateEvent.title);

      const $eventFormDate = screen.getByLabelText("날짜");
      await userEvent.clear($eventFormDate);
      await userEvent.type($eventFormDate, updateEvent.date);

      const $eventFormStartTime = screen.getByLabelText("시작 시간");
      await userEvent.clear($eventFormStartTime);
      await userEvent.type($eventFormStartTime, updateEvent.startTime);

      const $eventFormEndTime = screen.getByLabelText("종료 시간");
      await userEvent.clear($eventFormEndTime);
      await userEvent.type($eventFormEndTime, updateEvent.endTime);

      const $eventFormDescription = screen.getByLabelText("설명");
      await userEvent.clear($eventFormDescription);
      await userEvent.type($eventFormDescription, updateEvent.description);

      const $eventFormLocation = screen.getByLabelText("위치");
      await userEvent.clear($eventFormLocation);
      await userEvent.type($eventFormLocation, updateEvent.location);

      const $eventFormCategory = screen.getByLabelText("카테고리");
      await userEvent.selectOptions($eventFormCategory, updateEvent.category);

      await userEvent.click(screen.getByTestId("event-submit-button"));

      await waitFor(() => {
        const testEventTexts = [
          updateEvent.title,
          updateEvent.date,
          updateEvent.startTime,
          updateEvent.endTime,
          updateEvent.description,
          updateEvent.location,
          updateEvent.category,
        ];

        testEventTexts.forEach((text) => {
          expect($targetEvent).toHaveTextContent(text);
        });
      });
    });

    test("[DELETE] 이벤트 목록에서 삭제 버튼을 누르면 그 이벤트는 이벤트 목록에서 지워진다.", async () => {
      render(<App />);

      const $eventList = await screen.findByTestId("event-list");
      const $targetEvent = $eventList.children[1].children[0];
      const $eventDeleteButton = $targetEvent.children[1].children[1];
      const targetEventTitle =
        $targetEvent.children[0].children[0].children[0].innerHTML;

      expect($eventList.innerHTML).toContain($targetEvent.outerHTML);
      expect($eventList).toHaveTextContent(targetEventTitle);

      await userEvent.click($eventDeleteButton);

      await waitFor(() => {
        expect($eventList.innerHTML).not.toContain($targetEvent.outerHTML);
        expect($eventList).not.toHaveTextContent(targetEventTitle);
      });
    });
  });

  describe("일정 뷰 및 필터링", () => {
    test("선택한 주간에 일정이 없으면 주별 뷰에 일정이 표시되지 않는다.", async () => {
      server = setupServer(...createHandlers([])); // 이벤트가 없는 이벤트 핸들러 생성
      server.listen();

      render(<App />);

      const $viewSelector = screen.getByLabelText("view");
      await userEvent.selectOptions($viewSelector, "week");

      const $weekView = screen.getByTestId("week-view");

      let maxLengthOfDayHTMLChildren = 0;
      for (const $day of $weekView.children[1].children[1].children[0]
        .children) {
        maxLengthOfDayHTMLChildren = Math.max(
          $day.children.length,
          maxLengthOfDayHTMLChildren
        );
      }

      expect(maxLengthOfDayHTMLChildren).toBe(1);
    });

    test("선택한 주간에 일정이 있으면 주별 뷰에 일정이 표시된다.", async () => {
      server = setupServer(...createHandlers()); // 목업 이벤트로 이벤트 핸들러 생성
      server.listen();

      render(<App />);

      const $viewSelector = screen.getByLabelText("view");
      await userEvent.selectOptions($viewSelector, "week");

      const $weekView = screen.getByTestId("week-view");

      let maxLengthOfDayHTMLChildren = 0;
      for (const $day of $weekView.children[1].children[1].children[0]
        .children) {
        maxLengthOfDayHTMLChildren = Math.max(
          $day.children.length,
          maxLengthOfDayHTMLChildren
        );
      }

      expect(maxLengthOfDayHTMLChildren).toBe(2);
    });

    test("선택한 월간에 일정이 없으면 월별 뷰에 일정이 표시되지 않는다.", async () => {
      server = setupServer(...createHandlers([])); // 이벤트가 없는 이벤트 핸들러 생성
      server.listen();

      render(<App />);

      const $viewSelector = screen.getByLabelText("view");
      await userEvent.selectOptions($viewSelector, "month");

      const $monthView = screen.getByTestId("month-view");

      let maxLengthOfDayHTMLChildren = 0;
      for (const $week of $monthView.children[1].children[1].children) {
        for (const $day of $week.children) {
          maxLengthOfDayHTMLChildren = Math.max(
            $day.children.length,
            maxLengthOfDayHTMLChildren
          );
        }
      }

      expect(maxLengthOfDayHTMLChildren).toBe(1);
    });

    test("선택한 월간에 일정이 있으면 월별 뷰에 일정이 표시된다.", async () => {
      server = setupServer(...createHandlers()); // 목업 이벤트로 이벤트 핸들러 생성
      server.listen();

      render(<App />);

      const $viewSelector = screen.getByLabelText("view");
      await userEvent.selectOptions($viewSelector, "month");

      const $monthView = screen.getByTestId("month-view");

      let maxLengthOfDayHTMLChildren = 0;
      for (const $week of $monthView.children[1].children[1].children) {
        for (const $day of $week.children) {
          maxLengthOfDayHTMLChildren = Math.max(
            $day.children.length,
            maxLengthOfDayHTMLChildren
          );
        }
      }

      expect(maxLengthOfDayHTMLChildren).toBe(2);
    });
  });

  describe("알림 기능", () => {
    test.todo(
      "일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다",
      async () => {}
    );
  });

  describe("검색 기능", () => {
    test.todo(
      "제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다",
      async () => {}
    );
    test.todo(
      "제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다",
      async () => {}
    );
    test.todo(
      "검색어를 지우면 모든 일정이 다시 표시되어야 한다",
      async () => {}
    );
  });

  describe("공휴일 표시", () => {
    test.todo(
      "달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다",
      async () => {}
    );
    test.todo(
      "달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다",
      async () => {}
    );
  });

  describe("일정 충돌 감지", () => {
    test.todo(
      "겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다",
      async () => {}
    );
    test.todo(
      "기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다",
      async () => {}
    );
  });
});
