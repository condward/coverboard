import { PosTypes } from './generalTypes';

export enum Colors {
  YELLOW = 'yellow',
  RED = 'red',
  GREEN = 'green',
  PINK = 'pink',
  BLUE = 'blue',
  PURPLE = 'purple',
  ORANGE = 'orange',
}

export const colorMap = {
  [Colors.YELLOW]: 'yellow',
  [Colors.RED]: '#DC143C',
  [Colors.GREEN]: '#32CD32',
  [Colors.PINK]: '#FF69B4',
  [Colors.BLUE]: '#1E90FF',
  [Colors.PURPLE]: '#9370DB',
  [Colors.ORANGE]: '#FF6347',
};

export enum BackColors {
  DARKER = 'darker',
  DARK = 'dark',
  LIGHT = 'light',
  LIGHTER = 'lighter',
}

export const backColorMap = {
  [BackColors.DARKER]: '#1E2B38',
  [BackColors.DARK]: '#303952',
  [BackColors.LIGHT]: '#475B6B',
  [BackColors.LIGHTER]: '#5C6F7E',
};

export enum ToolbarConfigValues {
  MEDIA = 'media',
  TITLE = 'title',
  SIZE = 'size',
  COLOR = 'color',
  ARROW_COLOR = 'arrowColor',
  BACK_COLOR = 'backColor',
  COVER_COLOR = 'coverColor',
  GROUP_COLOR = 'groupColor',
  SHOW_MAIN_TITLE = 'showMainTitle',
  SHOW_TITLE = 'showTitle',
  SHOW_SUBTITLE = 'showSubtitle',
  SHOW_ARROW = 'showArrow',
  SHOW_STARS = 'showStars',
  LABEL_DIR = 'labelDir',
  GROUP_DIR = 'groupDir',
  STARS_DIR = 'starsDir',
}

export const ColorSettings = [
  {
    name: ToolbarConfigValues.COLOR,
    label: 'Main Color',
  },
  {
    name: ToolbarConfigValues.COVER_COLOR,
    label: 'Cover Color',
  },
  {
    name: ToolbarConfigValues.GROUP_COLOR,
    label: 'Group Color',
  },
  {
    name: ToolbarConfigValues.ARROW_COLOR,
    label: 'Arrow Color',
  },
];

export enum Media {
  MUSIC = 'music',
  MOVIE = 'movie',
  TVSHOW = 'tvshow',
  BOOK = 'book',
  GAME = 'game',
}

export enum MediaValues {
  ARTIST = 'artist',
  ALBUM = 'album',
  MOVIE = 'movie',
  TVSHOW = 'tvshow',
  YEAR = 'year',
  BOOK = 'book',
  AUTHOR = 'author',
  GAME = 'game',
}

export interface MediaDesc {
  label: MediaValues;
  required: boolean;
  hidden: boolean;
}

export const MediaMap = {
  [Media.MUSIC]: {
    emoji: '🎵',
    title: {
      label: MediaValues.ALBUM,
      required: true,
      hidden: false,
    },
    subtitle: {
      label: MediaValues.ARTIST,
      required: true,
      hidden: false,
    },
    heightRatio: 1,
  },
  [Media.MOVIE]: {
    emoji: '🎬',
    title: {
      label: MediaValues.MOVIE,
      required: true,
      hidden: false,
    },
    subtitle: {
      label: MediaValues.YEAR,
      required: false,
      hidden: false,
    },
    heightRatio: 1.5,
  },
  [Media.TVSHOW]: {
    emoji: '📺',
    title: {
      label: MediaValues.TVSHOW,
      required: true,
      hidden: false,
    },
    subtitle: {
      label: MediaValues.YEAR,
      required: false,
      hidden: false,
    },
    heightRatio: 1.5,
  },
  [Media.BOOK]: {
    emoji: '📚',
    title: {
      label: MediaValues.BOOK,
      required: true,
      hidden: false,
    },
    subtitle: {
      label: MediaValues.AUTHOR,
      required: false,
      hidden: false,
    },
    heightRatio: 1.5,
  },
  [Media.GAME]: {
    emoji: '🎮',
    title: {
      label: MediaValues.GAME,
      required: true,
      hidden: false,
    },
    subtitle: {
      label: MediaValues.YEAR,
      required: false,
      hidden: false,
    },
    heightRatio: 0.7,
  },
};

export interface SearchResults {
  link: string;
  title: string;
  subtitle: string;
}

export interface ToolbarConfigParams {
  [ToolbarConfigValues.MEDIA]: Media;
  [ToolbarConfigValues.TITLE]: string;
  [ToolbarConfigValues.SIZE]: number;
  [ToolbarConfigValues.COLOR]: Colors;
  [ToolbarConfigValues.ARROW_COLOR]: Colors;
  [ToolbarConfigValues.GROUP_COLOR]: Colors;
  [ToolbarConfigValues.COVER_COLOR]: Colors;
  [ToolbarConfigValues.BACK_COLOR]: BackColors;
  [ToolbarConfigValues.SHOW_MAIN_TITLE]: boolean;
  [ToolbarConfigValues.SHOW_TITLE]: boolean;
  [ToolbarConfigValues.SHOW_SUBTITLE]: boolean;
  [ToolbarConfigValues.SHOW_STARS]: boolean;
  [ToolbarConfigValues.SHOW_ARROW]: boolean;
  [ToolbarConfigValues.LABEL_DIR]: PosTypes;
  [ToolbarConfigValues.STARS_DIR]: PosTypes;
  [ToolbarConfigValues.GROUP_DIR]: PosTypes;
}
