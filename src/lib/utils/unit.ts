export const slug = (s: string) =>
  (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-')
    .replace(/^\-|\-$/g, '');

export const cartesian = <T>(arrays: T[][]): T[][] =>
  arrays.length
    ? arrays.reduce<T[][]>(
        (acc, cur) => acc.flatMap((a) => cur.map((b) => [...a, b] as T[])),
        [[]] as T[][],
      )
    : [[]];
