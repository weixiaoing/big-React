import { beginWork } from './beginWork';
import { commitMutationEffect } from './commitMutationEffects';
import { completeWork } from './completeWork';
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber';
import { MutationMask, NoFlags } from './fiberFlags';
import { HostRoot } from './workTags';
let workInProgress: FiberNode | null = null;
function renderRoot(root: FiberRootNode) {
	// 将根节点推入循环队列
	prepareFreshStack(root);
	try {
		// 开始循环任务
		workLoop();
	} catch (e) {
		console.warn('worlLoop error', e);
		workInProgress = null;
	}
	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;

	// 提交阶段的入口函数
	commitRoot(root);
}

function commitRoot(root: FiberRootNode) {
	const finishedWork = root.finishedWork;
	if (finishedWork == null) {
		return;
	}
	if (__DEV__) {
		console.log('commit 阶段开始');
	}

	root.finishedWork = null;

	const subtreeHasEffects =
		(finishedWork.subtreeFlags & MutationMask) !== NoFlags;
	const rootHasEffects = (finishedWork.flags & MutationMask) !== NoFlags;
	if (subtreeHasEffects || rootHasEffects) {
		//TODO beforeutation

		commitMutationEffect(finishedWork);
		root.current = finishedWork;
		// TODO LAYOUT
	} else {
		root.current = finishedWork;
	}
}

function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {});
}

// 从根节点向下遍历,到叶子结点开始遍历兄弟结点,兄弟节点遍历完开始遍历父节点的兄弟结点,最终回溯到根节点的return(null])
function workLoop() {
	while (workInProgress !== null) {
		//深度优先遍历,向下递归子节点
		performUnitOfWork(workInProgress);
	}
}

function performUnitOfWork(fiber: FiberNode) {
	// 比较并返回fiber的子节点(创建fiber的子节点，为子节点打上update标签，返回子节点)
	const next = beginWork(fiber);
	fiber.memoizedProps = fiber.pendingProps;
	if (next == null) {
		// 此时已经到叶子结点
		// 遍历兄弟节点
		completeUnitOfWork(fiber);
	} else {
		workInProgress = next;
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;
	// 深度优先遍历兄弟节点或父节点
	do {
		completeWork(node);
		const sibling = node.sibling;
		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		node = node?.return;
		workInProgress = node;
	} while (node !== null);
}

// 调度功能
export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// 从触发更新的结点一路遍历到根节点 fiberrootnode节点
	const root = markUpdateFromFiberToRoot(fiber);
	//root可能为空
	renderRoot(root!);
}

function markUpdateFromFiberToRoot(fiber: FiberNode): FiberRootNode | null {
	let node = fiber;
	// 从触发更新的结点一路遍历到根节点
	while (node.return !== null) {
		node = node.return;
	}
	if (node.tag === HostRoot) {
		// 返回根节点与容器的中继结点
		return node.stateNode;
	}
	return null;
}
