import { WorkTypes } from '@src/apollo-client';

import { mapWorkTypes, WORK_TYPES } from '../utils';

describe('mapWorkTypes', () => {
  test(`mapWorkTypes`, () => {
    const workType = mapWorkTypes([WorkTypes.Polishing]);
    expect(workType).toStrictEqual(WORK_TYPES[WorkTypes.Polishing]);
  });
});
