import { Chip, Stack } from '@mui/material';
import { useSetAtom } from 'jotai';
import { LinkOutlined } from '@mui/icons-material';
import { FC } from 'react';

import { selectedAtom, useMainStore } from 'store';
import { CoverSchema, GroupSchema, SPACING_GAP } from 'types';
import { formatLabel } from 'utils';

import { FieldSet } from 'components/FieldSet';
import { CommonDialog } from 'components/CommonDialog';

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
  const groupsInsideGroup = useMainStore((state) => state.getGroupsInsideGroup);
  const coversInsideGroup = useMainStore((state) => state.getCoversInsideGroup);
  const removeGroupAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );
  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );

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

  return (
    <CommonDialog
      onClose={onClose}
      opaque
      isForm={false}
      title="Overview"
      content={
        <>
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
                            label={`${prefix}:${formatLabel(childGroup.title.text, childGroupId)}`}
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
        </>
      }
    />
  );
};
