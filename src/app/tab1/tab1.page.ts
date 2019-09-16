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

  getNews(){
    const newsAPIKey = "36f2795f98ae409a811da0ed34415039";
    const query = "Stock";
    let newsAPIUrl = "https://newsapi.org/v2/everything?q=" + query + "&apiKey=" + newsAPIKey;
    console.log("The newsAPIUrl is " + newsAPIUrl);
    this.http.get(newsAPIUrl)
      .subscribe(
        (response) => {
          let title = response['articles'][0]['title'];
          let description = response['articles'][0]['description'];
          let sourceName = response['articles'][0]['source']['name'];
          let url = response['articles'][0]['url'];
          console.log("Response is " , response);

          console.log("Length of news: ", response['articles'].length)
          console.log("Title: ", title);
          console.log("description: ", description.split(".")[0]);
          console.log("sourceName: ", sourceName);
          console.log("url: ", url);
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
