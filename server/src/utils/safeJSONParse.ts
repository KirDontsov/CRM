/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types */
/**
 * Безопасный парсинг JSON. Функция логирует ошибку, не прырывая работу приложнения
 * @param  {string} text разбираемая строка JSON
 * @param  {Function} handler обработчик в случае ошибки парсинга
 * @returns {*}
 */
export function safeJSONParse(text: string, handler?: Function): any {
  try {
    return JSON.parse(text);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`JSON parsing error: ${error}`);
    if (handler) {
      return handler(error);
    }
    return true;
  }
}
