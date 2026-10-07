// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Maximum length of an observation note, after trimming. */
export const OBSERVATION_BODY_MAX_LENGTH = 2000;

/** A farm-shared note recorded against one management zone. */
export interface ZoneObservation {
  /** Observation id. */
  id: number;
  /** Note text. */
  body: string;
  /** Calendar day the observation was made, stored at UTC midnight. */
  observedOn: Date;
}

/** Fields required to create an observation on a zone. */
export interface CreateObservationInput {
  /** Management zone the note belongs to. */
  zoneId: number;
  /** Note text. */
  body: string;
  /** Calendar day the observation was made. */
  observedOn: Date;
}

/** Fields that can change on an existing observation. */
export interface UpdateObservationInput {
  /** Note text. */
  body: string;
  /** Calendar day the observation was made. */
  observedOn: Date;
}
