import { Component } from '@angular/core';
import { Http } from '@angular/http'


import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {

  constructor(
    private http: Http,
    private platform: Platform
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.getNews();
    });
  }

  public serverData

  // stores array of news details, each news details contains [title, description, sourceName, URL]
  public NewsDetails = [];


  /**/
  /*
  getNews

  NAME

          getNews: Calls News API and extract necessary information from response
                    to display in the mobile app

  SYNOPSIS

          getNews()
                
  DESCRIPTION
          newsAPIKEY: api key for NEWS API
          newsAPIURL: api url where get request is send
          response: received from API, stores all the information of news
          news: array that stores information of a particular news[Title, Description, SourceName, URL, IMG]
          
          1) Sends GET request to the NEWS API
          2) Parse the response body to get information of News
          3) Gets title, description, source, url and img for each news from Response
          4) Adds title, description, source, url and img to a array
          5) Pushes the array to NewsDetails

  RETURNS

          none

  AUTHOR

          Anuj

  DATE

          4:47pm 9/11/2019

  */
  /**/

  getNews(){
    // API Key for NEWS API
    const newsAPIKey = "36f2795f98ae409a811da0ed34415039";
    // query to search for news
    // in our case, we are searching for news related to stock
    const query = "Stock";
    let newsAPIUrl = "https://newsapi.org/v2/everything?q=" + query + "&apiKey=" + newsAPIKey;
    
    console.log("The newsAPIUrl is " + newsAPIUrl);
    this.http.get(newsAPIUrl)
      .subscribe(
        (response) => {
          // response['_body'] stores all information as a string
          response = JSON.parse(response['_body']);
          console.log("Response: ", response['_body']);
          // loop over each news and get Details
          for ( let i = 0; i < response['articles'].length; i++){

            // Title of a news
            let title = response['articles'][i]['title'];
            // Description of a news
            let description = response['articles'][i]['description'].split(".")[0];
            // source of the news
            let sourceName = response['articles'][i]['source']['name'];
            // url of the original source, once user clicks on a news, they are redirected 
            // to the original source
            let url = response['articles'][i]['url'];
            // Image of the news, displayed on the mobile app
            let img = response['articles'][i]['urlToImage'];
            let news = [title, description, sourceName, url, img];
            this.NewsDetails.push(news);
          }
          console.log("Main Array News Details: ", this.NewsDetails);
        },
        error => {
          alert("Calling NewsApi Failed");
          console.log("Error NEWS API: ", error);
        },
        () => {
          alert("NewsAPI Call Completed");
        }
      )
  }
}
