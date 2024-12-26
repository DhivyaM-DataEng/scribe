import { Card, Typography, useMediaQuery } from '@mui/material';
import { grey } from '@mui/material/colors';

import { FlexBox } from '../styled';

interface ControlCardProps {
  title: string;
  actionButton: JSX.Element;
  children: JSX.Element;
}

export default function ControlCard({ title, actionButton, children }: ControlCardProps) {
  const fullWidth = useMediaQuery('(max-width: 700px)');

  return (
    <Card
      sx={{
        minWidth: '15rem',
        maxWidth: fullWidth ? '100%' : '20rem',
        width: '100%',
        height: 'fit-content',
        maxHeight: '100%',
      }}
    >
      <FlexBox padding="1rem" borderBottom="2px" borderColor={grey[200]}>
        <Typography variant="body1" fontWeight="500">
          {title}
        </Typography>
      </FlexBox>

      <FlexBox
        width="100%"
        height="100%"
        minHeight="100%"
        flexDirection="column"
        justifyContent="flex-start"
        paddingInline="1rem"
        paddingBottom="1rem"
        gap="1rem"
      >
        <FlexBox
          width="100%"
          height="100%"
          flexDirection={'column'}
          justifyContent="space-between"
          gap="2rem"
        >
          <FlexBox width="100%" height="fit-content" flexDirection="column" gap="1rem">
            {children}
          </FlexBox>
          <FlexBox width="100%" height="fit-content">
            {actionButton}
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </Card>
  );
}
