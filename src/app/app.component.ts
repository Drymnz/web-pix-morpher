import { Component } from '@angular/core';
import { NavComponent } from './component/nav/nav.component';
import { FooterComponent } from "./component/footer/footer.component";
import { ScaleImgComponent } from "./component/scale-img/scale-img.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [NavComponent, FooterComponent, ScaleImgComponent]
})
export class AppComponent {

}
