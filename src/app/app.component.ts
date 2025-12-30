import { Component } from '@angular/core';
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
}
