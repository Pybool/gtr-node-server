import { Action } from '@ngrx/store';

export enum ActionTypes {
	GTR_HEADER_OVERVIEW = '[GTR Header Overview] Request',
	GTR_HEADER_OVERVIEW_SUCCESS = '[GTR Header Overview] Success',
	GTR_NEWS_NUMBER = '[GTR Landing Overview] Request',
	GTR_NEWS_HOME_PAGE_NUMBER = '[GTR Home Page Number] Request',
	GTR_NEWS_CATEGORY_PAGE_NUMBER = '[GTR Category Page Number] Request'
}

export class GTtrHeaderOverviewAction implements Action {
	readonly type = ActionTypes.GTR_HEADER_OVERVIEW;
	constructor() {}
}
export class GTtrNumberNumberAction implements Action {
	readonly type = ActionTypes.GTR_NEWS_NUMBER;
	constructor(public payload: number) {}
}
export class GTtrNewsHomePageNumberAction implements Action {
	readonly type = ActionTypes.GTR_NEWS_HOME_PAGE_NUMBER;
	constructor(public payload:any[]=[] ) {}
}
export class GTtrNewsCategoryPageNumberAction implements Action {
	readonly type = ActionTypes.GTR_NEWS_CATEGORY_PAGE_NUMBER;
	constructor(public payload:{name:string;load:any[]} ) {}
}
export class GTtrHeaderOverviewSuccessAction implements Action {
	readonly type = ActionTypes.GTR_HEADER_OVERVIEW_SUCCESS;
	constructor(public payload: any[]) {}
}

export type Actions = GTtrHeaderOverviewAction | GTtrNewsCategoryPageNumberAction | GTtrHeaderOverviewSuccessAction | GTtrNumberNumberAction | GTtrNewsHomePageNumberAction;
