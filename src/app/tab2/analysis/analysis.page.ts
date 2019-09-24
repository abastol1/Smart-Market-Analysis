import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, Platform } from '@ionic/angular';
import { Chart } from 'chart.js'
import { HttpClient } from '@angular/common/http';
import { TouchSequence } from 'selenium-webdriver';
import { Http } from '@angular/http';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.page.html',
  styleUrls: ['./analysis.page.scss'],
  // providers: [Http]
})
export class AnalysisPage implements OnInit {

  companyName: string;

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private http: Http,
    private navParams: NavParams
  ) {
    this.initializeApp();
  }

  public tweets = []
  public dataPoints = [
    { x: new Date(2012, 1, 1), y: 26 },
    { x: new Date(2012, 1, 3), y: 38 },
    { x: new Date(2012, 1, 5), y: 43 },
    { x: new Date(2012, 1, 7), y: 79 },
    { x: new Date(2012, 1, 11), y: 41 },
    { x: new Date(2012, 1, 13), y: 54 },
    { x: new Date(2012, 1, 20), y: 66 },
    { x: new Date(2012, 1, 21), y: 200 },
    { x: new Date(2012, 1, 25), y: 53 },
    { x: new Date(2012, 1, 27), y: 60 }
  ]

  initializeApp() {
    this.platform.ready().then(() => {
      this.getTweetAndSentiment();
      this.adjustGraphs();
    })
  }

  ngOnInit() {
    console.log("Modal Received, Company Name: ", this.navParams.data.companyName);
  }

  getTweetAndSentiment() {
    this.http.get("http://d295839e.ngrok.io/")
      .subscribe(
        (response) => {
          response = JSON.parse(response['_body']);
          console.log("Test Response: ", response);
          console.log("Negative: ", response['Negative'])
          console.log("Neutral: ", response['Neutral'])
          console.log("Positive: ", response['Positive'])
          this.tweets = response['Tweets']
          this.showAnalysisPieChart(response['Positive'], response['Neutral'], response['Negative']);
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

  // Gets data from Flask Server for plotting graphs
  adjustGraphs() {
    this.http.get("http://d295839e.ngrok.io/graphdetail")
      .subscribe(
        (response) => {
          response = JSON.parse(response['_body']);
          console.log("Graph DataSets: ", response);
          this.drawChart(response['Data']);
        },
        error => {
          alert("Error While Getting")
        },
        () => {
          console.log("Graph Detail: API Call Completed");
        }
      )
  }

  // dataArray: array of array[date, stockPrice]
  drawChart(dataArray) {
    console.log("In DrawChart: ", dataArray);
    let data = []
    for (let i = 0; i < dataArray.length; i++) {
      let splittedDate = dataArray[i][0].split("/")
      // data.append({})
      console.log("Date: ", splittedDate, " Closing Price: ", dataArray[i][1])
    }

    var ctx = (<any>document.getElementById('canvas-stockgraph')).getContext('2d');
    var chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: "Stock Price",
            data: this.dataPoints,
            fill: false,
            borderColor: 'red'
          }
        ]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: "Stock Graph: Date VS Closing Price"
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: "Closing Price"
            }
          }],
          xAxes: [{
            type: "time",
            time: {
              format: 'DD/MM/YYYY',
              tooltipFormat: 'll'
            },
            scaleLabel: {
              display: true,
              labelString: 'Date'
            }
          }]
        }
      }
    })
  }

  showAnalysisPieChart(positive, neutral, negative) {
    var ctx = (<any>document.getElementById('canvas-chart')).getContext('2d');
    var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'pie',

      // The data for our dataset
      data: {
        labels: ["Negative", "Neutral", "Positive",],
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
          data: [positive, neutral, negative],
          borderWidth: 2
        }]
      }
    });
  }

  closeModal() {
    this.modalController.dismiss()
  }
}
