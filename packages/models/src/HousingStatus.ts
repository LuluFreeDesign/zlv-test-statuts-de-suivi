export enum HousingStatus {
  NO_ACTION,
  QUALIFICATION,
  REMOTE_EVOLUTION,
  UPCOMING_EVOLUTION,
  ONGOING_EVOLUTION,
  ACHIEVED_EVOLUTION
}

/**
 * A value for the transition to remove the enum `HousingStatus`.
 */
export const HOUSING_STATUS_IDS = [
  'no-action',
  'qualification',
  'remote-evolution',
  'upcoming-evolution',
  'ongoing-evolution',
  'achieved-evolution'
] as const;
export type HousingStatusId = (typeof HOUSING_STATUS_IDS)[number];

export function toHousingStatusId(status: HousingStatus): HousingStatusId {
  return HOUSING_STATUS_IDS[status];
}

export const HOUSING_STATUS_VALUES: HousingStatus[] = Object.values(
  HousingStatus
).filter((status): status is HousingStatus => typeof status !== 'string');

export function isHousingStatus(value: number): value is HousingStatus {
  return HOUSING_STATUS_VALUES.includes(value);
}

export const HOUSING_STATUS_LABELS: Record<HousingStatus, string> = {
  [HousingStatus.NO_ACTION]: 'Aucune action',
  [HousingStatus.QUALIFICATION]: 'En qualification',
  [HousingStatus.REMOTE_EVOLUTION]: 'Evolution lointaine',
  [HousingStatus.UPCOMING_EVOLUTION]: 'Evolution à venir',
  [HousingStatus.ONGOING_EVOLUTION]: 'Evolution en cours',
  [HousingStatus.ACHIEVED_EVOLUTION]: 'Evolution réalisée'
};

const HOUSING_SUB_STATUS_LABELS: Record<HousingStatus, ReadonlySet<string>> = {
  [HousingStatus.NO_ACTION]: new Set(),
  [HousingStatus.QUALIFICATION]: new Set(),
  [HousingStatus.REMOTE_EVOLUTION]: new Set([
    'Situation bloquée/complexe',
    'NPAI',
    'Signaux faibles'
  ]),
  [HousingStatus.UPCOMING_EVOLUTION]: new Set([
    'Intérêt potentiel / En réflexion',
    'En pré-accompagnement',
    'Mutation à venir'
  ]),
  [HousingStatus.ONGOING_EVOLUTION]: new Set([
    'En accompagnement',
    'Intervention publique',
    'Sans accompagnement',
    'Mutation en cours/effectuée'
  ]),
  [HousingStatus.ACHIEVED_EVOLUTION]: new Set([
    'Sortie de la vacance',
    'Sortie de passoire thermique',
    'N’était pas vacant',
    'N’était pas une passoire thermique',
    'N’était pas un local commercial vacant',
    'N’était pas une résidence secondaire',
    'N’était pas un logement',
    'Autre objectif rempli'
  ])
} as const;

export function isSubStatusAvailable(
  status: HousingStatus,
  subStatus: string
): boolean {
  return HOUSING_SUB_STATUS_LABELS[status].has(subStatus);
}

export function getSubStatuses(status: HousingStatus): ReadonlySet<string> {
  return HOUSING_SUB_STATUS_LABELS[status];
}
