export type Container = Element;
export type Instance = Element;
/**
 *
 * 创建dom实例
 */
export const createInstance = (type: string, porps: any): Instance => {
	// TODO: 处理 props
	const element = document.createElement(type);
	return element;
};
/**
 * 为dom实例添加子节点
 */
export const appendInitialChild = (
	parent: Instance | Container,
	child: Instance
) => {
	parent.appendChild(child);
};

export const createTextInstance = (content: string) => {
	const element = document.createTextNode(content);
	return element;
};

export const appendChildToContainer = (
	child: Instance,
	parent: Instance | Container
) => {
	parent.appendChild(child);
};
