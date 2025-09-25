declare let process: {
  env: Record<string, string | undefined>;
};

type ImportMeta = {
  readonly env: Record<string, string | undefined>;
};
