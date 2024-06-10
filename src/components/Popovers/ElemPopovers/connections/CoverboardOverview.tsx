import { Alert, Button, Chip, Stack } from '@mui/material';
import { useSetAtom } from 'jotai';
import { AddOutlined, LinkOutlined } from '@mui/icons-material';
import { FC, useState } from 'react';

import { selectedAtom, useMainStore } from 'store';
import { CoverSchema, GroupSchema, SPACING_GAP } from 'types';
import { formatLabel } from 'utils';

import { FieldSet } from 'components/FieldSet';
import { CommonDialog } from 'components/CommonDialog';

import { AddLinePopover } from '../AddLinePopover';
import { AddGroupPopover } from '../AddGroupPopover';

type RecursiveTypeGroup = Record<
  string,
  Record<string, GroupSchema | CoverSchema>
>;

interface CoverboardOverviewprops {
  onClose: () => void;
}

export const CoverboardOverview: FC<CoverboardOverviewprops> = ({
  onClose,
}) => {
  const setSelected = useSetAtom(selectedAtom);
  const covers = useMainStore((state) => state.covers);
  const groups = useMainStore((state) => state.groups);
  const lines = useMainStore((state) => state.lines);
  const groupsInsideGroup = useMainStore((state) => state.getGroupsInsideGroup);
  const coversInsideGroup = useMainStore((state) => state.getCoversInsideGroup);
  const removeGroupAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );
  const totalElements = covers.length + groups.length;
  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );
  const removeLine = useMainStore((state) => state.removeLine);

  const groupConnections: RecursiveTypeGroup = {};
  groups.forEach((group) => {
    const insideGroups = groupsInsideGroup(group.id);

    if (insideGroups.length > 0) {
      groupConnections[group.id] = {};
      insideGroups.forEach((inside) => {
        groupConnections[group.id][inside.id] =
          groupConnections[group.id][inside.id] ?? {};
        groupConnections[group.id][inside.id] = group;
      });
    }
  });

  groups.forEach((group) => {
    const insideCovers = coversInsideGroup(group.id);

    if (insideCovers.length > 0) {
      groupConnections[group.id] = {};
      insideCovers.forEach((inside) => {
        groupConnections[group.id][inside.id] =
          groupConnections[group.id][inside.id] ?? {};
        groupConnections[group.id][inside.id] = inside;
      });
    }
  });

  const [openAddLine, setOpenAddLine] = useState(false);
  const [openAddGrp, setOpenAddGrp] = useState(false);

  return (
    <CommonDialog
      onClose={onClose}
      opaque
      isForm={false}
      title="Links"
      actions={
        <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
          <Button
            variant="outlined"
            color="secondary"
            type="button"
            startIcon={<AddOutlined />}
            disabled={totalElements < 2}
            onClick={() => setOpenAddLine(true)}>
            Add Arrow
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            type="button"
            disabled={groups.length > 24}
            startIcon={<AddOutlined />}
            onClick={() => setOpenAddGrp(true)}>
            Add Group
          </Button>
        </Stack>
      }
      content={
        <>
          {openAddLine && (
            <AddLinePopover onClose={() => setOpenAddLine(false)} />
          )}
          {openAddGrp && (
            <AddGroupPopover onClose={() => setOpenAddGrp(false)} />
          )}
          {totalElements === 0 && (
            <Alert severity="error">
              There are no elements on the screen. Add a group or search for
              media.
            </Alert>
          )}
          {groups.length > 0 && (
            <FieldSet
              direction="column"
              label={`All groups (${groups.length})`}
              gap={SPACING_GAP}
              flexWrap="nowrap">
              <Stack direction="row" flexWrap="wrap" gap={SPACING_GAP / 2}>
                {groups.map((group) => {
                  return (
                    <Chip
                      key={group.id}
                      icon={<LinkOutlined />}
                      component="a"
                      label={formatLabel(group.title.text, group.id)}
                      onClick={() => setSelected({ id: group.id, open: true })}
                      onDelete={(evt) => {
                        evt.preventDefault();
                        removeGroupAndRelatedLines(group.id);
                      }}
                    />
                  );
                })}
              </Stack>
            </FieldSet>
          )}
          {covers.length > 0 && (
            <FieldSet
              direction="column"
              label={`All covers (${covers.length})`}
              gap={SPACING_GAP}
              flexWrap="nowrap">
              <Stack direction="row" flexWrap="wrap" gap={SPACING_GAP / 2}>
                {covers.map((cover) => {
                  return (
                    <Chip
                      key={cover.id}
                      icon={<LinkOutlined />}
                      component="a"
                      label={formatLabel(cover.title.text, cover.id)}
                      onClick={() => setSelected({ id: cover.id, open: true })}
                      onDelete={(evt) => {
                        evt.preventDefault();
                        removeGroupAndRelatedLines(cover.id);
                      }}
                    />
                  );
                })}
              </Stack>
            </FieldSet>
          )}
          {Object.entries(groupConnections).map(
            ([groupId, groupConnection]) => {
              return (
                <FieldSet
                  key={groupId}
                  direction="column"
                  label={`Childs of ${formatLabel(groups.find((grp) => grp.id === groupId)?.title.text ?? '', groupId)} (${Object.keys(groupConnection).length})`}
                  gap={SPACING_GAP}
                  flexWrap="nowrap">
                  <Stack direction="row" flexWrap="wrap" gap={SPACING_GAP / 2}>
                    {Object.entries(groupConnection).map(
                      ([childGroupId, childGroup]) => {
                        const foundGroupElem = groups.find(
                          (group) => group.id === childGroupId,
                        );

                        const prefix = foundGroupElem ? 'group' : 'cover';

                        return (
                          <Chip
                            key={childGroupId}
                            icon={<LinkOutlined />}
                            component="a"
                            label={`${prefix}: ${formatLabel(childGroup.title.text, childGroupId)}`}
                            onClick={() =>
                              setSelected({ id: childGroupId, open: true })
                            }
                            onDelete={(evt) => {
                              evt.preventDefault();
                              if (foundGroupElem) {
                                removeGroupAndRelatedLines(childGroupId);
                              } else {
                                removeCoverAndRelatedLines(childGroupId);
                              }
                            }}
                          />
                        );
                      },
                    )}
                  </Stack>
                </FieldSet>
              );
            },
          )}
          {lines.length > 0 && (
            <FieldSet
              direction="column"
              label={`All Arrows (${lines.length})`}
              gap={SPACING_GAP}
              flexWrap="nowrap">
              <Stack direction="row" flexWrap="wrap" gap={SPACING_GAP / 2}>
                {lines.map((line) => {
                  return (
                    <Chip
                      key={line.id}
                      icon={<LinkOutlined />}
                      component="a"
                      label={formatLabel(line.title.text, line.id)}
                      onClick={() => setSelected({ id: line.id, open: true })}
                      onDelete={(evt) => {
                        evt.preventDefault();
                        removeLine(line.id);
                      }}
                    />
                  );
                })}
              </Stack>
            </FieldSet>
          )}
        </>
      }
    />
  );
};
