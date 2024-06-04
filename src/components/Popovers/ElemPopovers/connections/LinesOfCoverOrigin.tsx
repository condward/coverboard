import { Stack, Chip } from '@mui/material';
import { FC } from 'react';

import { CoverSchema, GroupSchema, SPACING_GAP } from 'types';
import { useMainStore } from 'store';
import { FieldSet } from 'components';
import { formatLabel } from 'utils';

interface LinesOfCoverOriginProps {
  id: CoverSchema['id'] | GroupSchema['id'];
  onChange: (from: string, to: string) => void;
}

export const LinesOfCoverOrigin: FC<LinesOfCoverOriginProps> = ({
  id,
  onChange,
}) => {
  const relatedLines = useMainStore((state) => state.getTargetRelatedLines(id));
  const covers = useMainStore((state) => state.covers);
  const removeLine = useMainStore((state) => state.removeLine);

  const defaultCoverConnections = relatedLines.flatMap((line) => {
    const cover = covers.find((cov) => cov.id === line.origin.id);
    if (cover) {
      return {
        lineId: line.id,
        lineDir: line.dir,
        lineLabel: line.text,
        targetDir: line.target.dir,
        originId: cover.id,
        originDir: line.origin.dir,
      };
    }
    return [];
  });

  if (defaultCoverConnections.length === 0) return null;

  return (
    <FieldSet
      direction="column"
      label="Lines from Covers"
      gap={SPACING_GAP}
      flexWrap="nowrap">
      <Stack direction="row" flexWrap="wrap" gap={SPACING_GAP / 2}>
        {defaultCoverConnections.map((line) => {
          const cover = covers.find((cov) => cov.id === line.originId);

          if (!cover) return null;

          return (
            <Chip
              key={line.lineId}
              label={formatLabel(cover.title.text, cover.id)}
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
