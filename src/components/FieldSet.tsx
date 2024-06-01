import { Stack } from '@mui/material';
import { FC, ReactNode } from 'react';

import {
  backColorMap,
  BackColors,
  SPACING_GAP,
  POPOVER_BACK_COLOR,
} from 'types';

interface FieldSetProps {
  label: string;
  children: ReactNode[];
  direction: 'row' | 'column';
  gap?: number;
  flexWrap?: 'wrap' | 'nowrap';
}

export const FieldSet: FC<FieldSetProps> = ({
  label,
  children,
  direction,
  gap = SPACING_GAP,
  flexWrap = 'wrap',
}) => {
  return (
    <Stack
      component="fieldset"
      direction={direction}
      gap={gap}
      padding={SPACING_GAP}
      borderColor={POPOVER_BACK_COLOR}
      color={backColorMap[BackColors.DARKER]}
      flexWrap={flexWrap}>
      <legend style={{ textTransform: 'capitalize' }}>{label}</legend>
      {children}
    </Stack>
  );
};
