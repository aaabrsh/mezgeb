import type { ActionFailure } from "@sveltejs/kit";

/**
 * Base success shape for actions
 */
export interface ActionSuccess<T = undefined> {
  message: string;
  success: true;
  data?: T;
}

/**
 * Base validation failure shape
 */
export type ActionValidationFailure<TFields extends string> = ActionFailure<{
  message: string;
  errors?: Partial<Record<TFields, string[]>>;
  success: false;
}>;

/**
 * Base simple failure (no field errors)
 */
export type ActionFailureSimple = ActionFailure<{
  message: string;
  success: false;
}>;
