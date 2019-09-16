import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {

  constructor(
    private http: HttpClient,
    private platform: Platform
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.getNews();
    });
  }

  public NewsDetails = [];

  getNews(){
    const newsAPIKey = "36f2795f98ae409a811da0ed34415039";
    const query = "Stock";
    let newsAPIUrl = "https://newsapi.org/v2/everything?q=" + query + "&apiKey=" + newsAPIKey;
    console.log("The newsAPIUrl is " + newsAPIUrl);
    this.http.get(newsAPIUrl)
      .subscribe(
        (response) => {
          for ( let i = 0; i < response['articles'].length; i++){
            let title = response['articles'][i]['title'];
            let description = response['articles'][i]['description'].split(".")[0];
            let sourceName = response['articles'][i]['source']['name'];
            let url = response['articles'][i]['url'];

            let news = [title, description, sourceName, url];
            this.NewsDetails.push(news);

          }
          console.log("Main Array News Details: ", this.NewsDetails);
        },
        error => {
          alert("Calling NewsApi Failed");
        },
        () => {
          alert("NewsAPI Call Completed");
        }
      )
  }
}
