import { ElementType, Key, Props, Ref } from 'shared/ReactTypes';
import { ReactElement } from '.';

/* React 17之前，JSX 转换结果
function App() {
	return React.createElement('div', null, 'Hello world!');
}

// React 17之后，JSX 转换结果
function App() {
	return _jsx('div', { children: 'Hello world!' });
 }
*/

// jsx转化
// 编译时 Babel会将jsx语法转化成JavaScript API
// 运行时，使用React 的jsx和React.createElement 将jsx语法转化成ReactElement对象
// babel会将jsx的标签转化成 tag：type，props：config，children
export const jsx = (type: ElementType, config: any, ...children: any) => {
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = {};
	//主要是将config中的属性提取到key，ref和props
	for (const prop in config) {
		const value = config[prop];
		if (prop === 'key') {
			if (value !== undefined) {
				key = '' + value;
			}
			continue;
		}
		if (prop === 'ref') {
			if (value !== undefined) {
				ref = value;
			}
			continue;
		}
		if (Object.hasOwn(config, prop)) {
			props[prop] = value;
		}
	}
	// 将children转化给props.children
	const childrenLength = children.length;
	if (childrenLength) {
		if (childrenLength === 1) {
			props.children = children[0];
		} else {
			props.children = children;
		}
	}
	return ReactElement(type, key, ref, props);
};

// 开发环境不处理children
export const jsxDEV = (type: ElementType, config: any, ...children: any) => {
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = {};
	//主要是将config中的属性提取到key，ref和props
	for (const prop in config) {
		const value = config[prop];
		if (prop === 'key') {
			if (value !== undefined) {
				key = '' + value;
			}
			continue;
		}
		if (prop === 'ref') {
			if (value !== undefined) {
				ref = value;
			}
			continue;
		}
		if (Object.hasOwn(config, prop)) {
			props[prop] = value;
		}
	}

	return ReactElement(type, key, ref, props);
};
