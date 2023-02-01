/**
 * Проеряет налияие поля в объекте
 */
export function hasFilialIds<V>(input: V): boolean {
  return Object.prototype.hasOwnProperty.call(input, 'filialIds');
}
