import { PromiseState } from "../resolvePromise.ts";

export function RenderPromise(promiseState: PromiseState<object>) {
  if (!promiseState.promise) {
    return <div>no data</div>;
  } else if (!promiseState.data && !promiseState.error) {
    return (
      <img
        src={
          "https://i.pinimg.com/originals/b4/4e/22/b44e229598a8bdb7f2f432f246fb0813.gif"
        }
        alt="loading"
        style={{ display: "block", margin: "30vh auto" }}
      ></img>
    );
  } else if (!promiseState.data && promiseState.error) {
    return <div>{promiseState.error.toString()}</div>;
  } else {
    return false;
  }
}
