import MultiThreadPlayer from './MultiThreadPlayer';

export default class NMovePlayerMultiThread extends MultiThreadPlayer {
	public readonly name = 'AI: N-Move Player MT';

	protected readonly workerName = 'NMovePlayerWorker.js';
}
