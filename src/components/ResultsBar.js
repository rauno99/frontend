import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    position: "relative",
    left: 0,
    right: 0
  },
  margin: {
    margin: theme.spacing(1)
  },
  progressLabel: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1,
    maxHeight: "40px", // borderlinearprogress root.height
    textAlign: "left",
    paddingLeft: "10px",
    display: "flex",
    alignItems: "center",
    "& span": {
      width: "100%"
    }
  },

  progressVotes: {
    position: "absolute",
    width: "100%",
    height: "100%",
    right: 0,
    zIndex: 1,
    maxHeight: "40px", // borderlinearprogress root.height
    textAlign: "right",
    paddingRight: "10px",
    display: "flex",
    alignItems: "center",
    "& span": {
      width: "100%"
    }
  }
}));

export default function ResultsBar(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <div className={classes.progressLabel}>
            <span>{props.title}</span>
          </div>
          <div className={classes.progressVotes}>
            <span>{props.votes} votes</span>
          </div>
          <LinearProgress variant="determinate" value={props.value} style={{ height: "40px", borderRadius: 9 }} />
        </Grid>
      </Grid>
    </div>
  );
}
