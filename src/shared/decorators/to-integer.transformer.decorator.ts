import { Transform } from 'class-transformer';

export const ToInteger = () => {
  const toPlain = Transform(
    ({ value }) => {
      return value;
    },
    {
      toPlainOnly: true,
    },
  );
  const toClass = (target: any, key: string) => {
    return Transform(
      ({ obj }) => {
        return valueToInteger(obj[key]);
      },
      {
        toClassOnly: true,
      },
    )(target, key);
  };

  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
};

const valueToInteger = (value: any) => {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value : value.toFixed(0);
  }
  
  if (!(value.toString())) return undefined;
  
  return Number.parseInt(value.toString(), 10);
};
