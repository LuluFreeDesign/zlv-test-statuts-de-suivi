import { HousingStatus as HousingStatusDTO } from '@zerologementvacant/models';
import { Predicate } from 'effect';
import type { ReactNode } from 'react';

import type { ColorFamily } from '~/models/ColorFamily';
import type { Housing } from '~/models/Housing';
import type { SelectOption } from '~/models/SelectOption';

export interface HousingState {
  status: HousingStatusDTO;
  title: string;
  subStatusList?: HousingSubStatus[];
  colorFamily: ColorFamily;
  hint?: ReactNode;
}

export interface HousingSubStatus {
  title: string;
}

/**
 * @deprecated See {@link HousingStatusDTO}
 */
export const HousingStatus = {
  NoAction: HousingStatusDTO.NO_ACTION,
  Qualification: HousingStatusDTO.QUALIFICATION,
  RemoteEvolution: HousingStatusDTO.REMOTE_EVOLUTION,
  UpcomingEvolution: HousingStatusDTO.UPCOMING_EVOLUTION,
  OngoingEvolution: HousingStatusDTO.ONGOING_EVOLUTION,
  AchievedEvolution: HousingStatusDTO.ACHIEVED_EVOLUTION
} as const;

export type HousingStatus = (typeof HousingStatus)[keyof typeof HousingStatus];

export const HousingStates: HousingState[] = [
  {
    status: HousingStatusDTO.NO_ACTION,
    title: 'Aucune action',
    colorFamily: 'orange-terre-battue'
  },
  {
    status: HousingStatusDTO.QUALIFICATION,
    title: 'En qualification',
    colorFamily: 'green-menthe'
  },
  {
    status: HousingStatusDTO.REMOTE_EVOLUTION,
    title: 'Evolution lointaine',
    colorFamily: 'beige-gris-galet',
    subStatusList: [
      { title: 'Situation bloquée/complexe' },
      { title: 'NPAI' },
      { title: 'Signaux faibles' }
    ]
  },
  {
    status: HousingStatusDTO.UPCOMING_EVOLUTION,
    title: 'Evolution à venir',
    colorFamily: 'yellow-tournesol',
    subStatusList: [
      { title: 'Intérêt potentiel / En réflexion' },
      { title: 'En pré-accompagnement' },
      { title: 'Mutation à venir' }
    ]
  },
  {
    status: HousingStatusDTO.ONGOING_EVOLUTION,
    title: 'Evolution en cours',
    colorFamily: 'blue-ecume',
    subStatusList: [
      { title: 'En accompagnement' },
      { title: 'Intervention publique' },
      { title: 'Sans accompagnement' },
      { title: 'Mutation en cours/effectuée' }
    ]
  },
  {
    status: HousingStatusDTO.ACHIEVED_EVOLUTION,
    title: 'Evolution réalisée',
    colorFamily: 'green-bourgeon',
    subStatusList: [
      { title: 'Sortie de la vacance' },
      { title: 'Sortie de passoire thermique' },
      { title: 'N’était pas vacant' },
      { title: 'N’était pas une passoire thermique' },
      { title: 'N’était pas un local commercial vacant' },
      { title: 'N’était pas une résidence secondaire' },
      { title: 'N’était pas un logement' },
      { title: 'Autre objectif rempli' }
    ]
  }
];

export function getHousingState(status: HousingStatusDTO): HousingState {
  return HousingStates[status];
}

export const getSubStatus = (
  status: HousingStatusDTO,
  subStatusTitle: string
): HousingSubStatus | undefined => {
  return getHousingState(status).subStatusList?.filter(
    (s) => s.title === subStatusTitle
  )[0];
};

export const getHousingSubStatus = (
  housing: Housing
): HousingSubStatus | undefined => {
  if (housing.status && housing.subStatus) {
    return getSubStatus(housing.status, housing.subStatus);
  }
};

export function getSubStatusOptions(status: HousingStatusDTO): SelectOption[] {
  const housingState = getHousingState(status);
  return (
    housingState.subStatusList?.map((subStatus) => ({
      value: subStatus.title,
      label: subStatus.title,
      badgeLabel: `Sous-statut de suivi : ${subStatus.title.toLowerCase()}`
    })) ?? []
  );
}

/**
 * @deprecated See {@link getSubStatuses}
 * @param statuses
 */
export function getSubStatusList(
  statuses: string[] | HousingStatusDTO[]
): string[] {
  return statuses
    .map((status) => (typeof status === 'string' ? Number(status) : status))
    .map(getHousingState)
    .flatMap((state) => state.subStatusList)
    .filter(Predicate.isNotUndefined)
    .map((substatus) => substatus.title);
}

export function getSubStatuses(status: HousingStatusDTO): string[] {
  const subStatuses = getHousingState(status).subStatusList?.map(
    (subStatus) => subStatus.title
  );
  return subStatuses ?? [];
}

export function findStatus(subStatus: string): HousingStatusDTO {
  const status = HousingStates.find((state) => {
    return state.subStatusList?.find((sub) => sub.title === subStatus);
  });
  if (!status) {
    throw new Error(`Status not found for sub-status ${subStatus}`);
  }
  return status.status;
}
