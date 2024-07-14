
export interface PromiseState<T> { // Define types of a PromiseState
  promise: Promise<T> | null;
  data: T | null;
  error: Error | null;
}

export function resolvePromise<T>(prms: Promise<T>, promiseState: PromiseState<T>): void {
  promiseState.promise = prms;
  promiseState.data = null;
  promiseState.error = null;

  const resolveSuccessACB = (data: T) => {
    if (promiseState.promise === prms) { // Make sure same promise is being handled
      promiseState.data = data;
    }
  };

  const resolveFailureACB = (error: Error) => {
    if (promiseState.promise === prms) {
      promiseState.error = error;
    }
  };

  if (prms) {
    prms.then(resolveSuccessACB).catch(resolveFailureACB);
  }
}

