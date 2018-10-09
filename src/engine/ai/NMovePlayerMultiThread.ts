import MultiThreadPlayer from './MultiThreadPlayer';

export default class NMovePlayerMultiThread extends MultiThreadPlayer {
	protected readonly workerName = 'NMovePlayerWorker.js';
}
