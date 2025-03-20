import {
	createContainer,
	updateContainer
} from 'react-reconciler/src/fiberReconciler';
import { ReactElementType } from 'shared/ReactTypes';
import { Container } from './hostConfig';

export function createRoot(container: Container) {
	// 创建root节点,container指向容器，current指向fiber树根节点
	const root = createContainer(container);

	return {
		render(element: ReactElementType) {
			updateContainer(element, root);
		}
	};
}
