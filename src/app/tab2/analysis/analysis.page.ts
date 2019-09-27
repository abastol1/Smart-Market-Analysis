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

  // Stores all the tweets,  used to dynamically update tweets
  public tweets = []
  // Stores dataPoints of stock detail, used to create chart
  public dataPoints = []

  // Predicted CLosing price
  public prediction : string
  
  // gets todays date 
  public dateToday= new Date().toDateString() + ", " + new Date().toLocaleTimeString();
  
  // Placeholder for current stock detail
  // used in html file for dynamic update of data
  public currentStock = {
    'PRESENT_VALUE': '',
    'PRESENT_GROWTH': '',
    'OTHER_DETAILS': {
      'PREV_CLOSE': '',
      'OPEN': '',
      'ONE_YEAR_TARGET_PRICE': '',
      'DIVIDEND_AND_YIELD': '',
    }
  }

  // Whenever the platform is completely loaded, this.platform.ready is fired
  initializeApp() {
    this.platform.ready().then(() => {
      // calls server function to get tweets and sentiment of tweets
      this.getTweetAndSentiment();
      // Creates graph by getting data from Flask Server
      this.adjustGraphs();
      // 
      this.getPredictionScore()
    })
  }

  // called when tab2 opens this modal
  ngOnInit() {
    console.log("Modal Received, Company Name: ", this.navParams.data.companyName);
    // companyName is passed from tab2
    this.companyName = this.navParams.data.companyName;
  }

  /**/
  /*
  ionViewWillEnter()

  NAME

          ionViewWillEnter()- processes new opens for this model.

  SYNOPSIS

          ionViewWillEnter()

  DESCRIPTION

          Fired when entering a page, after it becomes the active page. This function
          updates current stock data before the view comes live. It gets companyName
          from tab2 amnd calls the Server by passing url to get new stock data of the
          company. 
          
          Updating the detail of current stock, this update is reflected in html page as well

  RETURNS

          NaN. Only updates stock data by calling api

  AUTHOR

          Anuj Bastola

  DATE

          02:27pm 9/10/2019

  */
  /**/

  ionViewWillEnter(){
    let companySpecificUrl = "http://127.0.0.1:5000/" + "currentstock/" + this.companyName;

    this.http.get(companySpecificUrl)
    .subscribe(
      (response) => {
        // Parsing the response from server, response is usally str
        response = JSON.parse(response['_body']);
        console.log("Current Stock Detail: ", response);
        // Updating the detail of current stock, this update is reflected in html page as well
        this.currentStock['PRESENT_VALUE'] = response['PRESENT_VALUE'];
        this.currentStock['PRESENT_GROWTH'] = response['PRESENT_GROWTH'];
        this.currentStock['OTHER_DETAILS']['OPEN'] = response['priceDetails']['OPEN'];
        this.currentStock['OTHER_DETAILS']['ONE_YEAR_TARGET_PRICE'] = response['priceDetails']['ONE_YEAR_TARGET_PRICE'];
        this.currentStock['OTHER_DETAILS']['DIVIDEND_AND_YIELD'] = response['priceDetails']['DIVIDEND_AND_YIELD'];
        this.currentStock['OTHER_DETAILS']['PREV_CLOSE'] = response['priceDetails']['PREV_CLOSE'];
      },
      // Called when API call fails
      error => {
        alert("Failed to get current stock");
      },
      // called when api call is completed
      () => {
        console.log("Successful while getting stock detail");
      }
    )
  }

  /**/
  /*
  getTweetAndSentiment

  NAME

          getTweetAndSentiment: Gets sentiment data of tweet, gets tweet related to 
                                a company and displays the sentiment score data
                                in a pie chart

  SYNOPSIS

          getTweetAndSentiment()

  DESCRIPTION

          This function will attempt to get tweets and sentiment of those tweets
          related to a company and calls 'showAnalysisPieChart' which creates a 
          pie chart of result received from server. This function will get comapnyName
          from tab2 when a company card is clicked.

          Updates the tweets pubic class variable. In case of API Failed, it then 
          shows a alert box saying that the API called failed.

  RETURNS

          Returns nothing.

  AUTHOR

          Anuj Bastola

  DATE

          02:48pm 9/10/2019

  */
  /**/
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

  /**/
  /*
  cleanDateColumn

  NAME

          cleanDateColum: Cleaning date

  SYNOPSIS

          cleanDateColumn(data)
              data: Array of arrays with first element, Date 
              and second element Closing Stock Price

  DESCRIPTION

          This function iterates over a cleanDateColumn. Splits the date(first element) 
          by '/' wildcard and stores it on splittedDate. Creates a new Date() object by 
          passing month, day, and year(used from drawing charts). updates dataPoints with
          x as date object and y as closing price(used for date vs closing price chart)


  RETURNS

          Nothing

  AUTHOR

          Anuj Bastola

  DATE

          3:27pm 9/10/2019

  */
  /**/  
  cleanDateColumn(data){
    for ( let i = 0; i < data.length; i++){
      let splittedDate = data[i][0].split("/");
      let tempDate = new Date(splittedDate[2], splittedDate[0], splittedDate[1]);
      this.dataPoints.push({x: tempDate, y: data[i][1]});
    }
  }

  
  /**/
  /*
  adjustGraphs

  NAME

          adjustGraphs: Calls Server to get data, calls cleanDateColumn to prepare
                        data for chart, calls drawChart() to draw chart

  SYNOPSIS

          adjustGraphs()

  DESCRIPTION

          This function will call server, the server then return data['Date', 'Close']
          from company's historical data. Gets data as response, parses str response
          to JSON, calls cleanDateColumn, and finally calls drawChart()

  RETURNS

          Nothing

  AUTHOR

          Anuj

  DATE

          3:58pm 9/10/2019

  */
  /**/
  adjustGraphs() {
    let companySpecificUrl = "http://127.0.0.1:5000/graphdetail/" + this.companyName;
    this.http.get(companySpecificUrl)
      .subscribe(
        (response) => {
          response = JSON.parse(response['_body']);
          console.log("Graph DataSets: ", response);
          this.cleanDateColumn(response['Data']);
          this.drawChart();
        },
        error => {
          alert("Error While Getting")
        },
        () => {
          console.log("Graph Detail: API Call Completed");
        }
      )
  }


  getPredictionScore() {
    let companySpecificUrl = "http://127.0.0.1:5000/prediction/" + this.companyName;
    this.http.get(companySpecificUrl)
      .subscribe(
        (response) => {
          response = JSON.parse(response['_body']);
          console.log("Prediction Price: ", response['prediction']);
          this.prediction = (parseFloat(response['prediction'])).toFixed(2)
        },
        error => {
          alert("Error While Getting")
        },
        () => {
          console.log("Graph Detail: API Call Completed");
        }
      )
  }

  /**/
  /*
  drawChart

  NAME

          drawChart: Gets canvas element from html and draws a chart of
                      date vs stock graph

  SYNOPSIS

          drawChart()

  DESCRIPTION

          Gets canvas element by id. Creates a new instance od chart. Specifies labels
          for axes. Passes 'this.datapoints' as a dataset for the graph. Also specifies 
          format for Date axes

  RETURNS

          Nothing

  AUTHOR

          Anuj

  DATE

          3:58pm 9/10/2019

  */
  /**/
  drawChart() {

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

  /**/
  /*
  showAnalysisPieChart

  NAME

          drawChart: Gets canvas element from html and draws a pie chart 
                      with three categories(neutral, positive, negative)

  SYNOPSIS

          showAnalysisPieChart()
                positive: % of positive tweets
                neutral: % of neutral tweets
                negative: % of negative tweets

  DESCRIPTION

          Gets canvas element by id. Creates a new instance od chart. Specifies labels
          for the three categories. Specifies [positive, negative, neutral] as data for
          the pie-chart

  RETURNS

          Nothing

  AUTHOR

          Anuj

  DATE

          4:47pm 9/10/2019

  */
  /**/
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
