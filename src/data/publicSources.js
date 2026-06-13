export const PUBLIC_SOURCES = [
  {
    key: "dora-metrics",
    shortLabel: "DORA metrics",
    title: "DORA metrics and software delivery performance",
    publisher: "DORA",
    url: "https://dora.dev/guides/dora-metrics-four-keys/"
  },
  {
    key: "wcag-22",
    shortLabel: "WCAG 2.2",
    title: "Web Content Accessibility Guidelines (WCAG) 2.2",
    publisher: "W3C",
    url: "https://www.w3.org/TR/WCAG22/"
  },
  {
    key: "aria-apg",
    shortLabel: "ARIA APG",
    title: "WAI-ARIA Authoring Practices Guide",
    publisher: "W3C",
    url: "https://www.w3.org/WAI/ARIA/apg/"
  },
  {
    key: "webdev-virtualization",
    shortLabel: "React virtualization",
    title: "Virtualize large lists with react-window",
    publisher: "web.dev",
    url: "https://web.dev/articles/virtualize-long-lists-react-window"
  },
  {
    key: "mui-x-licensing",
    shortLabel: "MUI X licensing",
    title: "MUI X licensing",
    publisher: "MUI",
    url: "https://mui.com/x/introduction/licensing/"
  },
  {
    key: "mui-support",
    shortLabel: "MUI support",
    title: "MUI support options",
    publisher: "MUI",
    url: "https://mui.com/material-ui/getting-started/support/"
  }
];

export const PUBLIC_BENCHMARK_SOURCES = [
  {
    key: "cocomo-ii",
    shortLabel: "COCOMO II",
    title: "COCOMO II software cost estimation",
    publisher: "USC CSSE",
    url: "https://csse.usc.edu/tools/COCOMOII.php",
    supports: ["effort drivers", "schedule pressure", "reuse/COTS adjustment"]
  },
  {
    key: "flyvbjerg-it-overruns",
    shortLabel: "Flyvbjerg IT overruns",
    title: "Flyvbjerg et al. research on fat-tailed IT project overruns",
    publisher: "arXiv",
    url: "https://arxiv.org/abs/2210.01573",
    supports: ["fat-tailed project cost overrun risk", "interdependency risk"]
  },
  {
    key: "nist-software-errors",
    shortLabel: "NIST software errors",
    title: "NIST research on economic cost of software errors",
    publisher: "NIST",
    url: "https://www.nist.gov/news-events/news/2002/06/software-errors-cost-us-economy-595-billion-annually",
    supports: ["defect remediation", "quality/rework burden"]
  },
  {
    key: "isbsg",
    shortLabel: "ISBSG",
    title: "ISBSG software project benchmarking",
    publisher: "ISBSG",
    url: "https://www.isbsg.org/",
    supports: ["software project productivity and effort benchmarking"]
  }
];

export function getPublicSourceMap(sources = PUBLIC_SOURCES) {
  return Object.fromEntries(
    (Array.isArray(sources) ? sources : []).map((source) => [source.key, source])
  );
}
