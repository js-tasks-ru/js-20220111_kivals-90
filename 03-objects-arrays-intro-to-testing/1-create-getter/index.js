/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  return function (obj) {
    const pathArr = path.split('.');
    let deep = 0;

    /* Рекурсивная функция получения значения объекта по заданному свойству */
    function search(obj, prop) {
      // Условие достижения максимальной глубины поиска
      if (deep === pathArr.length) {
        return obj;
      }
      // Условие недостижимости заданного пути
      if (obj[prop] === undefined) {
        return;
      }
      deep++;
      return search(obj[prop], pathArr[deep]);
    }
    return search(obj, pathArr[deep]);
  };
}
