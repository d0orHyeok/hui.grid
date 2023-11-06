export default class Model<T extends Object = {}> {
  state: T;
  constructor(state: T = {} as T) {
    this.state = state;
  }
}
