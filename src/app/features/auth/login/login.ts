import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { AuthPanel } from '../../../shared/auth-panel';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, AuthPanel],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly email = signal('');
  readonly password = signal('');
  readonly error = signal<string | null>(null);
  readonly submitting = signal(false);
  readonly googleSubmitting = signal(false);

  async submit(): Promise<void> {
    if (!this.email() || !this.password()) {
      this.error.set('Please enter your email and password.');
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    const errorMessage = await this.auth.signIn(this.email(), this.password());

    this.submitting.set(false);

    if (errorMessage) {
      this.error.set(errorMessage);
      return;
    }

    this.router.navigateByUrl('/discover');
  }

  async continueWithGoogle(): Promise<void> {
    this.googleSubmitting.set(true);
    this.error.set(null);
    const errorMessage = await this.auth.signInWithGoogle();
    if (errorMessage) {
      this.error.set(errorMessage);
      this.googleSubmitting.set(false);
    }
  }
}
