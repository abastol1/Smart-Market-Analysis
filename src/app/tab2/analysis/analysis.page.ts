import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, Platform } from '@ionic/angular';
import { Chart } from 'chart.js'
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
  public dataPoints = []
  public dateToday= new Date().toDateString() + ", " + new Date().toLocaleTimeString();
  public currentStock = {
    'PRESENT_VALUE': '',
    'PRESENT_GROWTH': '',
    'OTHER_DETAILS': {
      'PREV_CLOSE': '',
      'OPEN': '',
      'ONE_YEAR_TARGET_PRICE': '',
      'DIVIDEND_AND_YIELD': '',
      'AVERAGE_VOLUME_3MONTH':'',
      'EPS_RATIO':'',
      'EX_DIVIDEND_DATE':'',
      'MARKET_CAP':'',
      'PE_RATIO':'',
      'TD_VOLUME':'',
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.getTweetAndSentiment();
      this.adjustGraphs();
      // this.getCurrentStockDetail();
    })
  }

  ngOnInit() {
    console.log("Modal Received, Company Name: ", this.navParams.data.companyName);
    this.companyName = this.navParams.data.companyName;
  }

  ionViewWillEnter(){
    let companySpecificUrl = "http://127.0.0.1:5000/" + "currentstock/" + this.companyName;

    this.http.get(companySpecificUrl)
    .subscribe(
      (response) => {
        response = JSON.parse(response['_body']);
        console.log("Current Stock Detail: ", response);
        this.currentStock = response;
      },
      error => {
        alert("Failed to get current stock");
      },
      () => {
        console.log("Successful while getting stock detail");
      }
    )
  }

  getCurrentStockDetail() {
    let companySpecificUrl = "http://127.0.0.1:5000/" + "currentstock/" + this.companyName;

    this.http.get(companySpecificUrl)
    .subscribe(
      (response) => {
        response = JSON.parse(response['_body']);
        console.log("Current Stock Detail: ", response);
        // this.currentStock = response;
      },
      error => {
        alert("Failed to get current stock");
      },
      () => {
        console.log("Successful while getting stock detail");
      }
    )
  }

  getTweetAndSentiment() {
    let companySpecificUrl = "http://127.0.0.1:5000/" + this.companyName;
    this.http.get(companySpecificUrl)
      .subscribe(
        (response) => {
          response = JSON.parse(response['_body']);
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

  cleanDateColumn(data){
    for ( let i = 0; i < data.length; i++){
      let splittedDate = data[i][0].split("/");
      let tempDate = new Date(splittedDate[2], splittedDate[0], splittedDate[1]);
      this.dataPoints.push({x: tempDate, y: data[i][1]});
    }
  }

  // Gets data from Flask Server for plotting graphs
  adjustGraphs() {
    let companySpecificUrl = "http://127.0.0.1:5000/graphdetail/" + this.companyName;
    this.http.get(companySpecificUrl)
      .subscribe(
        (response) => {
          response = JSON.parse(response['_body']);
          console.log("Graph DataSets: ", response);
          this.cleanDateColumn(response['Data']);
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
