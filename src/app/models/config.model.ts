export type RegionSet = {
  name?: string;
  slug?: string;
  regions: Region[];
};

export type Region = {
  slug: string;
  label: string;
  sheetId: string;
};
