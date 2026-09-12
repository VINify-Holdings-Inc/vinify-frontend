import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SessionService } from './session.service';

/**
 * Ends an authenticated session after a period of user inactivity, per the
 * InfoSec Policy's 15-minute idle timeout.
 *
 * The JWT itself is still valid for its full lifetime -- this governs the
 * browser session only, which is the layer the policy describes. Closing the
 * browser already ends the session, because the token lives in sessionStorage.
 */
export const IDLE_TIMEOUT_MS = 15 * 60 * 1000;

// Captured on the document in the capture phase so activity inside child
// components still counts, and registered outside Angular so that a mousemove
// does not trigger a change-detection cycle.
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

@Injectable({ providedIn: 'root' })
export class IdleTimeoutService implements OnDestroy {
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private routerSub: Subscription | null = null;
  private started = false;

  private readonly onActivity = (): void => this.restart();

  constructor(
    private zone: NgZone,
    private router: Router,
    private session: SessionService,
  ) {}

  start(): void {
    if (this.started) {
      return;
    }
    this.started = true;

    this.zone.runOutsideAngular(() => {
      ACTIVITY_EVENTS.forEach((event) =>
        document.addEventListener(event, this.onActivity, true),
      );
    });

    // A fresh login is a navigation, not necessarily a further user gesture, so
    // the timer also (re)starts on route changes -- otherwise a user who logs in
    // and then walks away would never have had a timer armed at all.
    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.restart());

    this.restart();
  }

  stop(): void {
    ACTIVITY_EVENTS.forEach((event) =>
      document.removeEventListener(event, this.onActivity, true),
    );
    this.routerSub?.unsubscribe();
    this.routerSub = null;
    this.clearTimer();
    this.started = false;
  }

  private restart(): void {
    this.clearTimer();

    if (!this.session.isLoggedIn()) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.timerId = setTimeout(
        () => this.zone.run(() => this.expire()),
        IDLE_TIMEOUT_MS,
      );
    });
  }

  private expire(): void {
    this.clearTimer();

    // Same teardown as the header's logout(), so an idle expiry and an explicit
    // logout leave the browser in an identical state.
    this.session.clearSession();
    localStorage.clear();
    this.router.navigate(['']);
  }

  private clearTimer(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
