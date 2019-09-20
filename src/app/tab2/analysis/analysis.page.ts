import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, Platform } from '@ionic/angular';
import { Chart } from 'chart.js'
import { HttpClient } from '@angular/common/http';
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.page.html',
  styleUrls: ['./analysis.page.scss'],
})
export class AnalysisPage implements OnInit {

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private platform: Platform,
    private http: HttpClient
  ) { 
    this.initializeApp();
  }

  public tweets = []

  initializeApp(){
    this.platform.ready().then(() => {
      this.getTweetAndSentiment();
      // this.showAnalysisPieChart();
    })
  }

  ngOnInit() {
  }

  getTweetAndSentiment(){
    this.http.get("http://1afe044f.ngrok.io/")
    .subscribe(
      (response) => {
        console.log("Test Response: " , response);
        console.log("Negative: ", response['Negative'])
        console.log("Neutral: ", response['Neutral'])
        console.log("Positive: ", response['Positive'])
        this.tweets = response['Tweets']
        this.showAnalysisPieChart(response['Positive'],response['Neutral'], response['Negative']);

      },
      error => {
        alert("Calling Test Flask Call Failed");
        console.log("Error: ", error);
      },
      () => {
        // alert("Test Flask Call Completed");
      }
    )
  }

  showAnalysisPieChart(positive, neutral, negative) {
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
              data: [positive, neutral, negative ],
              borderWidth: 2
            }]
       }
    });
  }

  closeModal(){
    this.modalController.dismiss()
  }
}
