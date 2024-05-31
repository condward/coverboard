import { v4 as uuidv4 } from 'uuid';
import { StateCreator } from 'zustand';

import {
  LineSchema,
  LinePointSchema,
  PosTypes,
  LinesSchema,
  lineSchemas,
} from 'types';

export interface UseLinesParams {
  lines: LinesSchema;
  isLine: (lineId: LineSchema['id']) => boolean;
  resetLine: (linedId: LineSchema['id']) => void;
  updateLineDir: (linedId: LineSchema['id'], dir: PosTypes) => void;
  updateLineText: (linedId: LineSchema['id'], text: string) => void;
  removeLine: (linedId: LineSchema['id']) => void;
  createLine: (
    id: LineSchema['id'],
    points: LinePointSchema,
    pos: PosTypes,
  ) => void;
  removeConnectedLine: (id1: string, id2: string) => void;
}

export const createLinesSlice: StateCreator<
  UseLinesParams,
  [],
  [],
  UseLinesParams
> = (set, get) => ({
  lines: [],
  isLine: (id) => get().lines.some((line) => line.id === id),
  createLine(id, points, dir) {
    set(({ lines }) => {
      const lineCopy = [...lines];

      if (
        lineCopy.some(
          (currentLine) => currentLine.target.id === id && points.id === id,
        )
      ) {
        return { lines: lineCopy };
      }

      const foundLine = lineCopy.find(
        (currentLine) =>
          currentLine.target.id === id && points.id === currentLine.origin.id,
      );
      if (foundLine) {
        foundLine.origin = points;
        foundLine.target = { id, dir };
        return { lines: lineCopy };
      }

      const foundLineReverse = lineCopy.find(
        (currentLine) =>
          currentLine.origin.id === id && points.id === currentLine.target.id,
      );
      if (foundLineReverse) {
        foundLineReverse.origin = points;
        foundLineReverse.target = { id, dir };
        return { lines: lineCopy };
      }

      return {
        lines: lineSchemas.parse([
          ...lineCopy,
          {
            text: '',
            dir: PosTypes.BOTTOM,

            origin: { ...points },
            target: { id, dir },
            id: uuidv4(),
          },
        ]),
      };
    });
  },
  resetLine(linedId) {
    set(({ lines }) => ({
      lines: lines.map((currentLine) => {
        if (currentLine.id === linedId) {
          return {
            ...currentLine,
            dir: PosTypes.BOTTOM,
          };
        }
        return currentLine;
      }),
    }));
  },
  updateLineDir(linedId, dir) {
    set(({ lines }) => ({
      lines: lines.map((currentLine) => {
        if (currentLine.id === linedId) {
          return {
            ...currentLine,
            dir,
          };
        }
        return currentLine;
      }),
    }));
  },
  updateLineText(linedId, text) {
    set(({ lines }) => ({
      lines: lines.map((currentLine) => {
        if (currentLine.id === linedId) {
          return {
            ...currentLine,
            text,
          };
        }
        return currentLine;
      }),
    }));
  },
  removeLine(linedId) {
    set(({ lines }) => ({
      lines: lines.filter((currentLine) => !(currentLine.id === linedId)),
    }));
  },

  removeConnectedLine(id1: string, id2: string) {
    set(({ lines }) => ({
      lines: lines.filter(
        (l) =>
          !(
            (l.origin.id === id1 && l.target.id === id2) ||
            (l.origin.id === id2 && l.target.id === id1)
          ),
      ),
    }));
  },
});
