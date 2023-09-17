import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-logo-with-title',
  templateUrl: './logo-with-title.component.html',
  styleUrls: ['./logo-with-title.component.scss'],
})
export class LogoWithTitleComponent {
  @Input() title: string = 'Title not specified for this page';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  goBackToLobby() {
    this.router.navigate([''], { relativeTo: this.route });
  }
}
