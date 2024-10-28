import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { GTRGeneralService } from '../_service/gtr_general.service';
import { ActionTypes, GTtrHeaderOverviewSuccessAction } from './gtr-web.action';

@Injectable()
export class GtrWebEffects {
	public loadCatalogs$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ActionTypes.GTR_HEADER_OVERVIEW),
			mergeMap(() =>
				this.GTRGeneralService.getHeaderNews().pipe(
					map(orders =>{ console.log(orders);return new GTtrHeaderOverviewSuccessAction(orders)}),
					catchError(() => EMPTY)
				)
			)
		)
	);

	constructor(private actions$: Actions, private GTRGeneralService: GTRGeneralService) {}
}
