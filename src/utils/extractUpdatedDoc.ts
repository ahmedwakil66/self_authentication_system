// WARNING: currently does not validate nested object
const extractUpdatedDoc = (
  props: Array<string>,
  source: Record<string, any>,
  options?: {
    ignoreKeys?: Array<string> | string;
    useKeys?: Array<string> | string;
  }
) => {
  const updatedDoc: Record<string, any> = {};
  const sourceProps = Object.keys(source);

  const ignoreKeys = options?.ignoreKeys;
  const useKeys = options?.useKeys;

  for (const prop of props) {
    if (ignoreKeys && useKeys)
      throw new Error("Provide either ignoreKeys or useKeys, not both");
    else if (ignoreKeys && ignoreKeys.indexOf(prop) !== -1) {
      continue;
    } else if (useKeys && useKeys.indexOf(prop) === -1) {
      continue;
    }

    if (sourceProps.indexOf(prop) !== -1 && source[prop] !== undefined) {
      if (Array.isArray(source[prop])) {
        // assume array does not have any non null object value
        updatedDoc[prop] = source[prop];
      } else if (typeof source[prop] === "object" && source[prop] !== null) {
        // TODO handle nested object validation
        updatedDoc[prop] = source[prop];
      } else {
        updatedDoc[prop] = source[prop];
      }
    }
  }

  return updatedDoc;
};

export default extractUpdatedDoc;
