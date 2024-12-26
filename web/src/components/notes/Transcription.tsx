import { useContext } from 'react';

import { Card, CardActions, CardContent, TextField, Typography } from '@mui/material';

import { DictationContext } from '@/context/dictation-context/DictationContext';
import { NoteContext } from '@/context/note-context/NoteContext';
import { formatDate } from '@/utils/prompt';

import CopyButton from '../buttons/CopyButton';
import PrintButton from '../buttons/PrintButton';
import { FlexBox } from '../styled';

export default function DictatedNotes() {
  const { noteText, startTime, endTime, updateNoteText } = useContext(NoteContext);

  const { currentText, isTranscribing } = useContext(DictationContext);

  return (
    <>
      <FlexBox flexGrow={1} minWidth="fit-content">
        <Card
          sx={{ paddingBottom: '1rem', width: '100%', minHeight: 'fit-content', height: '100%' }}
        >
          <CardContent>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
              Transcription
            </Typography>
            <TextField
              id="dictated-notes"
              name="dictated-notes"
              multiline
              rows={20}
              variant="outlined"
              fullWidth
              value={noteText + currentText}
              onChange={(e) => updateNoteText(e.target.value)}
              sx={{ height: '100%', overflow: 'auto' }}
            />
          </CardContent>
          <CardActions sx={{ justifyContent: 'space-between', gap: '1rem', marginInline: '1rem' }}>
            <PrintButton
              title="Transcript"
              subtitle={`Transcript from encounter dated ${formatDate(startTime)} -  ${formatDate(
                endTime,
              )} `}
              content={noteText}
              disabled={isTranscribing || !noteText}
            />
            <CopyButton content={noteText} disabled={isTranscribing || !noteText} />
          </CardActions>
        </Card>
      </FlexBox>
    </>
  );
}
