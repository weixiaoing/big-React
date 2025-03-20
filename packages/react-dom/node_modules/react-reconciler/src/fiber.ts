import { Container } from 'hostConfig';
import { Key, Props, ReactElementType, Ref } from 'shared/ReactTypes';
import { Flags, NoFlags } from './fiberFlags';
import { FunctionComponent, HostComponent, WorkTag } from './workTags';

export class FiberNode {
	tag: WorkTag;
	key: Key;
	stateNode: any; //fiber对应的dom实例
	type: any; //可以是原生Dom元素,函数组件,类组件
	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;
	ref: Ref;
	pendingProps: Props; //要更新的属性
	memoizedProps: Props; //更新完的属性
	memoizedState: any; //更新完成后的新的state
	alternate: FiberNode | null; //指向备用结点 一般是老结点
	flags: Flags; //节点副作用类型
	subtreeFlags: Flags; //子节点的副作用类型
	updateQueue: unknown; //更新计划队列
	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 基本类型
		this.tag = tag;
		this.key = key;
		this.ref = null;
		this.stateNode = null;
		this.type = null;

		// fiber树结构
		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;

		// 工作单元
		this.pendingProps = pendingProps;
		this.memoizedProps = null;
		this.memoizedState = null;

		this.alternate = null;
		this.flags = NoFlags;
		this.subtreeFlags = NoFlags;
		this.updateQueue = null;
	}
}
// 通过container连接容器,通过current连接fiber树根节点
export class FiberRootNode {
	container: Container;
	current: FiberNode;
	finishedWork: FiberNode | null;
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	// fiber 结点的旧结点
	let workInProgress = current.alternate;

	if (workInProgress === null) {
		// 首屏渲染 (mount)
		workInProgress = new FiberNode(current.tag, pendingProps, current.key);
		workInProgress.stateNode = current.stateNode;

		// 添加双缓冲机制(就是设置备用节点)
		workInProgress.alternate = current;
		current.alternate = workInProgress;
	} else {
		// 非首屏渲染(update)
		workInProgress.pendingProps = pendingProps;
		// effect副作用链表置空,在更新过程中记录新的副作用
		workInProgress.flags = NoFlags;
		workInProgress.subtreeFlags = NoFlags;
	}

	workInProgress.type = current.type;
	workInProgress.updateQueue = current.updateQueue;
	workInProgress.child = current.child;
	workInProgress.memoizedProps = current.memoizedProps;
	workInProgress.memoizedState = current.memoizedState;

	return workInProgress;
};

// 根据dom节点创建新的fiber节点
export function createFiberFromElement(element: ReactElementType): FiberNode {
	const { type, key, props } = element;
	let fiberTag: WorkTag = FunctionComponent;
	// 判断是函数组件还是原生dom
	if (typeof type == 'string') {
		fiberTag = HostComponent;
	} else if (typeof type !== 'function' && __DEV__) {
		console.warn('未实现的类型', type);
	}
	const fiber = new FiberNode(fiberTag, props, key);
	fiber.type = type;
	return fiber;
}
