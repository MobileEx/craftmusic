export default class Queue {
  static queue = [];

  static activePromise = null;

  static activePromiseQueue = [];

  static add(promiseCreator) {
    // console.log('addin the promise creator', promiseCreator);
    this.queue.push(promiseCreator);
    // if (queue.length === 0) {
    this.run();
    // }
  }

  static async run() {
    // console.log('queue run checks');
    if (this.queue.length === 0 || this.activePromise) {
      return;
    }
    let result;
    const taskCreator = this.queue.shift();
    this.activePromise = taskCreator();
    try {
      // console.log('running queue job');
      result = await this.activePromise;
    } catch (e) {
      // console.log('error running job', e);
    }
    // console.log('job finished', result);
    this.activePromise = null;
    this.run();
  }
}
