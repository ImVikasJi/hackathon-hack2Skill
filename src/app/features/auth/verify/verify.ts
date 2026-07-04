import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { AuthPanel } from '../../../shared/auth-panel';

@Component({
  selector: 'app-verify',
  imports: [RouterLink, AuthPanel],
  templateUrl: './verify.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Verify {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  readonly email = signal(this.route.snapshot.queryParamMap.get('email') ?? '');
  readonly error = signal<string | null>(null);
  readonly resendState = signal<'idle' | 'sending' | 'sent'>('idle');

  async resend(): Promise<void> {
    if (!this.email()) {
      return;
    }

    this.resendState.set('sending');
    this.error.set(null);

    const errorMessage = await this.auth.resendConfirmationEmail(this.email());

    if (errorMessage) {
      this.error.set(errorMessage);
      this.resendState.set('idle');
      return;
    }

    this.resendState.set('sent');
  }
}
