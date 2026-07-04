import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../core/gemini.service';
import { DiscoveryService } from '../../core/discovery.service';
import { AuthService } from '../../core/auth.service';
import { DiscoveryResult } from '../../models/discovery.model';
import { Nav } from '../../shared/nav';

@Component({
  selector: 'app-discover',
  imports: [FormsModule, Nav],
  templateUrl: './discover.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Discover {
  private readonly gemini = inject(GeminiService);
  private readonly discoveryService = inject(DiscoveryService);
  protected readonly auth = inject(AuthService);

  readonly destination = signal('');
  readonly interests = signal('');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly result = signal<DiscoveryResult | null>(null);
  readonly saveState = signal<'idle' | 'saving' | 'saved' | 'error'>('idle');

  async explore(): Promise<void> {
    const destination = this.destination().trim();
    if (!destination) {
      this.error.set('Tell us where you want to explore.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);
    this.saveState.set('idle');

    try {
      const result = await this.gemini.discover(destination, this.interests().trim());
      this.result.set(result);
    } catch {
      this.error.set('Something went wrong generating your discovery. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  async saveToHistory(): Promise<void> {
    const result = this.result();
    if (!result) {
      return;
    }

    this.saveState.set('saving');
    try {
      await this.discoveryService.save(result.destination, this.interests().trim(), result);
      this.saveState.set('saved');
    } catch {
      this.saveState.set('error');
    }
  }
}
