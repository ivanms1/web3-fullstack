import { EVENT_TYPES } from "@/types/event";
import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

export interface BlockchainEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: Date;
  status: "success" | "error" | "info";
  data?: Record<string, any>;
}

export const eventsAtom = atomWithReset<BlockchainEvent[]>([]);
export const eventsSidebarOpenAtom = atom<boolean>(false);

// Unread notifications counter
export const unreadNotificationsAtom = atomWithReset<number>(0);

// Helper functions to add events
export const addEventAtom = atom(
  null,
  (get, set, event: Omit<BlockchainEvent, "id" | "timestamp">) => {
    const events = get(eventsAtom);

    // Create a unique identifier based on event type and relevant data
    const createEventKey = (eventData: Record<string, any> | undefined) => {
      switch (event.type) {
        case EVENT_TYPES.TRANSACTION_CREATED:
        case EVENT_TYPES.TRANSACTION_COMPLETED:
        case EVENT_TYPES.TRANSACTION_REJECTED:
        case EVENT_TYPES.TRANSACTION_STATUS_UPDATED:
          return `${event.type}-${eventData?.transactionId}`;
        case EVENT_TYPES.APPROVAL_REQUESTED:
        case EVENT_TYPES.APPROVAL_PROCESSED:
          return `${event.type}-${eventData?.approvalId}`;
        case EVENT_TYPES.USER_REGISTERED:
          return `${event.type}-${eventData?.userId}`;
        case EVENT_TYPES.USER_ROLE_UPDATED:
          return `${event.type}-${eventData?.userAddress}`;
        default:
          return `${event.type}-${JSON.stringify(eventData || {})}`;
      }
    };

    const eventKey = createEventKey(event.data);

    // Check if this event already exists (within last 30 seconds to allow for retries)
    const now = Date.now();
    const recentEvents = events.filter(
      (e) => now - e.timestamp.getTime() < 30000
    );
    const isDuplicate = recentEvents.some((e) => {
      const existingKey = createEventKey(e.data);
      return existingKey === eventKey;
    });

    if (isDuplicate) {
      return; // Don't add duplicate events
    }

    const newEvent: BlockchainEvent = {
      ...event,
      id: `${event.type}-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    };

    // Add the new event
    set(eventsAtom, [newEvent, ...events.slice(0, 49)]); // Keep last 50 events

    const currentUnread = get(unreadNotificationsAtom);
    set(unreadNotificationsAtom, currentUnread + 1);
  }
);
