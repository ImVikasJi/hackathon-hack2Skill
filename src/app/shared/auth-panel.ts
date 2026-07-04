import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-panel',
  imports: [RouterLink],
  templateUrl: './auth-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPanel {
  protected readonly highlights = [
    { icon: '🏛️', text: 'Attractions and hidden gems, curated by AI for your interests' },
    { icon: '📖', text: 'Immersive stories that bring each destination to life' },
    { icon: '🎉', text: 'Local events and authentic cultural experiences' },
  ];
}
