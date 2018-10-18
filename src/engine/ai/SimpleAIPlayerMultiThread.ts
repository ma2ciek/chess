import MultiThreadPlayer from './MultiThreadPlayer';

export default class SimpleAIPlayerMultiThread extends MultiThreadPlayer {
	public static readonly playerName  = 'AI: Simple Player MT';

	protected readonly workerName = 'SimpleAIPlayerWorker.js';
}
