export const EVENT_TYPES = {
  TRANSACTION_CREATED: 'transaction_created',
  TRANSACTION_COMPLETED: 'transaction_completed',
  TRANSACTION_REJECTED: 'transaction_rejected',
  TRANSACTION_STATUS_UPDATED: 'transaction_status_updated',
  APPROVAL_REQUESTED: 'approval_requested',
  APPROVAL_PROCESSED: 'approval_processed',
  USER_REGISTERED: 'user_registered',
  USER_ROLE_UPDATED: 'user_role_updated',
} as const;

export type EventType = keyof typeof EVENT_TYPES;
