import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ModalType = 'login' | 'signup' | null;

@Injectable({
  providedIn: 'root'
})
export class AuthModalService {
  private modalVisibleSource = new BehaviorSubject<ModalType>(null);
  modalVisible$ = this.modalVisibleSource.asObservable();
  
  private animatingSource = new BehaviorSubject<boolean>(false);
  animating$ = this.animatingSource.asObservable();

  constructor() {}

  openModal(type: ModalType): void {
    this.modalVisibleSource.next(type);
  }

  closeModal(): void {
    this.setAnimating(true);
    setTimeout(() => {
      this.modalVisibleSource.next(null);
      this.setAnimating(false);
    }, 300); 
  }

  switchModal(type: ModalType): void {
    this.setAnimating(true);
    setTimeout(() => {
      this.modalVisibleSource.next(type);
      this.setAnimating(false);
    }, 300); // Match this with CSS transition duration
  }

  setAnimating(status: boolean): void {
    this.animatingSource.next(status);
  }
}