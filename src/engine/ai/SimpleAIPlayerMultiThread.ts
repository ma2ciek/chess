import MultiThreadPlayer from './MultiThreadPlayer';

export default class SimpleAIPlayerMultiThread extends MultiThreadPlayer {
	public readonly name = 'AI: Simple Player MT';

	protected readonly workerName = 'SimpleAIPlayerWorker.js';
}
