import { Container } from 'hostConfig';
import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode, FiberRootNode } from './fiber';
import {
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	UpdateQueue
} from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';
import { HostRoot } from './workTags';

//传入容器,返回current指向fiber树根节点 container指向容器的fiberRootnode
export function createContainer(container: Container) {
	// 初始化fiber树根节点
	const hostRootFiber = new FiberNode(HostRoot, {}, null);
	// 连接通过根节点和容器
	const root = new FiberRootNode(container, hostRootFiber);
	//?? 为啥不能直接在初始化时 创建呢
	hostRootFiber.updateQueue = createUpdateQueue();
	return root;
}
/**
 *
 * 使用传入的element(一般为<App/>)创建新的更新节点,加入fiber根节点的更新队列中，然后调度改节点的更新结点
 */
export function updateContainer(
	element: ReactElementType | null,
	root: FiberRootNode
) {
	const hostRootFiber = root.current;
	const update = createUpdate<ReactElementType | null>(element);
	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
		update
	);
	// 调度该根节点上的更新结点
	scheduleUpdateOnFiber(hostRootFiber);
	return element;
}
