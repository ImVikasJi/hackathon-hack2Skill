import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { DiscoveryRecord, DiscoveryResult } from '../models/discovery.model';

interface DiscoveryRow {
  id: string;
  user_id: string;
  destination: string;
  interests: string;
  result: DiscoveryResult;
  created_at: string;
}

function toRecord(row: DiscoveryRow): DiscoveryRecord {
  return {
    id: row.id,
    userId: row.user_id,
    destination: row.destination,
    interests: row.interests,
    result: row.result,
    createdAt: row.created_at,
  };
}

@Injectable({ providedIn: 'root' })
export class DiscoveryService {
  private readonly supabase = inject(SupabaseService);
  private readonly auth = inject(AuthService);

  async save(destination: string, interests: string, result: DiscoveryResult): Promise<void> {
    const userId = this.auth.user()?.id;
    if (!userId) {
      throw new Error('Must be signed in to save a discovery');
    }

    const { error } = await this.supabase.client.from('discoveries').insert({
      user_id: userId,
      destination,
      interests,
      result,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async listForCurrentUser(): Promise<DiscoveryRecord[]> {
    const { data, error } = await this.supabase.client
      .from('discoveries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data as DiscoveryRow[]).map(toRecord);
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase.client.from('discoveries').delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  }
}
