import { Stack, Chip } from '@mui/material';
import { LinkOutlined } from '@mui/icons-material';
import { FC } from 'react';

import { CoverSchema, GroupSchema, SPACING_GAP } from 'types';
import { useShallowMainStore } from 'store';
import { FieldSet } from 'components';
import { formatLabel } from 'utils';

interface ArrowsOfGroupOriginProps {
  id: CoverSchema['id'] | GroupSchema['id'];
  onChange: (from: string, to: string) => void;
}

export const ArrowsOfGroupOrigin: FC<ArrowsOfGroupOriginProps> = ({
  id,
  onChange,
}) => {
  const { getTargetRelatedArrows, groups, removeArrow } = useShallowMainStore(
    (state) => ({
      getTargetRelatedArrows: state.getTargetRelatedArrows,
      groups: state.groups,
      removeArrow: state.removeArrow,
    }),
  );
  const relatedArrows = getTargetRelatedArrows(id);

  const defaultGroupConnections = relatedArrows.flatMap((arrow) => {
    const group = groups.find((grp) => grp.id === arrow.origin.id);
    if (group) {
      return {
        ArrowId: arrow.id,
        ArrowLabel: arrow.title.text,
        ArrowDir: arrow.title.dir,
        targetDir: arrow.target.dir,
        originId: group.id,
        originDir: arrow.origin.dir,
      };
    }
    return [];
  });

  if (defaultGroupConnections.length === 0) return null;

  return (
    <FieldSet
      direction="column"
      label={`Arrows from Groups (${defaultGroupConnections.length})`}
      gap={SPACING_GAP}
      flexWrap="nowrap">
      <Stack direction="row" flexWrap="wrap" gap={SPACING_GAP / 2}>
        {defaultGroupConnections.map((arrow) => {
          const group = groups.find((grp) => grp.id === arrow.originId);

          if (!group) return null;

          return (
            <Chip
              key={arrow.ArrowId}
              icon={<LinkOutlined />}
              component="a"
              label={formatLabel(group.title.text, group.id)}
              onClick={() => onChange(id, arrow.ArrowId)}
              onDelete={(evt) => {
                evt.preventDefault();
                removeArrow(arrow.ArrowId);
              }}
            />
          );
        })}
      </Stack>
    </FieldSet>
  );
};
