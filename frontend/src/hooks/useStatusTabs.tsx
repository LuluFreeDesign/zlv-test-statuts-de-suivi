import type { TabsProps } from '@codegouvfr/react-dsfr/Tabs';
import {
  HOUSING_STATUS_LABELS,
  HousingStatus,
  toHousingStatusId
} from '@zerologementvacant/models';
import { Array, Number, pipe } from 'effect';
import type { ElementOf } from 'ts-essentials';
import { match, Pattern } from 'ts-pattern';

import type { HousingFilters } from '~/models/HousingFilters';
import { useCountHousingQuery } from '~/services/housing.service';
import { useHousingListTabs } from '~/views/HousingList/HousingListTabsProvider';

function createTab(
  status: HousingStatus,
  query: ReturnType<typeof useCountHousingQuery>
): ElementOf<TabsProps.Controlled['tabs']> {
  // Abbreviate "Evolution" to "Évol." in the tabs only (space is tight there);
  // the full label is kept everywhere else (badges, filters, resource page…).
  const label = HOUSING_STATUS_LABELS[status].replace('Evolution', 'Évol.');
  return {
    tabId: toHousingStatusId(status),
    label: match(query)
      .with({ isLoading: true }, () => `${label} (...)`)
      .with(
        { isSuccess: true, data: { housing: Pattern.number.select() } },
        (housing) => `${label} (${housing})`
      )
      .otherwise(() => null)
  };
}

export function useStatusTabs(filters: HousingFilters) {
  const { activeStatus, activeTab, setActiveTab } = useHousingListTabs();

  const countNoActionQuery = useCountHousingQuery({
    ...filters,
    status: HousingStatus.NO_ACTION
  });
  const countQualificationQuery = useCountHousingQuery({
    ...filters,
    status: HousingStatus.QUALIFICATION
  });
  const countRemoteEvolutionQuery = useCountHousingQuery({
    ...filters,
    status: HousingStatus.REMOTE_EVOLUTION
  });
  const countUpcomingEvolutionQuery = useCountHousingQuery({
    ...filters,
    status: HousingStatus.UPCOMING_EVOLUTION
  });
  const countOngoingEvolutionQuery = useCountHousingQuery({
    ...filters,
    status: HousingStatus.ONGOING_EVOLUTION
  });
  const countAchievedEvolutionQuery = useCountHousingQuery({
    ...filters,
    status: HousingStatus.ACHIEVED_EVOLUTION
  });
  const queries = [
    countNoActionQuery,
    countQualificationQuery,
    countRemoteEvolutionQuery,
    countUpcomingEvolutionQuery,
    countOngoingEvolutionQuery,
    countAchievedEvolutionQuery
  ];

  const sum: number | null = queries.every((query) => query.isSuccess)
    ? pipe(
        queries,
        Array.map((query) => query.data.housing),
        Number.sumAll
      )
    : null;

  const tabs: TabsProps.Controlled['tabs'] = [
    {
      tabId: 'all',
      label: sum !== null ? `Tous (${sum})` : 'Tous'
    },
    createTab(HousingStatus.NO_ACTION, countNoActionQuery),
    createTab(HousingStatus.QUALIFICATION, countQualificationQuery),
    createTab(HousingStatus.REMOTE_EVOLUTION, countRemoteEvolutionQuery),
    createTab(HousingStatus.UPCOMING_EVOLUTION, countUpcomingEvolutionQuery),
    createTab(HousingStatus.ONGOING_EVOLUTION, countOngoingEvolutionQuery),
    createTab(HousingStatus.ACHIEVED_EVOLUTION, countAchievedEvolutionQuery)
  ];

  return {
    activeStatus,
    activeTab,
    tabs,
    setActiveTab
  };
}
