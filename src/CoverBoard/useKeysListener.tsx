import { useEffect } from 'react';
import { useMainStore, useToolbarStore, useUtilsStore } from 'store';

interface UseEventListener {
  createGroup: () => void;
  takeScreenshot: () => void;
}

export const useKeysListener = ({
  createGroup,
  takeScreenshot,
}: UseEventListener) => {
  const undoAction = useMainStore((state) => state.undoAction);

  const openPopup = useToolbarStore((state) => state.isPopupOpen());

  const setOpenConfig = useToolbarStore((state) => state.setOpenConfig);
  const setOpenSearch = useToolbarStore((state) => state.setOpenSearch);
  const setOpenShare = useToolbarStore((state) => state.setOpenShare);

  const points = useUtilsStore((state) => state.points);
  const selected = useUtilsStore((state) => state.selected);
  const isContextModalOpen = useUtilsStore((state) =>
    state.isContextModalOpen(),
  );
  const isTextSelected = useUtilsStore((state) => state.isTextSelected());

  const setSelected = useUtilsStore((state) => state.setSelected);
  const hasMode = useUtilsStore((state) => state.hasMode());
  const editTitle = useUtilsStore((state) => state.editTitle);
  const setEditTitle = useUtilsStore((state) => state.setEditTitle);

  const covers = useMainStore((state) => state.covers);
  const groups = useMainStore((state) => state.groups);
  const lines = useMainStore((state) => state.lines);

  const isCover = useMainStore((state) => state.isCover);
  const isGroup = useMainStore((state) => state.isGroup);
  const isLine = useMainStore((state) => state.isLine);

  const removeCoverAndRelatedLines = useMainStore(
    (state) => state.removeCoverAndRelatedLines,
  );
  const removeGroupAndRelatedLines = useMainStore(
    (state) => state.removeGroupAndRelatedLines,
  );
  const removeLine = useMainStore((state) => state.removeLine);

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
        }
      }

      if (!editTitle && !openPopup && !isContextModalOpen && selected) {
        if (e.key === 'Delete' || e.key === 'd') {
          if (isGroup(selected.id)) {
            removeGroupAndRelatedLines(selected.id);
          } else if (isCover(selected.id)) {
            removeCoverAndRelatedLines(selected.id);
          } else if (isLine(selected.id)) {
            removeLine(selected.id);
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
            if (currentIndex > -1 && covers[currentIndex - 1]) {
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
            if (currentIndex > -1 && groups[currentIndex - 1]) {
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
            if (currentIndex > -1 && covers[currentIndex + 1]) {
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
            if (currentIndex > -1 && groups[currentIndex + 1]) {
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
    isLine,
    isTextSelected,
    lines,
    openPopup,
    points,
    preventKeys,
    removeCoverAndRelatedLines,
    removeGroupAndRelatedLines,
    removeLine,
    selected,
    setEditTitle,
    setOpenConfig,
    setOpenSearch,
    setOpenShare,
    setSelected,
    takeScreenshot,
    undoAction,
  ]);
};
