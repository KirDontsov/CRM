import { useCallback } from 'react';
import { useContextSelector } from 'use-context-selector';
import { Typography, Switch, FormControlLabel, Paper } from '@mui/material';
import { AppContext } from '@context';

import styles from './styles.module.scss';

export const Settings = () => {
  const toggleDarkMode = useContextSelector(AppContext, (ctx) => ctx.handlers.toggleDarkMode);
  const darkMode = useContextSelector(AppContext, (ctx) => ctx.state.darkMode);

  const handleDarkMode = useCallback(() => {
    toggleDarkMode();
  }, [toggleDarkMode]);

  return (
    <Paper elevation={2} className={styles.settingsContainer}>
      <Typography variant="h1">Settings</Typography>
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={handleDarkMode} inputProps={{ 'aria-label': 'controlled' }} />}
        label="Темная тема"
      />
    </Paper>
  );
};
