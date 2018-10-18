import MultiThreadPlayer from './MultiThreadPlayer';

export default class NMovePlayerMultiThread extends MultiThreadPlayer {
	public static readonly playerName = 'AI: N-Move Player MT';

	protected readonly workerName = 'NMovePlayerWorker.js';
}
