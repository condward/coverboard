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
  FormGroup,
} from '@mui/material';
import { Control, Controller } from 'react-hook-form';

import {
  backColorMap,
  BackColors,
  colorMap,
  Colors,
  ConfigSchema,
  ToolbarConfigValues,
} from 'types';
import {
  DirectionRadio,
  POPOVER_BACK_COLOR,
  SliderField,
  SPACING_GAP,
} from 'components';
import { useMainStore } from 'store';

const commonSelectSx = {
  fontSize: '0.8rem',
  fontWeight: 'bold',
};

const ColorSettings = [
  {
    name: ToolbarConfigValues.color,
    label: 'Main Color',
  },
  {
    name: ToolbarConfigValues.coverColor,
    label: 'Cover Color',
  },
  {
    name: ToolbarConfigValues.groupColor,
    label: 'Group Color',
  },
  {
    name: ToolbarConfigValues.arrowColor,
    label: 'Arrow Color',
  },
];

export const ToolbarConfigForm: FC<{
  control: Control<ConfigSchema>;
}> = ({ control }) => {
  const titleLabel = useMainStore((state) => state.getTitleLabel().label);
  const subTitleLabel = useMainStore((state) => state.getSubTitleLabel().label);

  return (
    <Stack direction="column" gap={SPACING_GAP} flexWrap="wrap">
      <Controller
        name={ToolbarConfigValues.title}
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
        name={ToolbarConfigValues.size}
        control={control}
        render={({ field }) => (
          <SliderField
            label="Elements size:"
            id="elements-size"
            name="elemSize"
            value={field.value}
            onChange={field.onChange}
            min={0.5}
            max={1.5}
            step={0.1}
          />
        )}
      />
      <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
        {ColorSettings.map((colorSetting) => (
          <Controller
            name={colorSetting.name}
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
          name={ToolbarConfigValues.backColor}
          control={control}
          render={({ field }) => (
            <FormControl>
              <InputLabel variant="outlined" id={ToolbarConfigValues.backColor}>
                Back Color
              </InputLabel>
              <Select
                labelId={ToolbarConfigValues.backColor}
                aria-labelledby={ToolbarConfigValues.backColor}
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
      </Stack>
      <FormGroup>
        <Stack direction="row" flexWrap="wrap">
          <Controller
            name={ToolbarConfigValues.showMainTitle}
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
            name={ToolbarConfigValues.showTitle}
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
            name={ToolbarConfigValues.showSubtitle}
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
            name={ToolbarConfigValues.showArrow}
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch checked={field.value} onChange={field.onChange} />
                }
                label={`Show arrow labels`}
              />
            )}
          />
          <Controller
            name={ToolbarConfigValues.showStars}
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch checked={field.value} onChange={field.onChange} />
                }
                label={`Show rating stars`}
              />
            )}
          />
        </Stack>
      </FormGroup>
      <Stack direction="column" gap={SPACING_GAP}>
        <Controller
          name={ToolbarConfigValues.labelDir}
          control={control}
          render={({ field }) => (
            <DirectionRadio
              label="Cover labels default position:"
              id="cover-labels-default"
              name="labelRadio"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name={ToolbarConfigValues.groupDir}
          control={control}
          render={({ field }) => (
            <DirectionRadio
              label="Group labels default position:"
              id="group-labels-default"
              name="groupRadio"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name={ToolbarConfigValues.starsDir}
          control={control}
          render={({ field }) => (
            <DirectionRadio
              label="Rating stars default position:"
              id="rating-stars-default"
              name="groupRadio"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </Stack>
    </Stack>
  );
};
