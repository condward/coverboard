import { FC } from 'react';
import {
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
  FormControl,
  FormLabel,
} from '@mui/material';

import { Media, mediaMap } from 'types';
import { useMainStore } from 'store';

export const ToolbarSearchMedia: FC<{ onReset?: () => void }> = ({
  onReset,
}) => {
  const media = useMainStore((state) => state.configs.media);
  const updateConfigs = useMainStore((state) => state.updateConfigs);
  const coversLength = useMainStore((state) => state.covers.length);

  return (
    <>
      {coversLength > 0 ? (
        <Tooltip
          title={
            <>
              <p>Clear board</p>
              <p>Add new page in Share button</p>
              <p>Change Url after /coverboard</p>
            </>
          }>
          <Button sx={{ textTransform: 'capitalize' }}>
            {mediaMap[media].emoji} {media} (change ℹ️ )
          </Button>
        </Tooltip>
      ) : (
        <>
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
                disabled={!!coversLength}
                value={Media.MUSIC}
                control={<Radio />}
                label={Media.MUSIC}
              />
              <FormControlLabel
                disabled={!!coversLength}
                value={Media.MOVIE}
                control={<Radio />}
                label={Media.MOVIE}
              />
              <FormControlLabel
                disabled={!!coversLength}
                value={Media.TVSHOW}
                control={<Radio />}
                label={Media.TVSHOW}
              />
              <FormControlLabel
                disabled={!!coversLength}
                value={Media.BOOK}
                control={<Radio />}
                label={Media.BOOK}
              />
              <FormControlLabel
                disabled={!!coversLength}
                value={Media.GAME}
                control={<Radio />}
                label={Media.GAME}
              />
            </RadioGroup>
          </FormControl>
        </>
      )}
    </>
  );
};
