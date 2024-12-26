import PrintIcon from '@mui/icons-material/Print';
import { Button, Tooltip } from '@mui/material';

interface PrintButtonProps {
  title: string;
  subtitle: string;
  content: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function PrintButton({
  title,
  subtitle,
  content,
  disabled = false,
  fullWidth = false,
}: PrintButtonProps) {
  const handlePrint = () => {
    if (content) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${title}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
              </style>
            </head>
            <body>
              <h1>${title}</h1>
              <p>${subtitle} </p>
              ${content}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <Tooltip title="Print" arrow>
      <span style={{ minWidth: 'fit-content' }}>
        <Button
          variant="contained"
          sx={{ alignSelf: 'center', marginLeft: 'auto' }}
          disabled={disabled}
          color="primary"
          onClick={handlePrint}
          startIcon={<PrintIcon />}
          fullWidth={fullWidth}
        >
          Print
        </Button>
      </span>
    </Tooltip>
  );
}
