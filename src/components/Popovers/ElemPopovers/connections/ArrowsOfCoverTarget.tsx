import { Stack, Chip } from '@mui/material';
import { LinkOutlined } from '@mui/icons-material';
import { FC } from 'react';

import { CoverSchema, GroupSchema, SPACING_GAP } from 'types';
import { useShallowMainStore } from 'store';
import { FieldSet } from 'components';
import { formatLabel } from 'utils';

interface ArrowsOfCoverTargetProps {
  id: CoverSchema['id'] | GroupSchema['id'];
  onChange: (from: string, to: string) => void;
}

export const ArrowsOfCoverTarget: FC<ArrowsOfCoverTargetProps> = ({
  id,
  onChange,
}) => {
  const { getTargetRelatedArrows, covers, removeArrow } = useShallowMainStore(
    (state) => ({
      getTargetRelatedArrows: state.getTargetRelatedArrows,
      covers: state.covers,
      removeArrow: state.removeArrow,
    }),
  );
  const relatedArrows = getTargetRelatedArrows(id);

  const defaultCoverConnections = relatedArrows.flatMap((arrow) => {
    const cover = covers.find((cov) => cov.id === arrow.target.id);
    if (cover) {
      return {
        ArrowId: arrow.id,
        ArrowDir: arrow.title.dir,
        ArrowLabel: arrow.title.text,
        originDir: arrow.origin.dir,
        targetId: cover.id,
        targetDir: arrow.target.dir,
      };
    }
    return [];
  });

  if (defaultCoverConnections.length === 0) return null;

  return (
    <FieldSet
      direction="column"
      label={`Arrows to Covers (${defaultCoverConnections.length})`}
      gap={SPACING_GAP}
      flexWrap="nowrap">
      <Stack direction="row" flexWrap="wrap" gap={SPACING_GAP / 2}>
        {defaultCoverConnections.map((arrow) => {
          const cover = covers.find((cov) => cov.id === arrow.targetId);

          if (!cover) return null;

          return (
            <Chip
              key={arrow.ArrowId}
              icon={<LinkOutlined />}
              component="a"
              label={formatLabel(cover.title.text, cover.id)}
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
