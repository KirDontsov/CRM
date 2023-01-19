import { WorkTypes } from '../../../apollo-client';

export const WORK_TYPES = {
  [WorkTypes.GlassReplacementNew]: 'Замена стекла (НОВОЕ)',
  [WorkTypes.GlassReplacementOld]: 'Замена стекла (СТАРОЕ)',
  [WorkTypes.RIGlass]: 'С/У стекла',
  [WorkTypes.CaseRepair]: 'Ремонт корпуса',
  [WorkTypes.BracketsRepair]: 'Ремонт кронштейнов',
  [WorkTypes.Polishing]: 'Полировка',
  [WorkTypes.MaskPainting]: 'Покраска маски',
  [WorkTypes.LensReplacement]: 'Замена линз',
};

export const mapWorkTypes = (types: WorkTypes[]) => {
  const strArr: string[] = [];
  types.forEach((type) => {
    strArr.push(WORK_TYPES[type]);
  });
  return strArr.join(', ');
};
