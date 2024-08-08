import { Event, RepeatType } from "@/types";

const getEventGeneratedRepeatChdilren = (event: Event) => {
  const { repeat } = event;
  const eventWithChildren = structuredClone(event);

  if (repeat.type === "none") {
    return eventWithChildren;
  }

  // const { type, interval, weekdays, monthdays, weekdayRepeatByMonth } = repeat;
  const endDate = repeat.endDate ?? getDefaultDate(event.date);

  const children = generateChildren(event, endDate);

  eventWithChildren.children = children;
  return eventWithChildren;
};

const generateChildren = (parent: Event, endDate: string) => {
  const children: Array<Event> = [];
  const start = new Date(parent.date);
  const end = new Date(endDate);

  const now = new Date(parent.date);

  while (now <= end) {
    if (now >= start) {
      children.push({
        ...parent,
        parentId: parent.id,
        id: Math.ceil(Math.random() * 100000000),
        date: now.toISOString().split("T")[0],
        repeat: {
          type: "children",
          interval: 1,
        },
      });
    }

    addInterval(now, parent.repeat.type, parent.repeat.interval);
  }

  return children;
};

const addInterval = (date: Date, type: RepeatType, interval: number) => {
  switch (type) {
    case "daily":
      date.setDate(date.getDate() + interval);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7 * interval);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + interval);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + interval);
      break;
    default:
      throw new Error("Unsupported repeat type");
  }
};

const getDefaultDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const newDate = new Date(date);
  newDate.setFullYear(date.getFullYear() + 1);

  return newDate.toISOString().split("T")[0];
};

export default getEventGeneratedRepeatChdilren;
