import { FC } from 'react';
import { Stack, Link } from '@mui/material';

import { useMainStore } from 'store';
import { mediaMap } from 'types';
import { useGetSizesContext } from 'providers';
import { useIsLandscape } from 'utils';

export const Logo: FC = () => {
  const media = useMainStore((state) => state.configs.media);
  const { coverSizeWidth, canvasLimits } = useGetSizesContext();
  const isLandscape = useIsLandscape();

  if (isLandscape && canvasLimits.height < 520) return null;
  if (!isLandscape && canvasLimits.width < 520) return null;

  return (
    <Stack>
      <Link
        href={mediaMap[media].siteUrl}
        target="_blank"
        title={mediaMap[media].siteUrl}>
        <img
          src={mediaMap[media].logoUrl}
          alt={mediaMap[media].apiName ?? 'Open Library'}
          style={{
            width: coverSizeWidth * 0.6,
            height: 'auto',
            borderRadius: 8,
          }}
        />
      </Link>
    </Stack>
  );
};
