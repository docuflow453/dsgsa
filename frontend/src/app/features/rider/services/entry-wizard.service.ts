import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Competition, CompetitionClass, CompetitionExtra, EntryWizardState } from '../models/rider.model';

/**
 * Entry Wizard Service - Manages state across wizard steps
 */
@Injectable({
  providedIn: 'root'
})
export class EntryWizardService {
  private initialState: EntryWizardState = {
    isCurrentUserRider: true,
    selectedClasses: [],
    selectedExtras: [],
    totalAmount: 0
  };

  private wizardState = new BehaviorSubject<EntryWizardState>(this.initialState);
  public wizardState$ = this.wizardState.asObservable();

  constructor() {}

  /**
   * Get current wizard state
   */
  getState(): EntryWizardState {
    return this.wizardState.value;
  }

  /**
   * Set competition
   */
  setCompetition(competition: Competition): void {
    this.wizardState.next({
      ...this.wizardState.value,
      competition
    });
  }

  /**
   * Set rider
   */
  setRider(riderId: string, riderName: string, isCurrentUser: boolean): void {
    this.wizardState.next({
      ...this.wizardState.value,
      riderId,
      riderName,
      isCurrentUserRider: isCurrentUser
    });
  }

  /**
   * Set horse
   */
  setHorse(horseId: string, horseName: string): void {
    this.wizardState.next({
      ...this.wizardState.value,
      horseId,
      horseName
    });
  }

  /**
   * Set selected classes
   */
  setSelectedClasses(classes: CompetitionClass[]): void {
    const totalAmount = this.calculateTotal(classes, this.wizardState.value.selectedExtras);
    this.wizardState.next({
      ...this.wizardState.value,
      selectedClasses: classes,
      totalAmount
    });
  }

  /**
   * Set selected extras
   */
  setSelectedExtras(extras: { extra: CompetitionExtra; quantity: number }[]): void {
    const totalAmount = this.calculateTotal(this.wizardState.value.selectedClasses, extras);
    this.wizardState.next({
      ...this.wizardState.value,
      selectedExtras: extras,
      totalAmount
    });
  }

  /**
   * Calculate total amount
   */
  private calculateTotal(
    classes: CompetitionClass[],
    extras: { extra: CompetitionExtra; quantity: number }[]
  ): number {
    const classesTotal = classes.reduce((sum, cls) => sum + cls.fee, 0);
    const extrasTotal = extras.reduce((sum, item) => sum + (item.extra.price * item.quantity), 0);
    return classesTotal + extrasTotal;
  }

  /**
   * Reset wizard state
   */
  reset(): void {
    this.wizardState.next(this.initialState);
  }

  /**
   * Check if wizard can proceed to extras step
   */
  canProceedToExtras(): boolean {
    const state = this.wizardState.value;
    return !!(
      state.competition &&
      state.riderId &&
      state.horseId &&
      state.selectedClasses.length > 0
    );
  }

  /**
   * Check if wizard can proceed to checkout
   */
  canProceedToCheckout(): boolean {
    return this.canProceedToExtras();
  }
}

