import axios from 'axios';

import config from '@/services/config';
import { AvailableNoteTemplateNames } from '@/types';

async function generateSOAPNotes({
  transcription,
  language,
  startTime,
  endTime,
  template,
}: {
  transcription: string;
  language: string;
  startTime: Date | null;
  endTime: Date | null;
  template: AvailableNoteTemplateNames;
}): Promise<string> {
  if (transcription === undefined || transcription === null || transcription === '') return '';

  try {
    const res = await axios.post(
      config.api.baseUrl + '/api/generate-doc',
      {
        transcription: transcription,
        language: language,
        template: template,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    startTime = startTime ? startTime : new Date();
    endTime = endTime ? endTime : new Date();

    const timestamp = `[Start Timestamp]: ${formatDate(startTime)}\n[End Timestamp]: ${formatDate(
      endTime,
    )}\n[Total Duration]: ${formatDuration(startTime, endTime)}`;
    return res.data.soap_note + '\n\n' + timestamp;
  } catch (err) {
    console.log(err);
    return '';
  }
}

async function generateHandout(soap_note: string, language: string): Promise<string> {
  if (soap_note === undefined || soap_note === null || soap_note === '') return '';

  try {
    const res = await axios.post(
      config.api.baseUrl + '/api/generate-handout',
      {
        soap_note: soap_note,
        language: language,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return res.data.handout;
  } catch (err) {
    console.log(err);
    return '';
  }
}

const formatDate = (date: Date | null, language = 'en-CA') => {
  if (!date) return '';
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };
  return new Intl.DateTimeFormat(language, options).format(date);
};

const formatDuration = (start: Date, end: Date) => {
  const duration = new Date(end.getTime() - start.getTime());
  const hours = String(duration.getUTCHours()).padStart(2, '0');
  const minutes = String(duration.getUTCMinutes()).padStart(2, '0');
  const seconds = String(duration.getUTCSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

export { generateSOAPNotes, formatDate, formatDuration, generateHandout };
