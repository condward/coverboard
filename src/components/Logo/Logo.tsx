import { FC } from 'react';
import { Stack, Link } from '@mui/material';

import { useMainStore } from 'store';
import { mediaMap } from 'types';
import { useGetSizesContext } from 'providers';

export const Logo: FC = () => {
  const media = useMainStore((state) => state.configs.media);
  const { toolbarIconSize } = useGetSizesContext();

  return (
    <Stack>
      <Link
        href={mediaMap[media].siteUrl}
        target="_blank"
        title={mediaMap[media].siteUrl}>
        <img
          src={mediaMap[media].logoUrl}
          alt="RAWG"
          style={{
            width: toolbarIconSize * 1.5,
            height: 'auto',
            borderRadius: 8,
          }}
        />
      </Link>
    </Stack>
  );
};
