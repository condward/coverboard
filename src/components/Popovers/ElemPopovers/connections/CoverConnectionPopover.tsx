import { FC, useState } from 'react';
import { Button, Stack } from '@mui/material';
import { AddOutlined } from '@mui/icons-material';

import { CoverSchema, SPACING_GAP } from 'types';

import { CommonDialog } from 'components';
import { useShallowMainStore } from 'store';

import { AddArrowPopover } from '../AddArrowPopover';
import { CoverConnections } from './CoverConnections';

interface CoverPopoverProps {
  onClose: (id?: string) => void;
  onChange: (id1: string, id2: string) => void;
  cover: CoverSchema;
}

export const CoverConnectionPopover: FC<CoverPopoverProps> = ({
  cover,
  onClose,
  onChange,
}) => {
  const { getGroups, getCovers } = useShallowMainStore((state) => ({
    getGroups: state.getGroups,
    getCovers: state.getCovers,
  }));
  const covers = getCovers();
  const groups = getGroups();

  const [openConn, setOpenConn] = useState(false);

  return (
    <CommonDialog
      onClose={() => onClose(cover.id)}
      title="Cover Links"
      opaque
      isForm={false}
      content={
        <>
          <CoverConnections coverId={cover.id} onChange={onChange} />
          {openConn && (
            <AddArrowPopover
              originId={cover.id}
              onClose={() => setOpenConn(false)}
            />
          )}
        </>
      }
      actions={
        <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
          <Button
            disabled={covers.length === 1 && groups.length === 0}
            variant="outlined"
            color="secondary"
            type="button"
            startIcon={<AddOutlined />}
            onClick={() => setOpenConn(true)}>
            Add Arrow
          </Button>
        </Stack>
      }
    />
  );
};
