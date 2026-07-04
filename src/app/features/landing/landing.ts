import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing {
  protected readonly auth = inject(AuthService);

  protected readonly features: Feature[] = [
    {
      icon: '🏛️',
      title: 'Must-see attractions',
      description: 'Curated, AI-recommended landmarks tailored to what you actually care about.',
    },
    {
      icon: '💎',
      title: 'Hidden gems',
      description: 'Authentic, lesser-known spots most tourists never find.',
    },
    {
      icon: '📖',
      title: 'Immersive storytelling',
      description: 'A vivid narrative that transports you into the destination before you even arrive.',
    },
    {
      icon: '🏺',
      title: 'Heritage & history',
      description: 'Understand the cultural and historical roots of every place you explore.',
    },
    {
      icon: '🎉',
      title: 'Local events',
      description: 'Festivals and seasonal happenings, with the best time to experience them.',
    },
    {
      icon: '🤝',
      title: 'Cultural experiences',
      description: 'Authentic traditions, food and craft — with etiquette tips to engage respectfully.',
    },
  ];
}
