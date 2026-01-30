/**
 * Valentine's Day Event Configuration
 * Heart Multiplier Event - First of three Valentine's features
 */

export interface Event {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  type: 'heart-multiplier' | 'bird-facts' | 'love-birds';
}

export const VALENTINE_HEART_EVENT: Event = {
  id: 'valentine-heart-event',
  name: "Valentine's Heart Event",
  description: 'Collect hearts instead of points during this special Valentine\'s event!',
  isActive: true, // Always on for now
  type: 'heart-multiplier',
};

/**
 * Check if an event is currently active
 */
export const isEventActive = (event: Event): boolean => {
  return event.isActive;
};

/**
 * Get the active Valentine's event (if any)
 */
export const getActiveValentineEvent = (): Event | null => {
  if (isEventActive(VALENTINE_HEART_EVENT)) {
    return VALENTINE_HEART_EVENT;
  }
  return null;
};
