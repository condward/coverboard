import { FC } from 'react';
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Stack,
} from '@mui/material';

import { Media, mediaMap } from 'types';
import { useShallowMainStore } from 'store';

export const ToolbarSearchMedia: FC<{ onReset?: () => void }> = ({
  onReset,
}) => {
  const { media, updateConfigs, coversLength } = useShallowMainStore(
    (state) => ({
      media: state.configs.media,
      updateConfigs: state.updateConfigs,
      coversLength: state.covers.length,
    }),
  );

  if (coversLength > 0) {
    return (
      <Stack
        direction="row"
        justifyContent="center"
        sx={{ textTransform: 'uppercase' }}>
        <legend>
          {mediaMap[media].emoji} {media}
        </legend>
      </Stack>
    );
  }

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend" id="pick-media">
        Pick the media:
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="pick-media"
        name="media"
        value={media}
        onChange={(evt) => {
          updateConfigs({ media: evt.target.value as Media });
          onReset?.();
        }}>
        <FormControlLabel
          value={Media.MUSIC}
          control={<Radio />}
          label={Media.MUSIC}
        />
        <FormControlLabel
          value={Media.MOVIE}
          control={<Radio />}
          label={Media.MOVIE}
        />
        <FormControlLabel
          value={Media.TVSHOW}
          control={<Radio />}
          label={Media.TVSHOW}
        />
        <FormControlLabel
          value={Media.BOOK}
          control={<Radio />}
          label={Media.BOOK}
        />
        <FormControlLabel
          value={Media.GAME}
          control={<Radio />}
          label={Media.GAME}
        />
      </RadioGroup>
    </FormControl>
  );
};
