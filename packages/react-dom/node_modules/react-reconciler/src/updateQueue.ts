import { Action } from './../../shared/ReactTypes';

// 每次页面触发更新时会创建一个update,放入updatequeue
export interface Update<State> {
	action: Action<State>;
}

export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
}
// 创建更新结点
export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
	};
};
// 创建更新队列
export const createUpdateQueue = <State>(): UpdateQueue<State> => {
	return {
		shared: {
			pending: null
		}
	};
};

// 添加update
export const enqueueUpdate = <State>(
	UpdateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	UpdateQueue.shared.pending = update;
};
// 消费update
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memoizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState
	};
	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;
		if (action instanceof Function) {
			result.memoizedState = action(baseState);
		} else {
			result.memoizedState = action;
		}
	}

	return result;
};
