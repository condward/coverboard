import { FC, useState } from 'react';
import { Button, Stack } from '@mui/material';
import { AddOutlined } from '@mui/icons-material';

import { GroupSchema, SPACING_GAP } from 'types';

import { CommonDialog } from 'components';
import { useShallowMainStore } from 'store';

import { AddArrowPopover } from '../AddArrowPopover';
import { GroupConnections } from './GroupConnections';

interface GroupPopoverProps {
  onClose: (id?: string) => void;
  onChange: (id1: string, id2: string) => void;
  group: GroupSchema;
}

export const GroupConnectionPopover: FC<GroupPopoverProps> = ({
  group,
  onClose,
  onChange,
}) => {
  const disabled = useShallowMainStore(
    (state) => state.groups.length === 1 && state.covers.length === 0,
  );
  const [openConn, setOpenConn] = useState(false);

  return (
    <CommonDialog
      onClose={() => onClose(group.id)}
      title="Group Links"
      opaque
      isForm={false}
      content={
        <>
          <GroupConnections groupId={group.id} onChange={onChange} />
          {openConn && (
            <AddArrowPopover
              originId={group.id}
              onClose={() => setOpenConn(false)}
            />
          )}
        </>
      }
      actions={
        <Stack direction="row" gap={SPACING_GAP} flexWrap="wrap">
          <Button
            disabled={disabled}
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
