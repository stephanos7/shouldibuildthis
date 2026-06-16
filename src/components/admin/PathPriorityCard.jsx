import { useMemo } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography
} from "@mui/material";
import RankedSignalList from "./RankedSignalList.jsx";
import { rankOrderToShares } from "../../model/businessCalibrationCompiler.js";

function normalizeDisplayOrder(order, signalGroup) {
  const knownKeys = Object.keys(signalGroup ?? {});
  const knownKeySet = new Set(knownKeys);
  const seen = new Set();
  const normalizedOrder = [];

  for (const signalKey of order ?? []) {
    if (!knownKeySet.has(signalKey) || seen.has(signalKey)) {
      continue;
    }

    seen.add(signalKey);
    normalizedOrder.push(signalKey);
  }

  for (const signalKey of knownKeys) {
    if (!seen.has(signalKey)) {
      normalizedOrder.push(signalKey);
    }
  }

  return normalizedOrder;
}

function buildItems(order, signalGroup) {
  return order.map((signalKey) => ({
    signalKey,
    signal: signalGroup[signalKey]
  }));
}

function formatSharePercent(value) {
  if (!Number.isFinite(value)) {
    return "N/A";
  }

  return `${(value * 100).toFixed(1)}%`;
}

function PathPriorityCard({
  pathKey,
  pathLabel,
  pathConfig,
  value,
  defaultValue,
  onOrderChange
}) {
  const positiveOrder = useMemo(
    () => normalizeDisplayOrder(value?.positiveSignalsOrder, pathConfig.positiveSignals),
    [pathConfig.positiveSignals, value?.positiveSignalsOrder]
  );
  const dragOrder = useMemo(
    () => normalizeDisplayOrder(value?.dragSignalsOrder, pathConfig.dragSignals),
    [pathConfig.dragSignals, value?.dragSignalsOrder]
  );
  const positiveItems = useMemo(
    () => buildItems(positiveOrder, pathConfig.positiveSignals),
    [pathConfig.positiveSignals, positiveOrder]
  );
  const dragItems = useMemo(
    () => buildItems(dragOrder, pathConfig.dragSignals),
    [dragOrder, pathConfig.dragSignals]
  );
  const positiveShares = useMemo(() => rankOrderToShares(positiveOrder), [positiveOrder]);
  const dragShares = useMemo(() => rankOrderToShares(dragOrder), [dragOrder]);
  const isCustomOrder =
    JSON.stringify(positiveOrder) !== JSON.stringify(defaultValue?.positiveSignalsOrder ?? []) ||
    JSON.stringify(dragOrder) !== JSON.stringify(defaultValue?.dragSignalsOrder ?? []);
  const helpsAccordionId = `${pathKey}-helps-accordion`;
  const helpsAccordionSummaryId = `${pathKey}-helps-summary`;
  const dragsAccordionId = `${pathKey}-drags-accordion`;
  const dragsAccordionSummaryId = `${pathKey}-drags-summary`;
  const detailsAccordionId = `${pathKey}-details-accordion`;
  const detailsAccordionSummaryId = `${pathKey}-details-summary`;

  const handleMove = (groupKey, currentIndex, nextIndex) => {
    const currentOrder = groupKey === "positiveSignalsOrder" ? positiveOrder : dragOrder;

    if (nextIndex < 0 || nextIndex >= currentOrder.length) {
      return;
    }

    const nextOrder = [...currentOrder];
    const [movedSignal] = nextOrder.splice(currentIndex, 1);
    nextOrder.splice(nextIndex, 0, movedSignal);
    onOrderChange(pathKey, groupKey, nextOrder);
  };

  return (
    <Card elevation={0} sx={{ border: 1, borderColor: "divider" }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack spacing={2.25}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
          >
            <Stack spacing={0.75}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
                <Typography variant="h6" component="h3">
                  {pathLabel}
                </Typography>
                <Chip
                  label={isCustomOrder ? "Custom order" : "Built-in order"}
                  color={isCustomOrder ? "primary" : "default"}
                  variant="outlined"
                  size="small"
                />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Rank the signals that help or drag on this path. Higher items compile to larger
                shares when saved.
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={`Helps: ${positiveOrder.length}`} variant="outlined" size="small" />
              <Chip label={`Drags: ${dragOrder.length}`} variant="outlined" size="small" />
            </Stack>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
              gap: 2
            }}
          >
            <Accordion defaultExpanded disableGutters elevation={0} sx={{ border: 1, borderColor: "divider" }}>
              <AccordionSummary
                id={helpsAccordionSummaryId}
                aria-controls={helpsAccordionId}
                sx={{ px: 2, py: 1.25 }}
              >
                <Typography variant="subtitle1" component="div">
                  Helps this path
                </Typography>
              </AccordionSummary>
              <AccordionDetails id={helpsAccordionId} sx={{ px: 2, pb: 2 }}>
                <RankedSignalList
                  pathLabel={pathLabel}
                  listLabel="helps"
                  impactLabel="Helps this path"
                  items={positiveItems}
                  onMoveItem={(currentIndex, nextIndex) =>
                    handleMove("positiveSignalsOrder", currentIndex, nextIndex)
                  }
                />
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded disableGutters elevation={0} sx={{ border: 1, borderColor: "divider" }}>
              <AccordionSummary
                id={dragsAccordionSummaryId}
                aria-controls={dragsAccordionId}
                sx={{ px: 2, py: 1.25 }}
              >
                <Typography variant="subtitle1" component="div">
                  Drags on this path
                </Typography>
              </AccordionSummary>
              <AccordionDetails id={dragsAccordionId} sx={{ px: 2, pb: 2 }}>
                <RankedSignalList
                  pathLabel={pathLabel}
                  listLabel="drags"
                  impactLabel="Drags on this path"
                  items={dragItems}
                  onMoveItem={(currentIndex, nextIndex) =>
                    handleMove("dragSignalsOrder", currentIndex, nextIndex)
                  }
                />
              </AccordionDetails>
            </Accordion>
          </Box>

          <Accordion disableGutters elevation={0} sx={{ border: 1, borderColor: "divider" }}>
            <AccordionSummary
              id={detailsAccordionSummaryId}
              aria-controls={detailsAccordionId}
              sx={{ px: 2, py: 1.25 }}
            >
              <Typography variant="subtitle1" component="div">
                Details
              </Typography>
            </AccordionSummary>
            <AccordionDetails id={detailsAccordionId} sx={{ px: 2, pb: 2 }}>
              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Generated share percentages are based on signal rank. Higher items receive larger
                  shares when the profile is saved.
                </Typography>
                <Box>
                  <Typography variant="subtitle2" component="div" sx={{ mb: 1 }}>
                    Helps this path
                  </Typography>
                  <Stack spacing={1}>
                    {positiveItems.map(({ signalKey, signal }, index) => (
                      <Stack
                        key={signalKey}
                        direction="row"
                        spacing={1}
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="body2" color="text.secondary">
                          {index + 1}. {signal.label}
                        </Typography>
                        <Chip
                          label={formatSharePercent(positiveShares[signalKey])}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    ))}
                  </Stack>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" component="div" sx={{ mb: 1 }}>
                    Drags on this path
                  </Typography>
                  <Stack spacing={1}>
                    {dragItems.map(({ signalKey, signal }, index) => (
                      <Stack
                        key={signalKey}
                        direction="row"
                        spacing={1}
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="body2" color="text.secondary">
                          {index + 1}. {signal.label}
                        </Typography>
                        <Chip
                          label={formatSharePercent(dragShares[signalKey])}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default PathPriorityCard;
