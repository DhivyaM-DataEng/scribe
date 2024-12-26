import { useContext } from 'react';

import { Card, CardActions, CardContent, TextField, Typography } from '@mui/material';

import { NoteContext } from '@/context/note-context/NoteContext';
import { formatDate } from '@/utils/prompt';

import CopyButton from '../buttons/CopyButton';
import PrintButton from '../buttons/PrintButton';
import { FlexBox } from '../styled';

export default function SOAPNotes() {
  const { soapText, startTime, endTime, isGeneratingClinicalNote, updateSoapText } =
    useContext(NoteContext);

  return (
    <FlexBox flexGrow={1} minWidth="fit-content">
      <Card sx={{ paddingBottom: '1rem', width: '100%', minHeight: 'fit-content', height: '100%' }}>
        <CardContent>
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            Clinical Note
          </Typography>
          <TextField
            id="soap-notes"
            name="soap-notes"
            multiline
            rows={20}
            variant="outlined"
            fullWidth
            value={soapText}
            onChange={(e) => updateSoapText(e.target.value)}
            sx={{ height: '100%', overflow: 'auto' }}
          />
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between', gap: '1rem', marginInline: '1rem' }}>
          <PrintButton
            title="Clinical Note"
            subtitle={`Regarding: Clinical encounter dated ${formatDate(startTime)} -  ${formatDate(
              endTime,
            )} `}
            content={soapText}
            disabled={isGeneratingClinicalNote || !soapText}
          />
          <CopyButton content={soapText} disabled={isGeneratingClinicalNote || !soapText} />
        </CardActions>
      </Card>
    </FlexBox>
  );
}
