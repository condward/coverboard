import { FC } from 'react';
import { useAtom } from 'jotai';
import { SearchOutlined } from '@mui/icons-material';

import { colorMap, Colors, KeyboardShortcuts, ToolConfigIDs } from 'types';

import { useShallowMainStore, searchAtom } from 'store';

import { CommonButton } from './CommonButton';

export const SearchButton: FC = () => {
  const { coversLength } = useShallowMainStore((state) => ({
    coversLength: state.covers.length,
  }));
  const [openSearch, setOpenSearch] = useAtom(searchAtom);

  return (
    <CommonButton
      config={{
        id: ToolConfigIDs.SEARCH,
        tooltip: `Search and add (covers: ${coversLength})`,
        color: colorMap[Colors.GREEN],
        icon: <SearchOutlined />,
        value: openSearch,
        valueModifier: setOpenSearch,
        badge: coversLength > 0 ? coversLength : null,
        enabled: true,
        shortcut: KeyboardShortcuts.SEARCH,
      }}
    />
  );
};
