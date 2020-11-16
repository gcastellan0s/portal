import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from './app.reducer';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  loadingSuscription: Subscription = new Subscription();

  constructor( private store: Store<AppState>, private spinner: NgxSpinnerService ){
    this.loadingSuscription = store.select('ui').subscribe( ui=>{
      if(ui.isLoading){
        this.spinner.show();
      }else{
        this.spinner.hide();
      }
    });
  }
  
  ngOnDestroy(){
    this.loadingSuscription.unsubscribe();
  }

}
