import { KonvaEventObject } from 'konva/lib/Node';
import { Group, Image, Text } from 'react-konva';
import { FC, memo } from 'react';
import useImage from 'use-image';

import { useMainStore } from 'store';
import { Media } from 'types';
import { useGetSizesContext } from 'providers';
import { useIsLandscape } from 'utils';

const getURL = (media: Media) => {
  if (media === Media.MUSIC) {
    return 'https://www.last.fm/static/images/footer_logo@2x.49ca51948b0a.png';
  } else if (media === Media.MOVIE || media === Media.TVSHOW) {
    return 'https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg';
  } else if (media === Media.BOOK) {
    return 'https://blog.openlibrary.org/files/2016/02/Open-Library-Logo-1.jpg';
  } else {
    return 'https://rapidapi-prod-apis.s3.amazonaws.com/aa/5f399a9426449aac6954ffc8c0b481/ce9eeca1905fdb11890f3afc10724191.png';
  }
};

const LogoWithoutMemo: FC = () => {
  const media = useMainStore((state) => state.configs.media);
  const { dragLimits, toolbarIconSize, fontSize } = useGetSizesContext();
  const [image] = useImage(getURL(media));
  const isLandscape = useIsLandscape();

  if (media === Media.MUSIC) {
    return (
      <Group
        x={isLandscape ? 0 : dragLimits.width - 2.1 * toolbarIconSize}
        y={isLandscape ? dragLimits.height - toolbarIconSize : 24}
        onClick={() => window.open('https://www.last.fm')}
        onTap={() => window.open('https://www.last.fm')}
        onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
          const container = evt.target.getStage()?.container();

          if (container) {
            container.style.cursor = 'pointer';
          }
        }}
        onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
          const container = evt.target.getStage()?.container();

          if (container) {
            container.style.cursor = 'default';
          }
        }}>
        <Image
          image={image}
          scaleX={0.01 * toolbarIconSize}
          scaleY={0.01 * toolbarIconSize}
          x={toolbarIconSize * 0.65}
          y={-toolbarIconSize / 2}
        />
        <Text
          y={0}
          fontSize={fontSize * 0.8}
          width={toolbarIconSize * 2}
          fill="white"
          align="center"
          text="powered"
          textDecoration="underline"
        />
        <Text
          y={fontSize}
          fontSize={fontSize * 0.8}
          width={toolbarIconSize * 2}
          fill="white"
          align="center"
          text="by"
          textDecoration="underline"
        />
        <Text
          y={fontSize * 2}
          fontSize={fontSize * 0.8}
          width={toolbarIconSize * 2}
          fill="white"
          align="center"
          text="AudioScrobbler"
          textDecoration="underline"
        />
      </Group>
    );
  } else if (media === Media.MOVIE || media === Media.TVSHOW) {
    return (
      <Image
        onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
          const container = evt.target.getStage()?.container();

          if (container) {
            container.style.cursor = 'pointer';
          }
        }}
        onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
          const container = evt.target.getStage()?.container();

          if (container) {
            container.style.cursor = 'default';
          }
        }}
        onClick={() => window.open('https://www.themoviedb.org/')}
        image={image}
        scaleX={0.01 * toolbarIconSize}
        scaleY={0.01 * toolbarIconSize}
        x={isLandscape ? 0 : dragLimits.width - 2.2 * toolbarIconSize}
        y={isLandscape ? dragLimits.height - 1.6 * toolbarIconSize : 8}
      />
    );
  } else if (media === Media.BOOK) {
    return (
      <Image
        onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
          const container = evt.target.getStage()?.container();

          if (container) {
            container.style.cursor = 'pointer';
          }
        }}
        onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
          const container = evt.target.getStage()?.container();

          if (container) {
            container.style.cursor = 'default';
          }
        }}
        onClick={() => window.open('https://openlibrary.org/')}
        image={image}
        scaleX={0.008 * toolbarIconSize}
        scaleY={0.008 * toolbarIconSize}
        x={
          isLandscape
            ? toolbarIconSize / 8
            : dragLimits.width - 1.9 * toolbarIconSize
        }
        y={
          isLandscape
            ? dragLimits.height - 1.2 * toolbarIconSize
            : toolbarIconSize / 2
        }
      />
    );
  }
  return (
    <Image
      onMouseMove={(evt: KonvaEventObject<MouseEvent>) => {
        const container = evt.target.getStage()?.container();

        if (container) {
          container.style.cursor = 'pointer';
        }
      }}
      onMouseLeave={(evt: KonvaEventObject<MouseEvent>) => {
        const container = evt.target.getStage()?.container();

        if (container) {
          container.style.cursor = 'default';
        }
      }}
      onClick={() => window.open('https://rawg.io/')}
      image={image}
      scaleX={0.008 * toolbarIconSize}
      scaleY={0.008 * toolbarIconSize}
      x={
        isLandscape
          ? toolbarIconSize / 2
          : dragLimits.width - 1.2 * toolbarIconSize
      }
      y={
        isLandscape
          ? dragLimits.height - 1.2 * toolbarIconSize
          : toolbarIconSize / 2
      }
    />
  );
};

export const Logo = memo(LogoWithoutMemo);
