import { FC } from 'react';

import { GroupSchema } from 'types';
import { CommonDrawArrow } from 'CoverBoard/Common';

import { GroupSquare } from './GroupSquare';
import { GroupCoverLabels } from './GroupCoverLabels';
import { GroupDraggable } from '.';

export const GroupCover: FC<{
  group: GroupSchema;
}> = ({ group }) => {
  const {
    id,
    scale: { x: scaleX, y: scaleY },
  } = group;

  return (
    <GroupDraggable group={group}>
      <CommonDrawArrow id={id} scaleX={scaleX} scaleY={scaleY} />
      <GroupSquare id={id} scaleX={scaleX} scaleY={scaleY} />
      <GroupCoverLabels group={group} />
    </GroupDraggable>
  );
};
