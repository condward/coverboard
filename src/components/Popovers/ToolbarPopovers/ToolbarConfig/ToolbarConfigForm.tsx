import { FC } from 'react';
import { Stack } from '@mui/material';
import { Controller } from 'react-hook-form';
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
  TextInput,
} from 'components';
import { useMainStore } from 'store';
import { useGetSizesContext } from 'providers';
import WatchController from 'utils/WatchController';

export const ToolbarConfigForm: FC<{
  control: Control<ConfigSchema>;
}> = ({ control }) => {
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
              <FieldSet label="Title" direction="column" gap={SPACING_GAP}>
                <Controller
                  name="title.text"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextInput
                      fullWidth
                      autoFocus
                      label="Title"
                      value={field.value}
                      onChange={field.onChange}
                      formError={error}
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

              <Controller
                name="layout.color"
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

              <Stack direction="column" gap={SPACING_GAP}>
                <Controller
                  name="layout.scale"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <SliderInput
                      label="Elements scale"
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      min={0.5}
                      max={1.5}
                      step={0.1}
                      formError={error}
                    />
                  )}
                />

                <Stack direction="row">
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

                <Stack direction="row" gap={SPACING_GAP}>
                  <WatchController
                    name="layout.width"
                    watch="layout.fitToScreen"
                    control={control}
                    render={({
                      field,
                      fieldState: { error },
                      watched: showScreenSizes,
                    }) => (
                      <TextInput
                        fullWidth
                        formError={error}
                        type="number"
                        label="Width"
                        disabled={showScreenSizes}
                        value={
                          showScreenSizes ? canvasLimits.width : field.value
                        }
                        onChange={field.onChange}
                        slotProps={{
                          htmlInput: {
                            min: 500,
                            max: 4000,
                            step: 1,
                          },
                        }}
                      />
                    )}
                  />
                  <WatchController
                    name="layout.height"
                    control={control}
                    watch="layout.fitToScreen"
                    render={({
                      field,
                      fieldState: { error },
                      watched: showScreenSizes,
                    }) => (
                      <TextInput
                        fullWidth
                        formError={error}
                        type="number"
                        label="height"
                        disabled={showScreenSizes}
                        value={
                          showScreenSizes ? canvasLimits.height : field.value
                        }
                        onChange={field.onChange}
                        slotProps={{
                          htmlInput: {
                            min: 500,
                            max: 4000,
                            step: 1,
                          },
                        }}
                      />
                    )}
                  />
                </Stack>
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
