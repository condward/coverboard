import { Stack, Chip, Button } from '@mui/material';
import { UpdateOutlined } from '@mui/icons-material';
import { FC, useState } from 'react';

import { useMainStore } from 'store';
import { SPACING_GAP } from 'types';
import { FieldSet } from 'components/FieldSet';
import { formatLabel } from 'utils';

import { BulkUpdateCoversPopover } from '.';

interface ChildCoversOfGroupProps {
  groupId: string;
  onChange: (id1: string, id2: string) => void;
  x: number;
  y: number;
}

export const ChildCoversOfGroup: FC<ChildCoversOfGroupProps> = ({
  groupId,
  onChange,
  x,
  y,
}) => {
  const [open, setOpen] = useState(false);
  const coversInsideGroup = useMainStore((state) =>
    state.getCoversInsideGroup(groupId),
  );
  const groupBound = useMainStore((state) => state.getGroupBounds(groupId));

  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );

  if (coversInsideGroup.length === 0 || !groupBound) return null;

  return (
    <FieldSet
      direction="column"
      label="Child Covers"
      gap={SPACING_GAP}
      flexWrap="nowrap">
      <Stack direction="row" flexWrap="wrap" gap={SPACING_GAP / 2}>
        {coversInsideGroup.map((cover) => {
          return (
            <Chip
              key={cover.id}
              label={formatLabel(cover.title.text, cover.id)}
              onClick={() => onChange(groupId, cover.id)}
              onDelete={(evt) => {
                evt.preventDefault();
                removeCoverAndRelatedLines(cover.id);
              }}
            />
          );
        })}
      </Stack>
      <Button
        variant="contained"
        color="primary"
        type="button"
        onClick={() => setOpen(true)}
        startIcon={<UpdateOutlined />}>
        Bulk update
      </Button>
      {open && (
        <BulkUpdateCoversPopover
          covers={coversInsideGroup}
          onClose={() => setOpen(false)}
          maxBounds={{
            x,
            y,
            width: groupBound.x,
            height: groupBound.y,
          }}
        />
      )}
    </FieldSet>
  );
};
