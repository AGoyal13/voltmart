import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isMobileNavOpen = false;
  currentYear = new Date().getFullYear();
  enquiryData = { role: 'Logistics / fleet operator' };
  isLegalModalOpen = false;
  legalModalView: 'menu' | 'shipping' | 'privacy' | 'refund' = 'menu';
  lastFocusedElementBeforeModal: HTMLElement | null = null;
  // Use this map for readable titles in the modal header
  legalModalViewTitleMap: { [k: string]: string } = {
    menu: 'Legal',
    shipping: 'Shipping, Delivery Terms & Conditions',
    privacy: 'Privacy Policy',
    refund: 'Refund & Cancellation Policy',
  };

  @ViewChild('legalModalRoot', { static: false }) legalModalRoot?: ElementRef<HTMLDivElement>;

  constructor(private router: Router) {}

  toggleMobileNav(): void {
    this.isMobileNavOpen = !this.isMobileNavOpen;
  }

  closeMobileNav(): void {
    this.isMobileNavOpen = false;
  }

  /** If already on home, just scroll. If on another route, navigate to home then scroll */
  scrollToHomeSection(id: string, event?: Event): void {
    event?.preventDefault();
    this.closeMobileNav();

    if (this.router.url !== '/') {
      this.router.navigateByUrl('/').then(() => {
        setTimeout(() => this.scrollTo(id), 0);
      });
      return;
    }

    this.scrollTo(id);
  }

  goHomeAndScrollTop(event?: Event): void {
    event?.preventDefault();
    this.scrollToHomeSection('page-top');
  }

  private scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onSubmitEnquiry(form: NgForm): void {
    const { name, role, message } = form.value;
    const waNumber = '919999890245';

    const text = `New Voltmart enquiry:
      Name: ${name || '-'}
      Profile: ${role || '-'}
      Message: ${message || '-'}`;

    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/${waNumber}?text=${encodedText}`;

    window.open(url, '_blank'); // opens WhatsApp Web / app

    // Optional: reset form after opening WhatsApp
    // form.reset();
  }

  openLegalModal(event?: Event): void {
    event?.preventDefault();
    // remember current focus to restore later
    this.lastFocusedElementBeforeModal = document.activeElement as HTMLElement | null;
    this.legalModalView = 'menu';
    this.isLegalModalOpen = true;

    // wait a tick and focus modal root for keyboard user
    setTimeout(() => {
      this.legalModalRoot?.nativeElement?.focus();
    }, 0);

    // disable page scrolling (simple approach)
    document.body.style.overflow = 'hidden';
  }

  closeLegalModal(): void {
    this.isLegalModalOpen = false;
    this.legalModalView = 'menu';
    document.body.style.overflow = '';

    // restore focus
    if (this.lastFocusedElementBeforeModal) {
      try {
        this.lastFocusedElementBeforeModal.focus();
      } catch (e) {
        // ignore
      }
    }
  }

  openLegalContent(view: 'shipping' | 'privacy' | 'refund'): void {
    this.legalModalView = view;
    // optionally focus content area
    setTimeout(() => {
      const firstButton = this.legalModalRoot?.nativeElement.querySelector('.btn-back') as HTMLElement;
      firstButton?.focus();
    }, 0);
  }

  goBackInLegalModal(): void {
    this.legalModalView = 'menu';
    setTimeout(() => {
      // focus first link in menu
      const firstMenuBtn = this.legalModalRoot?.nativeElement.querySelector('.legal-menu-list button') as HTMLElement;
      firstMenuBtn?.focus();
    }, 0);
  }

  onLegalModalKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeLegalModal();
      return;
    }

    // optional: trap focus inside modal (basic)
    if (event.key === 'Tab' && this.isLegalModalOpen) {
      const root = this.legalModalRoot?.nativeElement;
      if (!root) return;
      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length));
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    }
  }
}
