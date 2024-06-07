import {
  ArrowCircleLeftOutlined,
  ArrowCircleRightOutlined,
} from '@mui/icons-material';
import { FC } from 'react';
import { Stack, Button } from '@mui/material';

import { formatLabel } from 'utils';

interface NavigatioNbarProps {
  id: string;
  onChange: (id1: string, id2: string) => void;
  prev?: {
    title: string;
    id: string;
  };
  next?: {
    title: string;
    id: string;
  };
}

export const NavigationBar: FC<NavigatioNbarProps> = ({
  id,
  onChange,
  prev,
  next,
}) => {
  return (
    <Stack direction="row" flexWrap="wrap" justifyContent="space-between">
      <Button
        variant="outlined"
        type="button"
        component="a"
        color="primary"
        disabled={!prev}
        startIcon={<ArrowCircleLeftOutlined />}
        onClick={prev ? () => onChange(id, prev.id) : undefined}>
        {prev ? formatLabel(prev.title, prev.id).slice(0, 20) : 'Prev'}
      </Button>
      <Button
        variant="outlined"
        type="button"
        component="a"
        color="primary"
        disabled={!next}
        endIcon={<ArrowCircleRightOutlined />}
        onClick={next ? () => onChange(id, next.id) : undefined}>
        {next ? formatLabel(next.title, next.id).slice(0, 20) : 'Next'}
      </Button>
    </Stack>
  );
};
