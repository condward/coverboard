import { Stack, Chip } from '@mui/material';
import { FC } from 'react';

import { CoverSchema, GroupSchema, SPACING_GAP } from 'types';
import { useMainStore } from 'store';
import { FieldSet } from 'components';
import { formatLabel } from 'utils';

interface LinesOfGroupTargetProps {
  id: CoverSchema['id'] | GroupSchema['id'];
  onChange: (from: string, to: string) => void;
}

export const LinesOfGroupTarget: FC<LinesOfGroupTargetProps> = ({
  id,
  onChange,
}) => {
  const relatedLines = useMainStore((state) => state.getOriginRelatedLines(id));

  const groups = useMainStore((state) => state.groups);
  const removeLine = useMainStore((state) => state.removeLine);

  const defaultGroupConnections = relatedLines.flatMap((line) => {
    const group = groups.find((grp) => grp.id === line.target.id);
    if (group) {
      return {
        lineId: line.id,
        lineLabel: line.text,
        lineDir: line.dir,
        originDir: line.origin.dir,
        targetId: group.id,
        targetDir: line.target.dir,
      };
    }
    return [];
  });

  if (defaultGroupConnections.length === 0) return null;

  return (
    <FieldSet
      direction="column"
      label="Lines to Groups"
      gap={SPACING_GAP}
      flexWrap="nowrap">
      <Stack direction="row" flexWrap="wrap" gap={SPACING_GAP / 2}>
        {defaultGroupConnections.map((line) => {
          const group = groups.find((grp) => grp.id === line.targetId);

          if (!group) return null;

          return (
            <Chip
              key={line.lineId}
              label={formatLabel(group.title.text, group.id)}
              onClick={() => onChange(id, line.lineId)}
              onDelete={(evt) => {
                evt.preventDefault();
                removeLine(line.lineId);
              }}
            />
          );
        })}
      </Stack>
    </FieldSet>
  );
};
