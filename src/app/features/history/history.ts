import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DiscoveryService } from '../../core/discovery.service';
import { DiscoveryRecord } from '../../models/discovery.model';
import { Nav } from '../../shared/nav';

@Component({
  selector: 'app-history',
  imports: [Nav, DatePipe, RouterLink],
  templateUrl: './history.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class History {
  private readonly discoveryService = inject(DiscoveryService);

  readonly records = signal<DiscoveryRecord[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly expandedId = signal<string | null>(null);

  constructor() {
    this.load();
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      this.records.set(await this.discoveryService.listForCurrentUser());
    } catch {
      this.error.set('Could not load your history.');
    } finally {
      this.loading.set(false);
    }
  }

  toggle(id: string): void {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  async remove(id: string): Promise<void> {
    try {
      await this.discoveryService.remove(id);
      this.records.set(this.records().filter((r) => r.id !== id));
    } catch {
      this.error.set('Could not delete that entry.');
    }
  }
}
