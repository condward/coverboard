import { FC } from 'react';
import {
  Button,
  FormControlLabel,
  Switch,
  FormControl,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Stack,
} from '@mui/material';
import { Control, Controller, useWatch } from 'react-hook-form';

import {
  backColorMap,
  BackColors,
  colorMap,
  Colors,
  ConfigSchema,
  POPOVER_BACK_COLOR,
  SPACING_GAP,
} from 'types';
import { SliderInput, DirectionRadio, FieldSet } from 'components';
import { useMainStore } from 'store';

const commonSelectSx = {
  fontSize: '0.8rem',
  fontWeight: 'bold',
  width: '5rem',
};

const ColorSettings: Array<{
  name: keyof ConfigSchema['colors'];
  label: string;
}> = [
  {
    name: 'main',
    label: 'Main Color',
  },
  {
    name: 'covers',
    label: 'Cover Color',
  },
  {
    name: 'groups',
    label: 'Group Color',
  },
  {
    name: 'arrows',
    label: 'Arrow Color',
  },
];

export const ToolbarConfigForm: FC<{
  control: Control<ConfigSchema>;
}> = ({ control }) => {
  const titleLabel = useMainStore((state) => state.getTitleLabel().label);
  const subTitleLabel = useMainStore((state) => state.getSubTitleLabel().label);
  const showScreenSizes = useWatch({
    control,
    name: 'layout.fitToScreen',
  });

  return (
    <Stack direction="column" gap={SPACING_GAP} flexWrap="wrap">
      <FieldSet label="Layout config" direction="column">
        <Controller
          name="layout.title"
          control={control}
          render={({ field }) => (
            <TextField
              autoFocus
              fullWidth
              label="Title"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="layout.fitToScreen"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch checked={field.value} onChange={field.onChange} />
              }
              label="Fit to screen"
            />
          )}
        />
        {!showScreenSizes && (
          <Stack direction="row" gap={SPACING_GAP / 2}>
            <Controller
              name="layout.width"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  type="number"
                  label="Width"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="layout.height"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  type="number"
                  label="height"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </Stack>
        )}
        <Controller
          name="layout.scale"
          control={control}
          render={({ field }) => (
            <SliderInput
              label="Elements scale"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              min={0.5}
              max={1.5}
              step={0.1}
            />
          )}
        />
      </FieldSet>
      <FieldSet label="Colors" direction="row">
        {ColorSettings.map((colorSetting) => (
          <Controller
            name={`colors.${colorSetting.name}`}
            control={control}
            key={colorSetting.name}
            render={({ field }) => (
              <FormControl>
                <InputLabel id={colorSetting.name}>
                  {colorSetting.label}
                </InputLabel>
                <Select
                  labelId={colorSetting.name}
                  aria-labelledby={colorSetting.name}
                  label={colorSetting.label}
                  value={field.value}
                  onChange={field.onChange}>
                  {Object.values(Colors).map((clr) => (
                    <MenuItem value={clr} key={clr}>
                      <Button
                        sx={{
                          ...commonSelectSx,
                          backgroundColor: colorMap[clr],
                          color:
                            clr === Colors.YELLOW
                              ? backColorMap[BackColors.DARK]
                              : POPOVER_BACK_COLOR,
                          border:
                            clr === field.value
                              ? `1px solid ${backColorMap[BackColors.DARK]}`
                              : undefined,
                        }}>
                        {clr}
                      </Button>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        ))}
        <Controller
          name="colors.mainBack"
          control={control}
          render={({ field }) => (
            <FormControl>
              <InputLabel variant="outlined" id="colors.mainBack">
                Back Color
              </InputLabel>
              <Select
                labelId="colors.mainBack"
                aria-labelledby="colors.mainBack"
                value={field.value}
                label="Back Color"
                onChange={field.onChange}>
                {Object.values(BackColors).map((clr) => (
                  <MenuItem value={clr} key={clr}>
                    <Button
                      sx={{
                        ...commonSelectSx,
                        backgroundColor: backColorMap[clr],
                        color: POPOVER_BACK_COLOR,
                        border:
                          clr === field.value
                            ? `1px solid ${backColorMap[BackColors.DARK]}`
                            : undefined,
                      }}>
                      {clr}
                    </Button>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
        <Controller
          name="colors.groupsBack"
          control={control}
          render={({ field }) => (
            <FormControl>
              <InputLabel variant="outlined" id="colors.groupsBack">
                Group Back Color
              </InputLabel>
              <Select
                labelId="colors.groupsBack"
                aria-labelledby="colors.groupsBack"
                fullWidth
                value={field.value}
                label="Group Back Color"
                onChange={field.onChange}>
                {Object.values(BackColors).map((clr) => (
                  <MenuItem value={clr} key={clr}>
                    <Button
                      sx={{
                        ...commonSelectSx,
                        backgroundColor: backColorMap[clr],
                        color: POPOVER_BACK_COLOR,
                        border:
                          clr === field.value
                            ? `1px solid ${backColorMap[BackColors.DARK]}`
                            : undefined,
                      }}>
                      {clr}
                    </Button>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </FieldSet>
      <FieldSet
        label="Visibility"
        direction="row"
        gap={{ xs: 0, sm: SPACING_GAP }}>
        <Stack>
          <Controller
            name="visibility.mainTitle"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch checked={field.value} onChange={field.onChange} />
                }
                label="Show main title"
              />
            )}
          />
          <Controller
            name="visibility.helpers"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch checked={field.value} onChange={field.onChange} />
                }
                label="Show empty texts"
              />
            )}
          />
          <Controller
            name="visibility.arrows"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch checked={field.value} onChange={field.onChange} />
                }
                label="Show arrow circles"
              />
            )}
          />
        </Stack>
        <Stack>
          <Controller
            name="visibility.titles"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch checked={field.value} onChange={field.onChange} />
                }
                label={`Show ${titleLabel} name`}
              />
            )}
          />
          <Controller
            name="visibility.subtitles"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch checked={field.value} onChange={field.onChange} />
                }
                label={`Show ${subTitleLabel} name`}
              />
            )}
          />
          <Controller
            name="visibility.stars"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch checked={field.value} onChange={field.onChange} />
                }
                label="Show rating stars"
              />
            )}
          />
        </Stack>
      </FieldSet>

      <FieldSet label="Default Positions" direction="column">
        <Controller
          name="dir.covers"
          control={control}
          render={({ field }) => (
            <DirectionRadio
              label="Cover labels position"
              id="cover-labels-default"
              name="labelRadio"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="dir.groups"
          control={control}
          render={({ field }) => (
            <DirectionRadio
              label="Group labels position"
              id="group-labels-default"
              name="groupRadio"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="dir.stars"
          control={control}
          render={({ field }) => (
            <DirectionRadio
              label="Rating stars position"
              id="rating-stars-default"
              name="groupRadio"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </FieldSet>
    </Stack>
  );
};
