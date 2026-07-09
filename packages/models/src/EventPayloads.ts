import { match } from 'ts-pattern';

import { DataFileYear } from './DataFileYear';
import type { EnergyConsumption } from './EnergyConsumption';
import { OwnerRank } from './HousingOwnerDTO';
import { HousingStatus } from './HousingStatus';

interface EventChange<Old, New> {
  old: Old;
  new: New;
}

// Duplicate this type to be resilient to changes
type PrecisionCategory =
  | 'dispositifs-incitatifs'
  | 'dispositifs-coercitifs'
  | 'hors-dispositif-public'
  | 'blocage-involontaire'
  | 'blocage-volontaire'
  | 'immeuble-environnement'
  | 'tiers-en-cause'
  | 'travaux'
  | 'occupation'
  | 'mutation';

/**
 * Events that create a new entity, where the old value is always null.
 */
type CreationEventChange<T> = EventChange<null, T>;

/**
 * Events that update an existing entity.
 */
type UpdateEventChange<T> = EventChange<T, T>;

type RemoveEventChange<T> = EventChange<T, null>;

export type EventPayloads = {
  'housing:created': CreationEventChange<{
    // This should not ever change so we can type it strongly
    source: 'datafoncier-manual' | DataFileYear;
    occupancy: string;
  }>;
  'housing:updated': UpdateEventChange<{
    actualEnergyConsumption: EnergyConsumption | null;
  }>;
  'housing:occupancy-updated': UpdateEventChange<{
    // Store occupancy as a string to avoid changes
    occupancy?: string;
    occupancyIntended?: string | null;
  }>;
  'housing:status-updated': UpdateEventChange<{
    // Store status as a string to avoid changes
    status?: string;
    subStatus?: string | null;
  }>;

  'housing:precision-attached': CreationEventChange<{
    category: PrecisionCategory;
    label: string;
  }>;
  'housing:precision-detached': RemoveEventChange<{
    category: PrecisionCategory;
    label: string;
  }>;

  'housing:owner-attached': CreationEventChange<{
    name: string;
    rank: OwnerRank;
  }>;
  'housing:owner-updated': UpdateEventChange<{
    name: string;
    rank: OwnerRank;
  }>;
  'housing:owner-detached': RemoveEventChange<{
    name: string;
    rank: OwnerRank;
  }>;

  'housing:perimeter-attached': CreationEventChange<{
    name: string;
  }>;
  'housing:perimeter-detached': RemoveEventChange<{
    name: string;
  }>;

  'housing:group-attached': CreationEventChange<{
    name: string;
  }>;
  'housing:group-detached': RemoveEventChange<{
    name: string;
  }>;
  'housing:group-archived': RemoveEventChange<{
    name: string;
  }>;
  'housing:group-removed': RemoveEventChange<{
    name: string;
  }>;

  'housing:campaign-attached': CreationEventChange<{
    // Temporary workaround to avoid breaking changes in events.
    // This should be removed in the future.
    // Some old events did not log the new campaign properly...
    name: string | null;
  }>;
  'housing:campaign-detached': RemoveEventChange<{
    name: string;
  }>;
  'housing:campaign-removed': RemoveEventChange<{
    name: string;
  }>;

  // Standalone document events
  'document:created': CreationEventChange<{
    filename: string;
  }>;

  'document:updated': UpdateEventChange<{
    filename: string;
  }>;

  'document:removed': RemoveEventChange<{
    filename: string;
  }>;

  // Housing-document association events
  'housing:document-attached': CreationEventChange<{
    filename: string;
  }>;

  'housing:document-detached': RemoveEventChange<{
    filename: string;
  }>;

  'housing:document-removed': RemoveEventChange<{
    filename: string;
  }>;

  'owner:created': CreationEventChange<{
    name: string;
    birthdate: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    additionalAddress: string | null;
  }>;
  'owner:updated': UpdateEventChange<{
    name: string;
    birthdate?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    additionalAddress?: string | null;
  }>;

  'campaign:updated': UpdateEventChange<{
    status?: string;
    title?: string;
    description?: string;
  }>;
};

export const EVENT_HOUSING_STATUS_VALUES = [
  'no-action',
  'qualification',
  'remote-evolution',
  'upcoming-evolution',
  'ongoing-evolution',
  'achieved-evolution'
] as const;
export type EventHousingStatus = (typeof EVENT_HOUSING_STATUS_VALUES)[number];

export function toEventHousingStatus(
  status: HousingStatus
): EventHousingStatus {
  return (
    match(status)
      .returnType<EventHousingStatus>()
      .with(HousingStatus.NO_ACTION, () => 'no-action')
      .with(HousingStatus.QUALIFICATION, () => 'qualification')
      .with(HousingStatus.REMOTE_EVOLUTION, () => 'remote-evolution')
      .with(HousingStatus.UPCOMING_EVOLUTION, () => 'upcoming-evolution')
      .with(HousingStatus.ONGOING_EVOLUTION, () => 'ongoing-evolution')
      .with(HousingStatus.ACHIEVED_EVOLUTION, () => 'achieved-evolution')
      // Should never happen
      .otherwise(() => 'no-action')
  );
}
