import { ReactElementType } from 'shared/ReactTypes';
import { mountChildFibers, reconcileChildFibers } from './childFiber';
import { FiberNode } from './fiber';
import { processUpdateQueue, UpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';

export const beginWork = (workInProgress: FiberNode) => {
	switch (workInProgress.tag) {
		case HostRoot:
			return updateHostRoot(workInProgress);
		case HostComponent:
			return updateHostComponent(workInProgress);
		case HostText:
			return updateHostText();
		default:
			if (__DEV__) {
				console.warn('beginWork未实现的情况', workInProgress.tag);
			}
			break;
		// 少了个函数组件
	}
};

function updateHostRoot(workInProgress: FiberNode) {
	const baseState = workInProgress.memoizedState;
	const updateQueue = workInProgress.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	// 清理更新链表(目前还不知道怎么成为链表,没有连接) pending目前就是个update节点 要么是一个传入对象要么是一个函数
	updateQueue.shared.pending = null;
	// 计算更新的最新值 调用更新队列中action回调，返回更新后的state
	// 在根节点中，memoized存储了子fiber节点
	const { memoizedState } = processUpdateQueue(baseState, pending);
	workInProgress.memoizedState = memoizedState;

	// 处理子节点（更新节点）的更新逻辑
	const nextChildren = workInProgress.memoizedState;
	reconcileChildren(workInProgress, nextChildren);
	return workInProgress.child;
}

function updateHostComponent(workInProgress: FiberNode) {
	const nextProps = workInProgress.pendingProps;
	const nextChildren = nextProps.children;
	reconcileChildren(workInProgress, nextChildren);
	return workInProgress.child;
}

// 处理文字节点直接返回null???
function updateHostText() {
	return null;
}

function reconcileChildren(
	workInProgress: FiberNode,
	children: ReactElementType
) {
	const current = workInProgress.alternate;
	if (current !== null) {
		// 更新阶段
		workInProgress.child = reconcileChildFibers(
			workInProgress,
			current.child,
			children
		);
	} else {
		workInProgress.child = mountChildFibers(workInProgress, null, children);
	}
}
