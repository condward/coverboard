import { FC, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Stack, Button, Tooltip } from '@mui/material';
import { useAtom } from 'jotai';
import { flushSync } from 'react-dom';
import {
  HideSourceOutlined,
  InfoOutlined,
  LinkOutlined,
} from '@mui/icons-material';

import {
  ConfigSchema,
  ConfigSchemaOutput,
  ToolConfigIDs,
  configSchema,
  SPACING_GAP,
  KeyboardShortcuts,
} from 'types';
import { CommonDialog, SubmitButton } from 'components';
import { hideToolbarAtom, useShallowMainStore, useToastStore } from 'store';
import { useForm } from 'utils';
import { CoverboardOverview } from 'components/Popovers/ElemPopovers/connections';

import { ToolbarConfigForm } from './ToolbarConfigForm';

export const ToolbarConfigPopover: FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const showErrorMessage = useToastStore((state) => state.showErrorMessage);
  const {
    getConfigs,
    totalLength,
    updateConfigs,
    updateAllCovers,
    updateAllGroups,
    updateAllArrows,
  } = useShallowMainStore((state) => ({
    getConfigs: state.getConfigs,
    totalLength: state.groups.length + state.covers.length,
    updateConfigs: state.updateConfigs,
    updateAllCovers: state.updateAllCovers,
    updateAllGroups: state.updateAllGroups,
    updateAllArrows: state.updateAllArrows,
  }));
  const configs = getConfigs();

  const [isToolbarHidden, setHideToolBar] = useAtom(hideToolbarAtom);

  const [openOverview, setOverviewOpen] = useState(false);

  const { control, handleSubmit } = useForm<
    ConfigSchema,
    unknown,
    ConfigSchemaOutput
  >({
    resolver: zodResolver(
      configSchema.extend({
        layout: configSchema.shape.layout.extend({
          scale: z.coerce.number().min(0.5).max(1.5),
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
              <p>{KeyboardShortcuts.SEARCH} - open Search and add</p>
              <p>{KeyboardShortcuts.CONFIG} - open Options</p>
              <p>{KeyboardShortcuts.SHARE} - open Share and save</p>
              <p>{KeyboardShortcuts.GROUP} - create group</p>
              <p>{KeyboardShortcuts.SCREENSHOT} - download image of board</p>
              <p>{KeyboardShortcuts.UNDO} or CTRL+Z - undo</p>
              <p>
                {KeyboardShortcuts.HIDE_TOOLBAR} - toggle show and hide toolbar
              </p>
              <h3>Misc.</h3>
              <p>{KeyboardShortcuts.TITLE} - edit title</p>
              <p>{KeyboardShortcuts.FIT_SCREEN} - toggle fit to screen</p>
              <p>{KeyboardShortcuts.NEXT} - next cover and group</p>
              <p>{KeyboardShortcuts.PREV} - prev cover or group</p>
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
          <SubmitButton control={control} />
        </Stack>
      }
    />
  );
};
