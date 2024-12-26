import { SyntheticEvent, useState } from 'react';

import { Description, Notes } from '@mui/icons-material';
import MicIcon from '@mui/icons-material/Mic';
import { TabContext } from '@mui/lab';
import { Tab, Tabs, useMediaQuery } from '@mui/material';
import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import ClinicalNoteControls from '@/components/control-panels/ClinicalNoteControls';
import PatientHandoutControls from '@/components/control-panels/PatientHandoutControls';
import TranscriptionControls from '@/components/control-panels/TranscriptionControls';
import ClinicalNote from '@/components/notes/ClinicalNote';
import PatientHandout from '@/components/notes/PatientHandout';
import Transcription from '@/components/notes/Transcription';
import { FlexBox } from '@/components/styled';
import SessionTabPanel from '@/components/tabs/SessionTabPanel';
import DictationContextProvider from '@/context/dictation-context/DictationContext';
import NoteContextProvider from '@/context/note-context/NoteContext';

function NewNote() {
  const showOnlyIcons = useMediaQuery('(max-width: 445px)');
  const [tabValue, setTabValue] = useState('0');

  const handleTabChangeEvent = (event: SyntheticEvent<Element, Event>, value: string) => {
    event.preventDefault();
    setTabValue(() => value);
  };

  return (
    <>
      <Meta title="New Note" />
      <FlexBox flexDirection="column" justifyContent="center" width="100%" height="fit-content">
        <Typography variant="h5" fontWeight="medium" marginBlock="1rem" textAlign={'center'}>
          AI Scribe Note
        </Typography>
        <FlexBox flexDirection="row" justifyContent="center" height="100%" width="100%">
          <FlexBox
            flexDirection="column"
            flexWrap="wrap"
            height="100%"
            width="100%"
            maxWidth="90rem"
          >
            <TabContext value={tabValue}>
              <FlexBox justifyContent="center" width="100%">
                <Tabs value={tabValue} onChange={handleTabChangeEvent}>
                  <Tab
                    value={'0'}
                    label={showOnlyIcons ? '' : 'Transcription'}
                    icon={<MicIcon />}
                    aria-label="Transcription tab"
                  />
                  <Tab
                    value={'1'}
                    label={showOnlyIcons ? '' : 'Clinical Note'}
                    icon={<Notes />}
                    aria-label="Clinical Note tab"
                  />
                  <Tab
                    value={'2'}
                    label={showOnlyIcons ? '' : 'Patient Handout'}
                    icon={<Description />}
                    aria-label="Patient Handout tab"
                  />
                </Tabs>
              </FlexBox>

              <NoteContextProvider defaultLanguage={navigator.language}>
                <DictationContextProvider>
                  <SessionTabPanel
                    tabValue={'0'}
                    controlPanel={<TranscriptionControls />}
                    note={<Transcription />}
                  />
                </DictationContextProvider>
                <SessionTabPanel
                  tabValue={'1'}
                  controlPanel={<ClinicalNoteControls />}
                  note={<ClinicalNote />}
                />
                <SessionTabPanel
                  tabValue={'2'}
                  controlPanel={<PatientHandoutControls />}
                  note={<PatientHandout />}
                />
              </NoteContextProvider>
            </TabContext>
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </>
  );
}

export default NewNote;
