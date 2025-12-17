import { MainPage } from '../modules/main/main-page';

import type { Route } from './+types/main';

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: 'Main - File Manager' },
		{ name: 'description', content: 'Main page of File Manager' },
	];
}

export default function Main() {
	return <MainPage />;
}
