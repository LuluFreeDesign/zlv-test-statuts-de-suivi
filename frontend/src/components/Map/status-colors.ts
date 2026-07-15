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
// DSFR's "main" swatch per color: a mid-saturation tone, theme-independent.
// The "contrast"/"alt" decision tiers are pale (made for badge backgrounds)
// and "actionHigh"/"flat" resolve, in light mode, to a muted/desaturated
// "ink" tone rather than a vivid one — neither reads well as a map marker
// fill, so we use the raw named swatch instead.
const backgroundColors = Array.zip(statuses, [
  hex.options.orangeTerreBattue.main645.default,
  hex.options.greenMenthe.main548.default,
  hex.options.beigeGrisGalet.main702.default,
  hex.options.yellowTournesol.main731.default,
  hex.options.blueEcume.main400.default,
  hex.options.greenBourgeon.main640.default
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
