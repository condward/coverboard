import { Stack, Chip } from '@mui/material';
import { LinkOutlined } from '@mui/icons-material';
import { FC } from 'react';

import { CoverSchema, GroupSchema, SPACING_GAP } from 'types';
import { useMainStore } from 'store';
import { FieldSet } from 'components';
import { formatLabel } from 'utils';

interface ArrowsOfGroupTargetProps {
  id: CoverSchema['id'] | GroupSchema['id'];
  onChange: (from: string, to: string) => void;
}

export const ArrowsOfGroupTarget: FC<ArrowsOfGroupTargetProps> = ({
  id,
  onChange,
}) => {
  const relatedArrows = useMainStore((state) =>
    state.getOriginRelatedArrows(id),
  );

  const groups = useMainStore((state) => state.groups);
  const removeArrow = useMainStore((state) => state.removeArrow);

  const defaultGroupConnections = relatedArrows.flatMap((arrow) => {
    const group = groups.find((grp) => grp.id === arrow.target.id);
    if (group) {
      return {
        ArrowId: arrow.id,
        ArrowLabel: arrow.title.text,
        ArrowDir: arrow.title.dir,
        originDir: arrow.origin.dir,
        targetId: group.id,
        targetDir: arrow.target.dir,
      };
    }
    return [];
  });

  if (defaultGroupConnections.length === 0) return null;

  return (
    <FieldSet
      direction="column"
      label={`Arrows to Groups (${defaultGroupConnections.length})`}
      gap={SPACING_GAP}
      flexWrap="nowrap">
      <Stack direction="row" flexWrap="wrap" gap={SPACING_GAP / 2}>
        {defaultGroupConnections.map((arrow) => {
          const group = groups.find((grp) => grp.id === arrow.targetId);

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
