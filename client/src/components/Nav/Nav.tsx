import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import styles from './styles.module.scss';

export const Nav = () => {
  return (
    <Box sx={{ flexGrow: 1 }} className={styles.nav}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Link to="/" className={styles.link}>
            <Typography variant="h5" component="div">
              CRM
            </Typography>
          </Link>

          <Box alignItems="right" sx={{ flexGrow: 1, textAlign: 'right' }}>
            <Link to="/login" className={`${styles.loginLink} ${styles.link}`}>
              <Typography component="span">Login</Typography>
            </Link>
            <Link to="/register" className={styles.link}>
              <Typography component="span">Register</Typography>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
