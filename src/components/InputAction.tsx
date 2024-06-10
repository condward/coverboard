import { Stack, Box, FormGroup } from '@mui/material';
import { FC, ReactNode } from 'react';

import { SPACING_GAP } from 'types';

interface SliderInputProp {
  input: ReactNode;
  action: ReactNode;
}

export const InputAction: FC<SliderInputProp> = ({ input, action }) => (
  <FormGroup>
    <Stack direction="row" gap={SPACING_GAP} justifyContent="space-between">
      <Box flex="8">{input}</Box>
      <Box flex="2">{action}</Box>
    </Stack>
  </FormGroup>
);
