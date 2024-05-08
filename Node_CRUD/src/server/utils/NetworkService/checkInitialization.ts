
// Typescript descriptor example
// Written for preventing method execution, if some class properties have not been
// initialized (in this case request, response). Don't need in current implementation, but let it be here as example.
// To use with method, just need to write @checkInitialization before method.
// Descriptor executes before method.
export const checkInitialization = (
  target: any,
  key: string,
  descriptor: PropertyDescriptor
) => {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args) {
    if (this.request && this.response) {
      originalMethod.apply(this, args);
    } else {
      return Promise.reject({ message: 'Network service not initialized' });
    }
  };
};
