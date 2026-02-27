"use client";
import { useRowLabel } from '@payloadcms/ui';
import { Box } from '@mui/material';

const PlayerRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ name?: string, number?: string }>();
  const customLabel = `${data.name || 'Player'} -  #${data.number || String(rowNumber).padStart(2, '0')}`;
  return (
    <Box
      sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}
      data-player-row-index={rowNumber - 1}
    >
      {customLabel}
    </Box>
  );
};

export default PlayerRowLabel;
