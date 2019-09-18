import { Component } from '@angular/core';
import { Chart } from 'chart.js'
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(
    private platform: Platform
  ) {
    this.initializeApp();
  }

  initializeApp(){
    this.platform.ready().then(() => {
      this.useAnotherOneWithWebpack();
    })
  }

  useAnotherOneWithWebpack() {
    var ctx = (<any>document.getElementById('canvas-chart')).getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'pie',

        // The data for our dataset
        data: {
            labels: ["Negative", "Neutral", "Positive", ],
            datasets: [{
              label: "My First dataset",
              backgroundColor: [
                'red',
                'gray',
                'green' 
              ],
              borderColor: [
                'white',
                'white',
                'white'
              ],
              data: [30, 25, 45 ],
              borderWidth: 2
            }]
       }
    });
  }
}
