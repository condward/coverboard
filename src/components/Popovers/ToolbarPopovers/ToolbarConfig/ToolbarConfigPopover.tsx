import { FC, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Stack, Button, Tooltip } from '@mui/material';
import { useAtom } from 'jotai';
import { flushSync } from 'react-dom';
import {
  HideSourceOutlined,
  InfoOutlined,
  LinkOutlined,
  SaveOutlined,
} from '@mui/icons-material';

import {
  ConfigSchema,
  ConfigSchemaOutput,
  ToolConfigIDs,
  configSchema,
  SPACING_GAP,
} from 'types';
import { CommonDialog } from 'components';
import { hideToolbarAtom, useMainStore, useToastStore } from 'store';
import { CoverboardOverview } from 'components/Popovers/ElemPopovers/connections';

import { ToolbarConfigForm } from './ToolbarConfigForm';

export const ToolbarConfigPopover: FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const configs = useMainStore((state) => state.configs);
  const groupsLength = useMainStore((state) => state.groups.length);
  const coversLength = useMainStore((state) => state.covers.length);
  const totalLength = groupsLength + coversLength;

  const updateConfigs = useMainStore((state) => state.updateConfigs);
  const updateAllCovers = useMainStore((state) => state.updateAllCovers);
  const updateAllGroups = useMainStore((state) => state.updateAllGroups);
  const updateAllArrows = useMainStore((state) => state.updateAllArrows);

  const showErrorMessage = useToastStore((state) => state.showErrorMessage);
  const [isToolbarHidden, setHideToolBar] = useAtom(hideToolbarAtom);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ConfigSchema, unknown, ConfigSchemaOutput>({
    resolver: zodResolver(
      configSchema.extend({
        layout: configSchema.shape.layout.extend({
          scale: z.number().min(0.5).max(1.5),
        }),
      }),
    ),
    defaultValues: {
      ...configs,
      layout: { ...configs.layout, scale: configs.layout.scale / 100 },
    },
  });

  const onSubmit = handleSubmit(
    (config) => {
      updateAllCovers({
        title: { dir: config.covers.title.dir },
        subtitle: { dir: config.covers.subtitle.dir },
      });
      updateAllGroups({
        title: { dir: config.groups.title.dir },
        subtitle: { dir: config.groups.subtitle.dir },
      });
      updateAllArrows({
        title: { dir: config.covers.title.dir },
      });
      flushSync(() =>
        updateConfigs({
          ...config,
          title: {
            ...config.title,
            text: config.title.text.trim(),
          },
          layout: {
            ...config.layout,
            scale: config.layout.scale * 100,
          },
        }),
      );
      onClose();
    },
    (error) => {
      const errorMessage = Object.values(error).map((err) => err.message)[0];

      if (errorMessage) {
        showErrorMessage(errorMessage);
      }
    },
  );

  const [openOverview, setOverviewOpen] = useState(false);

  return (
    <CommonDialog
      onClose={onClose}
      onSubmit={onSubmit}
      title="Options"
      hash={ToolConfigIDs.CONFIG}
      content={
        <Stack gap={SPACING_GAP}>
          <ToolbarConfigForm control={control} />
          {openOverview && (
            <CoverboardOverview onClose={() => setOverviewOpen(false)} />
          )}
        </Stack>
      }
      header={
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
              <p>H - toggle show and hide toolbar</p>
              <h3>Misc.</h3>
              <p>E - edit title</p>
              <p>F - toggle fit to screen</p>
              <p>N - next cover and group</p>
              <p>P - prev cover or group</p>
              <h3>When elem selected</h3>
              <p>Delete - delete elem</p>
              <p>Enter - open config popover</p>
              <p>Esc - exit selection</p>
              <p>ArrowKeys - select arrow direction and move</p>
            </>
          }>
          <Button
            variant="outlined"
            color="info"
            type="button"
            startIcon={<InfoOutlined />}>
            Shortcut keys
          </Button>
        </Tooltip>
      }
      actions={
        <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<LinkOutlined />}
            disabled={totalLength === 0}
            onClick={() => setOverviewOpen(true)}>
            Links
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<HideSourceOutlined />}
            onClick={() => {
              setHideToolBar((t) => !t);
              onClose();
            }}>
            {isToolbarHidden ? 'Show Toolbar' : 'Hide Toolbar'}
          </Button>
          <Button
            disabled={!isDirty}
            variant="contained"
            color="primary"
            startIcon={<SaveOutlined />}
            type="submit">
            Save
          </Button>
        </Stack>
      }
    />
  );
};
