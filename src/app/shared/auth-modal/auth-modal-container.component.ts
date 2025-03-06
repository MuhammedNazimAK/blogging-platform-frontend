import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthModalService, ModalType } from '../../core/services/auth-modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-modal-container',
  templateUrl: './auth-modal-container.component.html',
  styleUrls: ['./auth-modal-container.component.css']
})
export class AuthModalContainerComponent implements OnInit, OnDestroy {
  isVisible = false;
  currentModal: ModalType = null;
  isAnimating = false;
  private subscription: Subscription = new Subscription();

  constructor(private authModalService: AuthModalService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.authModalService.modalVisible$.subscribe(type => {
        this.currentModal = type;
        this.isVisible = type !== null;
      })
    );

    this.subscription.add(
      this.authModalService.animating$.subscribe(status => {
        this.isAnimating = status;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  closeModal(): void {
    this.authModalService.closeModal();
  }

  switchToLogin(): void {
    this.authModalService.switchModal('login');
  }

  switchToSignup(): void {
    this.authModalService.switchModal('signup');
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}