import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { ReactElementType } from 'shared/ReactTypes';
import { createFiberFromElement, FiberNode } from './fiber';
import { Placement } from './fiberFlags';
import { HostText } from './workTags';

function ChildReconciler(shouldTrackSideEffects: boolean) {
	// 处理单节点（element创建fiber节点将returnFiber传入.return）
	function reconcileSingleElement(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		element: ReactElementType
	) {
		const fiber = createFiberFromElement(element);
		fiber.return = returnFiber;
		return fiber;
	}

	// 处理文本节点
	function reconcileSingleTextNode(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		content: string | number
	) {
		const fiber = new FiberNode(HostText, { content }, null);
		fiber.return = returnFiber;
		return fiber;
	}

	// fiber节点添加更新flag
	function placeSingleChild(fiber: FiberNode) {
		//首屏渲染且追踪副作用时才添加更新flags
		if (shouldTrackSideEffects && fiber.alternate == null) {
			fiber.flags |= Placement;
		}
		return fiber;
	}
	// 根据不同阶段，返回不同实现
	/**
	 * 根据newChild创建new fiber new fiber的return指向returnfiber
	 * return new fiber
	 */
	return function reconcileChildrenFibers(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		newChild?: ReactElementType
	) {
		if (typeof newChild == 'object' && newChild !== null) {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(returnFiber, currentFiber, newChild)
					);
				default:
					if (__DEV__) {
						console.warn('未实现的类型', newChild);
					}
					break;
			}
		}
		if (Array.isArray(newChild)) {
			//TODO : 暂不处理
			if (__DEV__) {
				console.warn('未实现的reconcile类型', newChild);
			}
		}
		if (typeof newChild === 'string' || typeof newChild === 'number') {
			//创建fiber文本节点
			return placeSingleChild(
				reconcileSingleTextNode(returnFiber, currentFiber, newChild)
			);
		}
		if (__DEV__) {
			console.warn('未实现的reconcile类型', newChild);
		}
		return null;
	};
}

// 更新阶段 追踪副作用
export const reconcileChildFibers = ChildReconciler(true);
// 首屏渲染阶段，不追踪副作用，只对根节点进行一次dom插入操作
export const mountChildFibers = ChildReconciler(false);
