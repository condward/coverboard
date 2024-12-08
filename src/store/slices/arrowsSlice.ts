import { StateCreator } from 'zustand';
import type { DeepPartial } from 'react-hook-form';

import { ArrowSchema, ArrowsSchema, ArrowSchemas } from 'types';

export interface UseArrowsParams {
  arrows: ArrowsSchema;
  isArrow: (ArrowId: ArrowSchema['id']) => boolean;
  updateArrow: (
    ArrowdId: ArrowSchema['id'],
    value: DeepPartial<ArrowSchema>,
  ) => void;
  removeArrow: (ArrowdId: ArrowSchema['id']) => void;
  addArrow: (arrow: ArrowSchema) => void;
  removeConnectedArrow: (id1: string, id2: string) => void;
  checkIfArrowAlreadyExists: (id1: string, id2: string) => boolean;
  getOriginRelatedArrows: (id: string) => Array<ArrowSchema>;
  getTargetRelatedArrows: (id: string) => Array<ArrowSchema>;
  updateAllArrows: (arrow: DeepPartial<ArrowSchema>) => void;
}

export const createArrowsSlice: StateCreator<
  UseArrowsParams,
  [],
  [],
  UseArrowsParams
> = (set, get) => ({
  arrows: [],
  isArrow: (id) => get().arrows.some((arrow) => arrow.id === id),
  addArrow(arrow) {
    if (get().checkIfArrowAlreadyExists(arrow.origin.id, arrow.target.id))
      return;

    set(({ arrows }) => ({
      arrows: ArrowSchemas.parse([...arrows, arrow]),
    }));
  },
  updateArrow(ArrowId, partialArrow) {
    set(({ arrows }) => {
      const arrow = arrows.find((arrow) => arrow.id === ArrowId);

      if (!arrow) return { arrows };

      const ArrowCopy = arrows.filter((arrow) => arrow.id !== ArrowId);
      ArrowCopy.push({
        id: partialArrow.id ?? arrow.id,
        title: {
          text: partialArrow.title?.text ?? arrow.title.text,
          dir: partialArrow.title?.dir ?? arrow.title.dir,
        },
        origin: {
          dir: partialArrow.origin?.dir ?? arrow.origin.dir,
          id: partialArrow.origin?.id ?? arrow.origin.id,
        },
        target: {
          dir: partialArrow.target?.dir ?? arrow.target.dir,
          id: partialArrow.target?.id ?? arrow.target.id,
        },
      });

      return { arrows: ArrowCopy };
    });
  },
  removeArrow(ArrowdId) {
    set(({ arrows }) => ({
      arrows: arrows.filter((currentArrow) => !(currentArrow.id === ArrowdId)),
    }));
  },

  removeConnectedArrow(id1, id2) {
    set(({ arrows }) => ({
      arrows: arrows.filter(
        (l) =>
          !(
            (l.origin.id === id1 && l.target.id === id2) ||
            (l.origin.id === id2 && l.target.id === id1)
          ),
      ),
    }));
  },
  updateAllArrows(newArrow) {
    get().arrows.forEach((arrow) => get().updateArrow(arrow.id, newArrow));
  },
  getOriginRelatedArrows(elementId) {
    return get().arrows.filter((arrow) => arrow.origin.id === elementId);
  },
  getTargetRelatedArrows(elementId) {
    return get().arrows.filter((arrow) => arrow.target.id === elementId);
  },
  checkIfArrowAlreadyExists(id1, id2) {
    return get().arrows.some(
      (l) =>
        (l.origin.id === id1 && l.target.id === id2) ||
        (l.origin.id === id2 && l.target.id === id1),
    );
  },
});
