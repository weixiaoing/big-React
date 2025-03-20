// packages/react/src/jsx.ts
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { Key, Props, ReactElementType, Ref, Type } from 'shared/ReactTypes';

export const ReactElement = function (
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElementType {
	// 根据参数转化成reactelement对象 打上标记
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: 'dawn'
	};
	return element;
};
