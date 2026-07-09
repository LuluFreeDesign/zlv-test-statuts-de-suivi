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
// "actionHigh" is the vivid/saturated tier DSFR uses for buttons — darker and
// more visible on the map than the pale "contrast" tier used for badges.
const backgroundColors = Array.zip(statuses, [
  hex.decisions.background.actionHigh.orangeTerreBattue.default,
  hex.decisions.background.actionHigh.greenMenthe.default,
  hex.decisions.background.actionHigh.beigeGrisGalet.default,
  hex.decisions.background.actionHigh.yellowTournesol.default,
  hex.decisions.background.actionHigh.blueEcume.default,
  hex.decisions.background.actionHigh.greenBourgeon.default
]) as NonEmptyArray<[HousingStatus, string]>;
// Neutral light outline (same as the default marker below) since the fill is
// now vivid enough that a same-hue border would blend into it.
const borderColors = Array.zip(statuses, [
  hex.decisions.text.inverted.grey.default,
  hex.decisions.text.inverted.grey.default,
  hex.decisions.text.inverted.grey.default,
  hex.decisions.text.inverted.grey.default,
  hex.decisions.text.inverted.grey.default,
  hex.decisions.text.inverted.grey.default
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
