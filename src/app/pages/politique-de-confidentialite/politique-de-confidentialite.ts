import { AfterViewInit, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterLink, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-politique-de-confidentialite',
  standalone: true, 
  imports: [RouterModule, RouterLink],
  templateUrl: './politique-de-confidentialite.html',
  styleUrl: './politique-de-confidentialite.css'
})
export class PolitiqueDeConfidentialite implements AfterViewInit {
  constructor(private route: ActivatedRoute) {}

  ngAfterViewInit() {
    this.route.fragment.subscribe((frag) => {
      if (!frag) return;
      // scroll manuel fiable même si la page a un conteneur scroll
      const el = document.getElementById(frag);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}
