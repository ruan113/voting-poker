export type Event<EventType = string, EventData = Record<string, any>> = {
  type: EventType;
  data: EventData;
};

type ExtractEventType<T = Event<any, any>> = T extends Event<infer R, any>
  ? R
  : never;

type EventNames<T extends Event> = ExtractEventType<T>;

type EventListener<T extends Event = Event> = (event: T) => void;

export type EventListenerContainer<T extends Event> = Record<
  EventNames<T>,
  EventListener<T>
>;
