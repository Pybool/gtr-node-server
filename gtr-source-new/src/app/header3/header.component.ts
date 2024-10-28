import { Component, Renderer2 } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
const HOST = 'http://localhost:4200'//environment.HOST;

@Component({
  selector: 'app-header3',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class Header3Component {
  srcValues: any[];

  constructor(private renderer: Renderer2) {
    this.srcValues = [
      `https://code.jquery.com/jquery-3.7.1.min.js`,
      `${HOST}/assets/js/vendor/jquery-3.5.0.min.js`,
      `${HOST}/assets/js/popper.min.js`,
      `${HOST}/assets/js/isotope.pkgd.min.js`,
      `${HOST}/assets/js/imagesloaded.pkgd.min.js`,
      `${HOST}/assets/js/jquery.magnific-popup.min.js`,
      `${HOST}/assets/js/owl.carousel.min.js`,
      `${HOST}/assets/js/jquery.odometer.min.js`,
      `${HOST}/assets/js/bootstrap-datepicker.min.js`,
      `${HOST}/assets/js/jquery.appear.js`,
      `${HOST}/assets/js/js_jquery.knob.js`,
      `${HOST}/assets/js/slick.min.js`,
      `${HOST}/assets/js/ajax-form.js`,
      `${HOST}/assets/js/wow.min.js`,
      `${HOST}/assets/js/aos.js`,
      `${HOST}/assets/js/plugins.js`,
      `${HOST}/assets/js/app/common.js`,
    ];
  }

  loadScript(src: string) {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    this.renderer.appendChild(document.querySelector('#header-roots'), script);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const navs = document.querySelectorAll('.navigation') as any;
      if (navs) {
        if (navs.length >= 2) {
          // navs[1].remove(); 
        }
        console.log('Navs ', navs);
      }
      this.srcValues.map((script: string) => {
        this.loadScript(script);
      });
    }, 500);
  }
}
