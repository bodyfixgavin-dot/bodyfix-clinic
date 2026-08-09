export type StealthEvent =
  | "admin_console_view"
  | "stealth_attempt_1"
  | "stealth_attempt_2"
  | "builder_mode_enter"
  | "builder_section_open"
  | "builder_contact_intent";

export type StealthEventParameters = { entry?: string; section?: string; intent?: string };

// Analytics is not currently configured. This deliberately inert adapter is the
// single integration point for a future provider; never add access-key values or PII.
export function trackStealthEvent(event: StealthEvent, parameters: StealthEventParameters = {}) {
  void event;
  void parameters;
}
