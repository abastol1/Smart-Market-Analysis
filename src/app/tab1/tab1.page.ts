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

  /* *********************************************************************
  Function Name: getNews
  Purpose: Calls NEWS API to get latest news
  Parameters:
              none
  Return Value:
  Local Variables:
              newsAPIKEY: api key for NEWS API
              newsAPIURL: api url where get request is send
              response: received from API, stores all the information of news
              news: array that stores information of a particular news[Title, Description, SourceName, URL, IMG]
  Algorithm:
              1) send GET request to the NEWS API
              2) parse the response body to get information of News
              3) Get title, description, source, url and img for each news from Response
              4) Add title, description, source, url and img to a array
              5) push the array to NewsDetails
  ********************************************************************* */

  getNews(){
    const newsAPIKey = "36f2795f98ae409a811da0ed34415039";
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

            let title = response['articles'][i]['title'];
            let description = response['articles'][i]['description'].split(".")[0];
            let sourceName = response['articles'][i]['source']['name'];
            let url = response['articles'][i]['url'];
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
