import { TabPanel } from '@mui/lab';
import { useMediaQuery } from '@mui/material';

import { FlexBox } from '../styled';

interface SessionTabPanelProps {
  tabValue: string;
  controlPanel: JSX.Element;
  note: JSX.Element;
}

export default function SessionTabPanel({ tabValue, controlPanel, note }: SessionTabPanelProps) {
  const column = useMediaQuery('(max-width: 700px)');

  return (
    <TabPanel value={tabValue}>
      <FlexBox flexDirection={column ? 'column' : 'row'} gap="1rem" width="100%" height="100%">
        {controlPanel}
        {note}
      </FlexBox>
    </TabPanel>
  );
}
