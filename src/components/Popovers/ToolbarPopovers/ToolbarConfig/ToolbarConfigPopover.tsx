import { FC } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Stack, Button, Tooltip } from '@mui/material';

import {
  ConfigSchema,
  ConfigSchemaOutput,
  ToolConfigIDs,
  ToolbarConfigValues,
  configSchema,
} from 'types';
import { CommonDialog, SPACING_GAP } from 'components';
import { useMainStore } from 'store';

import { ToolbarConfigForm } from './ToolbarConfigForm';

export const ToolbarConfigPopover: FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const configs = useMainStore((state) => state.configs);
  const updateConfigs = useMainStore((state) => state.updateConfigs);
  const updateAllCoversDir = useMainStore((state) => state.updateAllCoversDir);
  const updateAllStarsDir = useMainStore((state) => state.updateAllStarsDir);
  const updateAllGroupsDir = useMainStore((state) => state.updateAllGroupsDir);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ConfigSchema, unknown, ConfigSchemaOutput>({
    resolver: zodResolver(
      configSchema.extend({ size: z.number().min(0.5).max(1.5) }),
    ),
    defaultValues: { ...configs, size: configs.size / 100 },
  });

  const onSubmit = handleSubmit((config) => {
    updateAllCoversDir(config[ToolbarConfigValues.labelDir]);
    updateAllStarsDir(config[ToolbarConfigValues.starsDir]);
    updateAllGroupsDir(config[ToolbarConfigValues.groupDir]);
    updateConfigs({
      ...config,
      title: config.title.trim(),
      size: config.size * 100,
    });
    onClose();
  });

  return (
    <CommonDialog
      open
      onClose={onClose}
      onSubmit={onSubmit}
      title="Options"
      hash={ToolConfigIDs.CONFIG}
      content={<ToolbarConfigForm control={control} />}
      actions={
        <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
          <Tooltip
            title={
              <>
                <h3>Toolbar (no selections)</h3>
                <p>A - open Search and add</p>
                <p>O - open Options</p>
                <p>S - open Share and save</p>
                <p>G - create group</p>
                <p>C - download image of board</p>
                <p>U or CTRL+Z - undo</p>
                <h3>Misc.</h3>
                <p>E - edit title</p>
                <p>N - next cover and group</p>
                <p>P - prev cover or group</p>
                <h3>When elem selected</h3>
                <p>Delete - delete elem</p>
                <p>Enter - open config popover</p>
                <p>Esc - exit selection</p>
                <p>ArrowKeys - select arrow direction</p>
              </>
            }>
            <Button variant="outlined" color="info" type="button">
              Keyboard Shortcuts
            </Button>
          </Tooltip>
          <Button
            disabled={!isDirty}
            variant="contained"
            color="primary"
            type="submit">
            Submit
          </Button>
        </Stack>
      }
    />
  );
};
