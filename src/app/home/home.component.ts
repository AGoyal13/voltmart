import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(public router: Router) {}

  isMobileNavOpen = false;
  currentYear = new Date().getFullYear();
  enquiryData = {
    role: 'Logistics / fleet operator'
  };

  toggleMobileNav(): void {
    this.isMobileNavOpen = !this.isMobileNavOpen;
  }

  closeMobileNav(): void {
    this.isMobileNavOpen = false;
  }

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.closeMobileNav();
  }

  onSubmitEnquiry(form: NgForm): void {
    const { name, role, message } = form.value;

    const waNumber = '919999890245'; // no +, WhatsApp prefers countrycode + number
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
