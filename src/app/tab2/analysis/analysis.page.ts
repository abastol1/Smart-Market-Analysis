import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, Platform } from '@ionic/angular';
import { Chart } from 'chart.js'

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.page.html',
  styleUrls: ['./analysis.page.scss'],
})
export class AnalysisPage implements OnInit {

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private platform: Platform
  ) { 
    this.initializeApp();
  }

  initializeApp(){
    this.platform.ready().then(() => {
      this.useAnotherOneWithWebpack();
    })
  }

  ngOnInit() {
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

  closeModal(){
    this.modalController.dismiss()
  }
}
