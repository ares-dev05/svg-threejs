import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
import { useCallback, useEffect } from "react";
// material
import { makeStyles } from "@material-ui/core/styles";

import { Box, Typography } from "@material-ui/core";

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  letter: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "18px",
    letterSpacing: "-0.02em",
    color: "#838383",
    "&:hover": {
      opacity: 0.72,
      cursor: "pointer",
    },
    [theme.breakpoints.up("md")]: {
      textAlign: "left",
      flexDirection: "row",
    },
  },
  dragdrop: {
    marginLeft: "0.5rem",
  },
}));

// ----------------------------------------------------------------------

UploadSingleFile.propTypes = {
  caption: PropTypes.string,
  error: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  sx: PropTypes.object,
};

export default function UploadSingleFile({
  caption,
  error = false,
  value: file,
  onChange: setFile,
  sx,
  ...other
}) {
  const classes = useStyles();

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setFile({
          ...file,
          size: file.size,
          type: file.type,
          name: file.name,
          preview: URL.createObjectURL(file),
        });
      }
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop: handleDrop,
      multiple: false,
    });

  useEffect(
    () => () => {
      console.log("file", file);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
    },
    [file]
  );

  return (
    <Box
      {...getRootProps()}
      sx={{
        ...(isDragActive && { opacity: 0.72 }),
        ...((isDragReject || error) && {
          color: "error.main",
          borderColor: "error.light",
          bgcolor: "error.lighter",
          display: "inline-block",
        }),
        ...file,
      }}
    >
      <input {...getInputProps()} />

      {!file && (
        <Box
          display="flex"
          alignItems="center"
          sx={{
            height: "32px",
            paddingLeft: "1.5rem",
          }}
        >
          <Typography className={classes.letter}>
            or drag your file here
          </Typography>
          <img src="/assets/dragdrop.png" className={classes.dragdrop} />
        </Box>
      )}

      {file && (
        <Box
          alt="file preview"
          display="flex"
          alignItems="center"
          sx={{
            height: "32px",
            paddingLeft: "1.5rem",
          }}
        >
          <Typography className={classes.letter}>{file.name}</Typography>
        </Box>
      )}
    </Box>
  );
}
