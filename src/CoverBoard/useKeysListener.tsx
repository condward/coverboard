import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useStore } from 'zustand';

import {
  configAtom,
  editTitleAtom,
  editingTextAtom,
  hideToolbarAtom,
  pointsAtom,
  searchAtom,
  selectedAtom,
  shareAtom,
  useIsPopOpen,
  useMainStore,
} from 'store';

interface UseEventListener {
  createGroup: () => void;
  takeScreenshot: () => void;
}

export const useKeysListener = ({
  createGroup,
  takeScreenshot,
}: UseEventListener) => {
  const { undo: undoAction } = useStore(useMainStore.temporal);
  const covers = useMainStore((state) => state.covers);
  const groups = useMainStore((state) => state.groups);
  const arrows = useMainStore((state) => state.arrows);

  const isCover = useMainStore((state) => state.isCover);
  const isGroup = useMainStore((state) => state.isGroup);
  const isArrow = useMainStore((state) => state.isArrow);

  const fitToScreen = useMainStore((state) => state.configs.layout.fitToScreen);
  const updateConfigs = useMainStore((state) => state.updateConfigs);
  const removeCoverAndRelatedArrows = useMainStore(
    (state) => state.removeCoverAndRelatedArrows,
  );
  const removeGroupAndRelatedArrows = useMainStore(
    (state) => state.removeGroupAndRelatedArrows,
  );
  const removeArrow = useMainStore((state) => state.removeArrow);

  const openPopup = useIsPopOpen();

  const setOpenConfig = useSetAtom(configAtom);
  const setOpenSearch = useSetAtom(searchAtom);
  const setOpenShare = useSetAtom(shareAtom);
  const setHideToolBar = useSetAtom(hideToolbarAtom);

  const points = useAtomValue(pointsAtom);

  const [selected, setSelected] = useAtom(selectedAtom);
  const [editTitle, setEditTitle] = useAtom(editTitleAtom);

  const isContextModalOpen = !!selected?.open;
  const isTextSelected = !!useAtomValue(editingTextAtom);
  const hasMode = !!points || !!selected || editTitle || !!isTextSelected;
  const preventKeys = openPopup || isContextModalOpen || isTextSelected;

  useEffect(() => {
    const keyFn = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        undoAction();
        e.preventDefault();
      } else if (e.key === 'n' && !preventKeys && !hasMode) {
        if (covers.length > 0) {
          setSelected({
            id: covers[covers.length - 1].id,
            open: false,
          });
          e.preventDefault();
        } else if (groups.length > 0) {
          setSelected({
            id: groups[groups.length - 1].id,
            open: false,
          });
          e.preventDefault();
        }
      }

      if (!editTitle && !preventKeys) {
        if (e.key === 'a') {
          setOpenSearch(true);
          e.preventDefault();
        } else if (e.key === 'o') {
          setOpenConfig(true);
          e.preventDefault();
        } else if (e.key === 's') {
          setOpenShare(true);
          e.preventDefault();
        } else if (e.key === 'g') {
          createGroup();
          e.preventDefault();
        } else if (e.key === 'c') {
          takeScreenshot();
          e.preventDefault();
        } else if (e.key === 'u') {
          undoAction();
          e.preventDefault();
        } else if (e.key === 'e') {
          setEditTitle(true);
          e.preventDefault();
        } else if (e.key === 'h') {
          setHideToolBar((prev) => !prev);
          e.preventDefault();
        } else if (e.key === 'f') {
          updateConfigs({ layout: { fitToScreen: !fitToScreen } });
          e.preventDefault();
        }
      }

      if (!editTitle && !openPopup && !isContextModalOpen && selected) {
        if (e.key === 'Delete' || e.key === 'd') {
          if (isGroup(selected.id)) {
            removeGroupAndRelatedArrows(selected.id);
          } else if (isCover(selected.id)) {
            removeCoverAndRelatedArrows(selected.id);
          } else if (isArrow(selected.id)) {
            removeArrow(selected.id);
          }
          e.preventDefault();
        } else if (e.key === 'Escape') {
          setSelected(null);
          e.preventDefault();
        } else if (e.key === 'Enter') {
          setSelected({ id: selected.id, open: true });
          e.preventDefault();
        }
      }

      if (!editTitle && !preventKeys && selected) {
        if (e.key === 'n') {
          if (isCover(selected.id)) {
            const currentIndex = covers.findIndex(
              (cov) => cov.id === selected.id,
            );
            if (currentIndex > -1 && Boolean(covers[currentIndex - 1])) {
              setSelected({
                id: covers[currentIndex - 1].id,
                open: false,
              });
              e.preventDefault();
            } else if (groups.length > 0) {
              setSelected({
                id: groups[groups.length - 1].id,
                open: false,
              });
              e.preventDefault();
            } else {
              setSelected({
                id: covers[covers.length - 1].id,
                open: false,
              });
              e.preventDefault();
            }
          } else if (isGroup(selected.id)) {
            const currentIndex = groups.findIndex(
              (cov) => cov.id === selected.id,
            );
            if (currentIndex > -1 && Boolean(groups[currentIndex - 1])) {
              setSelected({
                id: groups[currentIndex - 1].id,
                open: false,
              });
              e.preventDefault();
            } else if (covers.length > 0) {
              setSelected({
                id: covers[covers.length - 1].id,
                open: false,
              });
              e.preventDefault();
            } else {
              setSelected({
                id: groups[groups.length - 1].id,
                open: false,
              });
              e.preventDefault();
            }
          }
        } else if (e.key === 'p') {
          if (isCover(selected.id)) {
            const currentIndex = covers.findIndex(
              (cov) => cov.id === selected.id,
            );
            if (currentIndex > -1 && Boolean(covers[currentIndex + 1])) {
              setSelected({
                id: covers[currentIndex + 1].id,
                open: false,
              });
              e.preventDefault();
            } else {
              setSelected({ id: covers[0].id, open: false });
              e.preventDefault();
            }
          } else if (isGroup(selected.id)) {
            const currentIndex = groups.findIndex(
              (cov) => cov.id === selected.id,
            );
            if (currentIndex > -1 && Boolean(groups[currentIndex + 1])) {
              setSelected({
                id: groups[currentIndex + 1].id,
                open: false,
              });
              e.preventDefault();
            } else {
              setSelected({ id: groups[0].id, open: false });
              e.preventDefault();
            }
          }
        }
      }
    };
    window.addEventListener('keydown', keyFn);

    return () => window.removeEventListener('keydown', keyFn);
  }, [
    covers,
    createGroup,
    editTitle,
    groups,
    hasMode,
    isContextModalOpen,
    isCover,
    isGroup,
    isArrow,
    isTextSelected,
    arrows,
    openPopup,
    points,
    preventKeys,
    removeCoverAndRelatedArrows,
    removeGroupAndRelatedArrows,
    removeArrow,
    selected,
    setEditTitle,
    setHideToolBar,
    setOpenConfig,
    setOpenSearch,
    setOpenShare,
    setSelected,
    takeScreenshot,
    undoAction,
    fitToScreen,
    updateConfigs,
  ]);
};
