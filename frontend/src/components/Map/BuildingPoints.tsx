import type { FilterSpecification } from '@maplibre/maplibre-gl-style-spec';
import { Layer } from 'react-map-gl/maplibre';

import { HousingStatus } from '../../models/HousingState';

interface Props {
  filter?: FilterSpecification;
  selected: string | null;
  source: string;
}

const SELECTED_SIZE_COEFFICIENT = 2;
const DEFAULT_SIZE_COEFFICIENT = 1;

function BuildingPoints(props: Props) {
  return (
    <Layer
      id="buildings"
      type="symbol"
      filter={props.filter}
      layout={{
        'icon-allow-overlap': true,
        'icon-image': [
          'match',
          ['get', 'status', ['at', 0, ['get', 'housingList']]],
          HousingStatus.Qualification,
          `square-fill-${HousingStatus.Qualification}`,
          HousingStatus.RemoteEvolution,
          `square-fill-${HousingStatus.RemoteEvolution}`,
          HousingStatus.UpcomingEvolution,
          `square-fill-${HousingStatus.UpcomingEvolution}`,
          HousingStatus.OngoingEvolution,
          `square-fill-${HousingStatus.OngoingEvolution}`,
          HousingStatus.AchievedEvolution,
          `square-fill-${HousingStatus.AchievedEvolution}`,
          // Default value
          `square-fill-${HousingStatus.NoAction}`
        ],
        'icon-size': [
          'case',
          ['==', ['get', 'id'], props.selected ?? ''],
          SELECTED_SIZE_COEFFICIENT,
          DEFAULT_SIZE_COEFFICIENT
        ]
      }}
      source={props.source}
    />
  );
}

export default BuildingPoints;
