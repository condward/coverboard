import { PosTypes } from './generalTypes';

export enum LabelTypes {
  TITLE = 'title',
  SUBTITLE = 'subtitle',
}

export enum TextTypes {
  LINELABEL = 'linelabel',
}

export type SelectedText = {
  id: string;
  text: TextTypes | LabelTypes;
} | null;

export type SelectedElement = {
  id: string;
  open: boolean;
} | null;

interface CoverImageParamsText {
  search: string;
  text: string | null;
  dir: PosTypes;
}

interface CoverImageParamsTextSubtitle {
  search: string | null;
  text: string | null;
  dir: PosTypes;
}

interface GroupCoverParamsText {
  text: string | null;
  dir: PosTypes;
}

export interface CoverLabelValues {
  title: string;
  subtitle: string;
}

export interface CoverValues {
  title: string;
  subtitle: string;
  titleDir: PosTypes;
  subTitleDir: PosTypes;
}

export interface GroupCoverValues {
  title: string;
  subtitle: string;
  titleDir: PosTypes;
  subTitleDir: PosTypes;
}

export interface Covers {
  id: string;
  link: string;
  x: number;
  y: number;
  title: CoverImageParamsText;
  subtitle: CoverImageParamsTextSubtitle;
  star: {
    dir: PosTypes;
    count: number;
  };
}

export interface GroupCovers {
  id: string;
  x: number;
  y: number;
  title: GroupCoverParamsText;
  subtitle: GroupCoverParamsText;
  scaleX: number;
  scaleY: number;
}
