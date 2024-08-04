import { createHandlers } from "@/mocks/mockServiceWorker/handlers";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import Scheduler from "../../Scheduler";

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

    test.only("event form에 일정 반복 설정을 위한 요소들이 존재한다.", async () => {
    });

    test.only("event form에 일정 반복 설정의 위한 요소들이 반복 유형에 따라 다르게 렌더링된다.", async () => {
    });
  });

  describe("반복 일정 생성", () => {

    describe("생성 시 설정한 반복 유형과 반복 주기에 따라 반복 일정이 생성된다.", () => {});

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
