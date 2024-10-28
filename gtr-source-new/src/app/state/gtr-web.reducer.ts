import { Actions, ActionTypes } from './gtr-web.action';
export function GtrWebReducer(state: any, action: Actions) {
	switch (action.type) {
		case ActionTypes.GTR_HEADER_OVERVIEW_SUCCESS:
			return {
				...state,
				GtrWebOverview: action.payload
			};
		case ActionTypes.GTR_NEWS_NUMBER:
			return {
				...state,
				GtrLandingNumber: action.payload
			};
		case ActionTypes.GTR_NEWS_HOME_PAGE_NUMBER:
			return {
				...state,
				GtrLandingPageNumber: action.payload
			};
		case ActionTypes.GTR_NEWS_CATEGORY_PAGE_NUMBER:
			return {
				...state,
				GtrCategoryPageNumber: action.payload
			};
		default:
			return state;
	}
}
