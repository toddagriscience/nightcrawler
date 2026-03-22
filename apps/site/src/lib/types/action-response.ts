// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Generic interface for a response from a server action/API route.
 *
 * @property {object | null} data - Optional. If present, contents will vary.
 */
export interface ActionResponse {
  data?: Record<string, any> | null;
}
