import { FC } from 'react';

import { CommonDrawArrow } from 'CoverBoard/Common';

import { GroupSquare } from './GroupSquare';
import { GroupCoverLabels } from './GroupCoverLabels';
import { GroupDraggable } from '.';

export const GroupCover: FC<{
  index: number;
}> = ({ index }) => {
  return (
    <GroupDraggable index={index}>
      <CommonDrawArrow index={index} type="group" />
      <GroupSquare index={index} />
      <GroupCoverLabels index={index} />
    </GroupDraggable>
  );
};
