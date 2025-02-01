import { FC } from 'react';

import {
  GroupCoverSelected,
  GroupDraggable,
  GroupSquare,
  GroupCoverLabels,
} from '.';

export const GroupCover: FC<{
  index: number;
}> = ({ index }) => {
  return (
    <GroupDraggable index={index}>
      <GroupCoverSelected index={index} />
      <GroupSquare index={index} />
      <GroupCoverLabels index={index} />
    </GroupDraggable>
  );
};
