import { Stack, Chip } from '@mui/material';
import { LinkOutlined } from '@mui/icons-material';
import { FC } from 'react';

import { CoverSchema, GroupSchema, SPACING_GAP } from 'types';
import { useMainStore } from 'store';
import { FieldSet } from 'components';
import { formatLabel } from 'utils';

interface LinesOfCoverTargetProps {
  id: CoverSchema['id'] | GroupSchema['id'];
  onChange: (from: string, to: string) => void;
}

export const LinesOfCoverTarget: FC<LinesOfCoverTargetProps> = ({
  id,
  onChange,
}) => {
  const relatedLines = useMainStore((state) => state.getOriginRelatedLines(id));
  const covers = useMainStore((state) => state.covers);
  const removeLine = useMainStore((state) => state.removeLine);

  const defaultCoverConnections = relatedLines.flatMap((line) => {
    const cover = covers.find((cov) => cov.id === line.target.id);
    if (cover) {
      return {
        lineId: line.id,
        lineDir: line.title.dir,
        lineLabel: line.title.text,
        originDir: line.origin.dir,
        targetId: cover.id,
        targetDir: line.target.dir,
      };
    }
    return [];
  });

  if (defaultCoverConnections.length === 0) return null;

  return (
    <FieldSet
      direction="column"
      label={`Lines to Covers (${defaultCoverConnections.length})`}
      gap={SPACING_GAP}
      flexWrap="nowrap">
      <Stack direction="row" flexWrap="wrap" gap={SPACING_GAP / 2}>
        {defaultCoverConnections.map((line) => {
          const cover = covers.find((cov) => cov.id === line.targetId);

          if (!cover) return null;

          return (
            <Chip
              key={line.lineId}
              icon={<LinkOutlined />}
              component="a"
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
