import './style.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import GameContainer from './view/GameContainer';

ReactDOM.render(
	<GameContainer />,
	document.querySelector( '#root' ),
);
