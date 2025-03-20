import React from 'react';
import ReactDOM from 'react-dom/client';

const jsx = (
	<div>
		<span>hello my-react</span>
	</div>
);

function App() {
	return <span>test</span>;
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
console.log('root', root);

// root.render(jsx);
root.render(<App />);
