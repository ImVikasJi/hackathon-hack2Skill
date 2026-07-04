import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { AuthPanel } from '../../../shared/auth-panel';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink, AuthPanel],
  templateUrl: './signup.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Signup {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly email = signal('');
  readonly password = signal('');
  readonly error = signal<string | null>(null);
  readonly submitting = signal(false);
  readonly googleSubmitting = signal(false);

  async submit(): Promise<void> {
    if (!this.email() || this.password().length < 6) {
      this.error.set('Enter a valid email and a password of at least 6 characters.');
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    const errorMessage = await this.auth.signUp(this.email(), this.password());

    this.submitting.set(false);

    if (errorMessage) {
      this.error.set(errorMessage);
      return;
    }

    this.router.navigate(['/verify-email'], { queryParams: { email: this.email() } });
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
