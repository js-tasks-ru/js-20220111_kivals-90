/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  const stringList = string.split('');
  let counter = 1;
  let prevLetter = "";

  if (size === 0) {
    return '';
  }

  return stringList.reduce((acc, current) => {
    if (current !== prevLetter) {
      counter = 1;
      prevLetter = current;
      acc.push(current);
    } else if (counter !== size) {
      counter++;
      acc.push(current);
    }
    return acc;
  }, []).join('');
}
