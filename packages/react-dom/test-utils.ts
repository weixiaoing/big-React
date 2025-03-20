// packages/react-dom/test-utils.ts
import { createRoot } from 'react-dom/client';
import { ReactElementType } from 'shared/ReactTypes';

export function renderIntoDocument(element: ReactElementType) {
	const div = document.createElement('div');
	return createRoot(div).render(element);
}
