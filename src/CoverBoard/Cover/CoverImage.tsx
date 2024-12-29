import { FC } from 'react';
import { Image, Text } from 'react-konva';
import { useImage } from 'react-konva-utils';
import { KonvaEventObject } from 'konva/lib/Node';

import { CoverSchema } from 'types';
import { useMainStore } from 'store';
import { useGetSizesContext } from 'providers';

interface CoverImageProps {
  link: CoverSchema['link'];
  onRetry: (evt: KonvaEventObject<MouseEvent>) => void;
}

export const CoverImage: FC<CoverImageProps> = ({ link, onRetry }) => {
  const { fontSize, coverSizeWidth, coverSizeHeight } = useGetSizesContext();

  const color = useMainStore((state) => state.getColor());

  if (link === '') {
    return (
      <Text
        fontSize={fontSize * 1.2}
        x={0}
        y={coverSizeHeight / 2 - (fontSize * 1.2) / 2}
        width={coverSizeWidth}
        align="center"
        fill={color}
        text=""
      />
    );
  }

  return <CoverImageChild link={link} onRetry={onRetry} />;
};

const CoverImageChild: FC<CoverImageProps> = ({ link, onRetry }) => {
  const { fontSize, coverSizeWidth, coverSizeHeight } = useGetSizesContext();

  const color = useMainStore((state) => state.getColor());

  const [image, status] = useImage(link, 'anonymous');

  return (
    <>
      {status === 'loaded' && image && (
        <Image image={image} width={coverSizeWidth} height={coverSizeHeight} />
      )}
      {status === 'loading' && (
        <Text
          fontSize={fontSize * 1.2}
          x={0}
          y={coverSizeHeight / 2 - (fontSize * 1.2) / 2}
          width={coverSizeWidth}
          align="center"
          fill={color}
          text="Loading..."
        />
      )}
      {status === 'failed' && (
        <Text
          fontSize={fontSize * 1.2}
          x={coverSizeWidth / 4.3}
          y={coverSizeHeight / 2.5 - (fontSize * 1.2) / 2}
          width={coverSizeWidth / 1.8}
          align="center"
          fill={color}
          text="Error (Retry)"
          onClick={onRetry}
        />
      )}
    </>
  );
};
