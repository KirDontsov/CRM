export enum WorkTypes {
  GlassReplacementNew = 'GlassReplacementNew',
  GlassReplacementOld = 'GlassReplacementOld',
  RIGlass = 'RIGlass',
  CaseRepair = 'CaseRepair',
  BracketsRepair = 'BracketsRepair',
  Polishing = 'Polishing',
  MaskPainting = 'MaskPainting',
  LensReplacement = 'LensReplacement',
}

export enum UserRoles {
  Admin = 'Admin',
  Reader = 'Reader',
}

export enum OrdersStatuses {
  Open = 'Open',
  InProgress = 'InProgress',
  NeedInfo = 'NeedInfo',
  Paused = 'Paused',
  WaitingForDelivery = 'WaitingForDelivery',
  Done = 'Done',
  Cancelled = 'Cancelled',
}
