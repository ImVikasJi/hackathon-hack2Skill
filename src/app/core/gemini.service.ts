import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { DiscoveryResult } from '../models/discovery.model';

@Injectable({ providedIn: 'root' })
export class GeminiService {
  private readonly supabase = inject(SupabaseService);

  async discover(destination: string, interests: string): Promise<DiscoveryResult> {
    const { data, error } = await this.supabase.client.functions.invoke<DiscoveryResult>(
      'discover',
      { body: { destination, interests } },
    );

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('No discovery data returned');
    }

    return data;
  }
}
