import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    // Email confirmation links land back on the site URL with the new
    // session in the hash. Once Supabase's client parses it, send the
    // now-authenticated user straight into the app instead of leaving them
    // on the public landing page.
    if (window.location.hash.includes('access_token')) {
      this.auth.readyPromise.then(() => {
        if (this.auth.isAuthenticated()) {
          this.router.navigateByUrl('/discover', { replaceUrl: true });
        }
      });
    }
  }
}
