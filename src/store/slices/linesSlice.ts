import { v4 as uuidv4 } from 'uuid';
import { StateCreator } from 'zustand';
import { DeepPartial } from 'react-hook-form';

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
  updateLine: (
    linedId: LineSchema['id'],
    value: DeepPartial<LineSchema>,
  ) => void;
  removeLine: (linedId: LineSchema['id']) => void;
  createLine: (
    id: LineSchema['id'],
    points: LinePointSchema,
    pos: PosTypes,
  ) => void;
  removeConnectedLine: (id1: string, id2: string) => void;
  getOriginRelatedLines: (id: string) => Array<LineSchema>;
  getTargetRelatedLines: (id: string) => Array<LineSchema>;
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
  updateLine(lineId, partialLine) {
    set(({ lines }) => {
      const lineIdx = lines.findIndex((line) => line.id === lineId);

      if (lineIdx > -1) {
        const lineCopy = [...lines];
        const line = lineCopy[lineIdx];

        lineCopy[lineIdx] = {
          ...line,
          ...partialLine,
          origin: { ...line.origin, ...partialLine.origin },
          target: { ...line.target, ...partialLine.target },
        };

        return { lines: lineCopy };
      }
      return { lines };
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
  removeLine(linedId) {
    set(({ lines }) => ({
      lines: lines.filter((currentLine) => !(currentLine.id === linedId)),
    }));
  },

  removeConnectedLine(id1, id2) {
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
  getOriginRelatedLines(elementId) {
    return get().lines.filter((line) => line.origin.id === elementId);
  },
  getTargetRelatedLines(elementId) {
    return get().lines.filter((line) => line.target.id === elementId);
  },
});
