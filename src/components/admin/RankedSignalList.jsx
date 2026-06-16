import { List, Typography } from "@mui/material";
import SignalPriorityListItem from "./SignalPriorityListItem.jsx";

function RankedSignalList({
  pathLabel,
  listLabel,
  impactLabel,
  items = [],
  onMoveItem = () => {}
}) {
  if (items.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No signals are configured for this path panel.
      </Typography>
    );
  }

  return (
    <List disablePadding>
      {items.map(({ signalKey, signal }, index) => (
        <SignalPriorityListItem
          key={signalKey}
          rank={index + 1}
          signal={signal}
          pathLabel={pathLabel}
          listLabel={listLabel}
          impactLabel={impactLabel}
          disableMoveUp={index === 0}
          disableMoveDown={index === items.length - 1}
          divider={index < items.length - 1}
          onMoveUp={() => onMoveItem(index, index - 1)}
          onMoveDown={() => onMoveItem(index, index + 1)}
        />
      ))}
    </List>
  );
}

export default RankedSignalList;
