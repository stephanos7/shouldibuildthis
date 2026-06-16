import {
  Box,
  Chip,
  IconButton,
  ListItem,
  ListItemText,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";

function SignalPriorityListItem({
  rank,
  signal,
  pathLabel,
  listLabel,
  impactLabel,
  onMoveUp,
  onMoveDown,
  disableMoveUp = false,
  disableMoveDown = false,
  divider = false
}) {
  const moveUpLabel = `Move ${signal.label} up in ${pathLabel} ${listLabel} list`;
  const moveDownLabel = `Move ${signal.label} down in ${pathLabel} ${listLabel} list`;

  return (
    <ListItem
      disableGutters
      alignItems="flex-start"
      divider={divider}
      sx={{
        py: 1.25,
        pr: { xs: 0, sm: 12 }
      }}
      secondaryAction={
        <Stack direction="row" spacing={0.5}>
          <Tooltip title={moveUpLabel}>
            <span>
              <IconButton
                size="small"
                aria-label={moveUpLabel}
                onClick={onMoveUp}
                disabled={disableMoveUp}
              >
                <Box component="span" sx={{ fontSize: "0.8rem", fontWeight: 700, lineHeight: 1 }}>
                  Up
                </Box>
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={moveDownLabel}>
            <span>
              <IconButton
                size="small"
                aria-label={moveDownLabel}
                onClick={onMoveDown}
                disabled={disableMoveDown}
              >
                <Box component="span" sx={{ fontSize: "0.8rem", fontWeight: 700, lineHeight: 1 }}>
                  Down
                </Box>
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      }
    >
      <Stack spacing={0.5} sx={{ width: "100%" }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
          <Typography variant="body2" fontWeight={700}>
            {rank}.
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {signal.label}
          </Typography>
          <Chip label={impactLabel} size="small" variant="outlined" />
        </Stack>
        <ListItemText
          primaryTypographyProps={{ variant: "body2", color: "text.secondary" }}
          primary={signal.description}
          sx={{ my: 0 }}
        />
      </Stack>
    </ListItem>
  );
}

export default SignalPriorityListItem;
