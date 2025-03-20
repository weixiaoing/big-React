// 检查是否有 运行环境是否有 Symbol
const supportSymbol = typeof Symbol === 'function' && Symbol.for;
// 这个是ReactElement的$$typeof 用于防范XSS注入攻击（会将对象渲染成元素）
// json字符串不能为Symbol 用于防范XSS （传入的json字符串无法传入$$typeof）也就无法生成ReactElement元素
export const REACT_ELEMENT_TYPE = supportSymbol
	? Symbol.for('react.element')
	: 0xeac7;
