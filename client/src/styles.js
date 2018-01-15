const drawerWidth = 240;

export const styles = theme => ({
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    height: "100%",
    minHeight: "100vh",
    marginTop: 56,
    [theme.breakpoints.up("sm")]: {
      height: "calc(100% - 64px)",
      marginTop: 64
    }
  },
  flexGrow: {
    flex: "1 1 auto"
  }
});
