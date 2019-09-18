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
      this.test();
    });
  }

  public serverData
  test(){
    this.http.get("http://127.0.0.1:5000/")
    .subscribe(
      (response) => {
        console.log("Test Response: " , response);
      },
      error => {
        alert("Calling Test Flask Call Failed");
        console.log("Error: ", error);
      },
      () => {
        alert("Test Flask Call Completed");
      }
    )
  }

  // stores array of news details, each news details contains [title, description, sourceName, URL]
  public NewsDetails = [];

  /* *********************************************************************
  Function Name: ionViewWillEnter
  Purpose: Fired when entering a page, before it becomes the active one. In this function, it is used to give style to drop-right ion-item
          Enable menu when logged in
  Parameters:
              
  Return Value:
  Local Variables:
              coll = Drop-right ion-item
              content = get sibling(class: Content) of the ion-item(Class: Collapsible)
  Algorithm:
              1) get all the Drop-right ion-item
              2) If content height is already max, collapse the list
              3) if content height is null, expand the list
  ********************************************************************* */

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
