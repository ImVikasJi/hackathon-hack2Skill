import { Injectable, computed, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AppUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService);

  private readonly currentUser = signal<AppUser | null>(null);
  private readonly initialized = signal(false);

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly ready = this.initialized.asReadonly();
  readonly readyPromise: Promise<void>;

  constructor() {
    this.readyPromise = this.supabase.client.auth.getSession().then(({ data }) => {
      this.setUserFromSession(data.session?.user ?? null);
      this.initialized.set(true);
    });

    this.supabase.client.auth.onAuthStateChange((_event, session) => {
      this.setUserFromSession(session?.user ?? null);
    });
  }

  private setUserFromSession(user: { id: string; email?: string } | null): void {
    this.currentUser.set(user ? { id: user.id, email: user.email ?? '' } : null);
  }

  async signUp(email: string, password: string): Promise<string | null> {
    const { error } = await this.supabase.client.auth.signUp({ email, password });
    return error?.message ?? null;
  }

  async signIn(email: string, password: string): Promise<string | null> {
    const { error } = await this.supabase.client.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  }

  async signInWithGoogle(): Promise<string | null> {
    const { error } = await this.supabase.client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/discover` },
    });
    return error?.message ?? null;
  }

  async resendConfirmationEmail(email: string): Promise<string | null> {
    const { error } = await this.supabase.client.auth.resend({ type: 'signup', email });
    return error?.message ?? null;
  }

  async signOut(): Promise<void> {
    await this.supabase.client.auth.signOut();
  }
}
