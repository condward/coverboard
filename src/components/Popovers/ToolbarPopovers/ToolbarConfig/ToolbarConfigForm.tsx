import { FC } from 'react';
import { TextField, Stack } from '@mui/material';
import { Controller, useWatch } from 'react-hook-form';
import type { Control } from 'react-hook-form';

import { ConfigSchema, mediaMap, SPACING_GAP } from 'types';
import {
  SliderInput,
  DirectionRadio,
  FieldSet,
  ColorPicker,
  BackColorPicker,
  CommonTabs,
  ShowSwitch,
} from 'components';
import { useMainStore } from 'store';
import { useGetSizesContext } from 'providers';

export const ToolbarConfigForm: FC<{
  control: Control<ConfigSchema>;
}> = ({ control }) => {
  const showScreenSizes = useWatch({
    control,
    name: 'layout.fitToScreen',
  });
  const { canvasLimits } = useGetSizesContext();
  const media = useMainStore((state) => state.configs.media);

  return (
    <CommonTabs
      tabs={[
        {
          label: 'Layout',
          value: 'layout',
          component: (
            <Stack direction="column" gap={SPACING_GAP}>
              <Controller
                name="layout.color"
                control={control}
                render={({ field }) => (
                  <ColorPicker
                    autoFocus
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <Controller
                name="layout.backColor"
                control={control}
                render={({ field }) => (
                  <BackColorPicker
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <FieldSet label="Title" direction="column" gap={SPACING_GAP}>
                <Controller
                  name="title.text"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Title"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                <Controller
                  name="title.show"
                  control={control}
                  render={({ field }) => (
                    <ShowSwitch
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </FieldSet>

              <Stack direction="column" gap={SPACING_GAP}>
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

                <Controller
                  name="layout.fitToScreen"
                  control={control}
                  render={({ field }) => (
                    <ShowSwitch
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      label="Fit to screen"
                    />
                  )}
                />
                <Stack direction="row" gap={SPACING_GAP}>
                  <Controller
                    name="layout.width"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        type="number"
                        label="Width"
                        disabled={showScreenSizes}
                        value={
                          showScreenSizes ? canvasLimits.width : field.value
                        }
                        onChange={field.onChange}
                        InputProps={{
                          inputProps: {
                            min: 500,
                            max: 4000,
                            step: 1,
                          },
                        }}
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
                        disabled={showScreenSizes}
                        value={
                          showScreenSizes ? canvasLimits.height : field.value
                        }
                        onChange={field.onChange}
                        InputProps={{
                          inputProps: {
                            min: 500,
                            max: 4000,
                            step: 1,
                          },
                        }}
                      />
                    )}
                  />
                </Stack>

                <Controller
                  name="layout.helpers"
                  control={control}
                  render={({ field }) => (
                    <ShowSwitch
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      label="Show empty texts helpers"
                    />
                  )}
                />
              </Stack>
            </Stack>
          ),
        },
        {
          label: 'Covers',
          value: 'cover',
          component: (
            <Stack direction="column" gap={SPACING_GAP}>
              <Controller
                name="covers.color"
                control={control}
                render={({ field }) => (
                  <ColorPicker
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <FieldSet
                label={mediaMap[media].title.label}
                direction="column"
                gap={0}>
                <Controller
                  name="covers.title.dir"
                  control={control}
                  render={({ field }) => (
                    <DirectionRadio
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="covers.title.show"
                  control={control}
                  render={({ field }) => (
                    <ShowSwitch
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </FieldSet>
              <FieldSet
                label={mediaMap[media].subtitle.label}
                direction="column"
                gap={0}>
                <Controller
                  name="covers.subtitle.dir"
                  control={control}
                  render={({ field }) => (
                    <DirectionRadio
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="covers.subtitle.show"
                  control={control}
                  render={({ field }) => (
                    <ShowSwitch
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </FieldSet>
              <FieldSet label="Rating" direction="column" gap={0}>
                <Controller
                  name="covers.rating.dir"
                  control={control}
                  render={({ field }) => (
                    <DirectionRadio
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="covers.rating.show"
                  control={control}
                  render={({ field }) => (
                    <ShowSwitch
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </FieldSet>
            </Stack>
          ),
        },
        {
          label: 'Groups',
          value: 'group',
          component: (
            <Stack direction="column" gap={SPACING_GAP}>
              <Controller
                name="groups.color"
                control={control}
                render={({ field }) => (
                  <ColorPicker
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="groups.backColor"
                control={control}
                render={({ field }) => (
                  <BackColorPicker
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <FieldSet label="Title" direction="column" gap={0}>
                <Controller
                  name="groups.title.dir"
                  control={control}
                  render={({ field }) => (
                    <DirectionRadio
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="groups.title.show"
                  control={control}
                  render={({ field }) => (
                    <ShowSwitch
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </FieldSet>
              <FieldSet label="Description" direction="column" gap={0}>
                <Controller
                  name="groups.subtitle.dir"
                  control={control}
                  render={({ field }) => (
                    <DirectionRadio
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="groups.subtitle.show"
                  control={control}
                  render={({ field }) => (
                    <ShowSwitch
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </FieldSet>
            </Stack>
          ),
        },
        {
          label: 'Arrows',
          value: 'arrow',
          component: (
            <Stack direction="column" gap={SPACING_GAP}>
              <Controller
                name="arrows.color"
                control={control}
                render={({ field }) => (
                  <ColorPicker
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <FieldSet label="Label" direction="column" gap={0}>
                <Controller
                  name="arrows.title.dir"
                  control={control}
                  render={({ field }) => (
                    <DirectionRadio
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="arrows.title.show"
                  control={control}
                  render={({ field }) => (
                    <ShowSwitch
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </FieldSet>
              <FieldSet label="Circle" direction="column" gap={0}>
                <Controller
                  name="arrows.circle.show"
                  control={control}
                  render={({ field }) => (
                    <ShowSwitch
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </FieldSet>
            </Stack>
          ),
        },
      ]}
    />
  );
};
