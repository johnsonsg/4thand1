'use client';

import * as React from 'react';
import { useField } from '@payloadcms/ui';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs from 'dayjs';

const adminTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2a3342',
    },
    background: {
      default: '#0b0f1a',
      paper: '#0b0f1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#9aa4b2',
    },
    divider: '#2a3342',
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: 'var(--theme-text, #ffffff)',
          padding: '8px 12px',
          fontSize: '0.875rem',
          lineHeight: 1.25,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--theme-input-bg)',
          color: 'var(--theme-text, #ffffff)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--theme-elevation-150)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: '1px solid var(--theme-elevation-150)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--theme-elevation-400)',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'var(--theme-text-light, #9aa4b2)',
          '&.Mui-focused': {
            color: 'var(--theme-brand, #d4a017)',
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: 'var(--theme-text-light, #9aa4b2)',
        },
      },
    },
  },
});

export default function DateTimePickerField(props: { path: string; label?: string; required?: boolean }) {
  const { path, label, required } = props;
  const { value, setValue } = useField<string>({ path });

  const parsedValue = value ? dayjs(value) : null;

  return (
    <div className="field-type text">
     Date &amp; Time {required && <span className="field-type__required-indicator">*</span>}
      <div className="field-type__wrap">
        <ThemeProvider theme={adminTheme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDateTimePicker
              value={parsedValue}
              onChange={(next) => {
                if (!next || !next.isValid()) {
                  setValue('');
                  return;
                }
                setValue(next.toISOString());
              }}
              slotProps={{
                textField: {
                  // size: 'small',
                  // fullWidth: true,
                  variant: 'outlined',
                  className: 'field-type__input',
                },
              }}
              sx={{mt:'0.5rem'}}
            />
          </LocalizationProvider>
        </ThemeProvider>
      </div>
    </div>
  );
}
