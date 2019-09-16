import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor() {}

  public names = {
    "Google" : ["Technology company", "https://seomofo.com/wp-content/uploads/2018/09/new-google-logo-knockoff1.png"],
    "Jefferies" : ["Investment banking company", "https://master.ctaexpo.com/wp-content/uploads/sites/2/cta-logo19.png"],
    "Facebook" : ["Social network company", "http://navamassages.com/wp-content/uploads/2018/11/50-Best-Facebook-Logo-Icons-GIF-Transparent-PNG-Images-12.png"],
    "Amazon" : ["E-commerce company", "https://www.fourjay.org/myphoto/f/127/1270472_amazon-logo-png-transparent-background.png"],
    "IBM" : ["Computer hardware company", "https://www.impactoneducation.org/wp-content/uploads/2018/06/ibm-logo-png-transparent-background.png"],
    "HP" : ["Software company", "https://www.pngkey.com/png/detail/74-748780_hp-logo-png-corporate-welln-hewlett-packard-current.png"],
    "Apple" : ["Technology company", "https://amplab.cs.berkeley.edu/wp-content/uploads/2015/07/logo-apple.png"],
    "Samsung" : ["Multinational conglomerate company", "http://pluspng.com/img-png/samsung-logo-png-samsung-logo-png-2104.png"],
    "Tesla": ["Automotive company", "https://pngimg.com/uploads/tesla_logo/tesla_logo_PNG21.png"],
    "Walmart": ["Retail company", "https://www.edcast.com/corp/wp-content/uploads/2016/11/Walmart-Logo-PNG-Transparent.png"],
    "JP Morghan & Chase": ["Investment banking company", "https://www.actaturcica.com/wp-content/uploads/2018/06/JPMorgan-Chase-Logo-PNG-Transparent.png"],
    "Microsoft": ["Technology company", "https://www.freepnglogos.com/uploads/microsoft-logo-hd-26.png"]
  }
}
