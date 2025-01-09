import { Tabs, Tab, Box, Stack } from '@mui/material';
import { ReactNode, FC, useState } from 'react';

import { SPACING_GAP } from 'types';

interface CommonTabsProps {
  tabs: Array<{
    label: string;
    value: string;
    component?: ReactNode | ReactNode[];
  }>;
}

export const CommonTabs: FC<CommonTabsProps> = ({ tabs }) => {
  const [tabState, setTabsState] = useState(tabs[0].value);

  const componentList = tabs.filter((tab) => Boolean(tab.component));

  if (componentList.length === 1) {
    return (
      <Stack direction="column" gap={SPACING_GAP}>
        {componentList[0].component}
      </Stack>
    );
  }

  return (
    <Stack gap={SPACING_GAP}>
      <Tabs
        onChange={(_, val: string) => setTabsState(val)}
        value={tabState}
        scrollButtons="auto"
        allowScrollButtonsMobile
        variant="scrollable"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
        }}>
        {tabs.map((tab) => (
          <Tab label={tab.label} value={tab.value} key={tab.value} />
        ))}
      </Tabs>
      <Stack direction="column" gap={SPACING_GAP} mt={1}>
        {tabs.map((tab) => (
          <Box
            key={tab.value}
            hidden={tab.value !== tabState}
            sx={{ display: tab.value !== tabState ? 'none' : undefined }}>
            {tab.component}
          </Box>
        ))}
      </Stack>
    </Stack>
  );
};
