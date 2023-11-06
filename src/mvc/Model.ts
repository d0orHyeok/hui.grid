export default class Model<T> {
  state?: T;
  constructor(state?: T) {
    this.state = state;
  }
}
