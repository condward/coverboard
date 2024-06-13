import { Stack } from '@mui/material';
import { FC } from 'react';

import { SPACING_GAP } from 'types';
import { useMainStore } from 'store';

import { NavigationBar } from './NavigationBar';
import { ArrowsOfCoverOrigin } from './ArrowsOfCoverOrigin';
import { ArrowsOfCoverTarget } from './ArrowsOfCoverTarget';
import { ArrowsOfGroupOrigin } from './ArrowsOfGroupOrigin';
import { ArrowsOfGroupTarget } from './ArrowsOfGroupTarget';
import { ChildCoversOfGroup } from './ChildCoversOfGroup';
import { ChildGroupsOfGroup } from './ChildGroupsOfGroup';
import { ParentGroupsOfGroup } from './ParentGroupsOfGroup';

interface GroupConnectionsProps {
  groupId: string;
  onChange: (id1: string, id2: string) => void;
}

export const GroupConnections: FC<GroupConnectionsProps> = ({
  groupId,
  onChange,
}) => {
  const groupIdx = useMainStore((state) =>
    state.groups.findIndex((grp) => grp.id === groupId),
  );
  const groups = useMainStore((state) => state.groups);
  const prevGroup = groupIdx > 0 ? groups[groupIdx - 1] : undefined;
  const nextGroup =
    groupIdx < groups.length - 1 ? groups[groupIdx + 1] : undefined;

  return (
    <Stack gap={SPACING_GAP}>
      <NavigationBar
        id={groupId}
        onChange={onChange}
        prev={
          prevGroup
            ? {
                id: prevGroup.id,
                title: prevGroup.title.text,
              }
            : undefined
        }
        next={
          nextGroup
            ? {
                id: nextGroup.id,
                title: nextGroup.title.text,
              }
            : undefined
        }
      />
      <ChildCoversOfGroup groupId={groupId} onChange={onChange} />
      <ChildGroupsOfGroup groupId={groupId} onChange={onChange} />
      <ParentGroupsOfGroup groupId={groupId} onChange={onChange} />
      <ArrowsOfCoverOrigin id={groupId} onChange={onChange} />
      <ArrowsOfCoverTarget id={groupId} onChange={onChange} />
      <ArrowsOfGroupOrigin id={groupId} onChange={onChange} />
      <ArrowsOfGroupTarget id={groupId} onChange={onChange} />
    </Stack>
  );
};
