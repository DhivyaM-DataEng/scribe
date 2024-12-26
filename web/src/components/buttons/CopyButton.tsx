import { useState } from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, Snackbar, Tooltip } from '@mui/material';

import { FlexBox } from '../styled';

interface CopyButtonProps {
  content: string;
  disabled?: boolean;
}

export default function CopyButton({ content, disabled }: CopyButtonProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(() => false), 2000); // Reset copy success after 2 seconds
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <>
      <FlexBox sx={{ alignItems: 'center', gap: 2 }}>
        <Tooltip title="Copy to clipboard" arrow>
          <span>
            <Button
              disabled={disabled}
              sx={{ alignSelf: 'center', marginLeft: 'auto' }}
              variant="contained"
              color="primary"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyToClipboard}
            >
              Copy
            </Button>
          </span>
        </Tooltip>
      </FlexBox>
      <Snackbar
        open={copySuccess}
        message="Text copied to clipboard"
        autoHideDuration={2000}
        onClose={() => setCopySuccess(() => false)}
      />
    </>
  );
}
