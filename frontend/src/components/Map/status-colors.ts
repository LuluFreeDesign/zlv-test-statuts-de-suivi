import { fr } from '@codegouvfr/react-dsfr/fr';
import { HousingStatus } from '@zerologementvacant/models';
import { Array } from 'effect';
import type { NonEmptyArray } from 'ts-essentials';

const hex = fr.colors.getHex({ isDark: false });
const statuses = [
  HousingStatus.NO_ACTION,
  HousingStatus.QUALIFICATION,
  HousingStatus.REMOTE_EVOLUTION,
  HousingStatus.UPCOMING_EVOLUTION,
  HousingStatus.ONGOING_EVOLUTION,
  HousingStatus.ACHIEVED_EVOLUTION
];
const backgroundColors = Array.zip(statuses, [
  hex.decisions.background.contrast.orangeTerreBattue.default,
  hex.decisions.background.contrast.greenMenthe.default,
  hex.decisions.background.contrast.beigeGrisGalet.default,
  hex.decisions.background.contrast.yellowTournesol.default,
  hex.decisions.background.contrast.blueEcume.default,
  hex.decisions.background.contrast.greenBourgeon.default
]) as NonEmptyArray<[HousingStatus, string]>;
const borderColors = Array.zip(statuses, [
  hex.decisions.text.label.orangeTerreBattue.default,
  hex.decisions.text.label.greenMenthe.default,
  hex.decisions.text.label.beigeGrisGalet.default,
  hex.decisions.text.label.yellowTournesol.default,
  hex.decisions.text.label.blueEcume.default,
  hex.decisions.text.label.greenBourgeon.default
]) as NonEmptyArray<[HousingStatus, string]>;
const defaultBackgroundColor =
  hex.decisions.background.actionHigh.blueFrance.default;
const defaultBorderColor = hex.decisions.text.inverted.grey.default;

const statusColors = {
  defaultBackgroundColor,
  defaultBorderColor,
  backgroundColors,
  borderColors
};

export default statusColors;
