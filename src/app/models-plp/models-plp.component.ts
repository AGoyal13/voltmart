import { Component } from '@angular/core';

type ProductImage = { src: string; alt: string };

type ProductVariant = {
  id: string;
  colorName: string;
  swatch?: string;
  images: ProductImage[];
};

type Product = {
  id: string;
  name: string;
  subtitle: string;
  type: string; // e.g. "Gig 2W" | "Fleet 2W"
  tags: string[];
  defaultVariantId?: string;
  variants: ProductVariant[];
  price: string;
};

type ModelTab = 'Vegh L25' | 'Reveal N1';

@Component({
  selector: 'app-models-plp',
  templateUrl: './models-plp.component.html',
  styleUrls: ['./models-plp.component.scss'],
})
export class ModelsPlpComponent {
  // WhatsApp
  private waNumber = '919999890245';
  enquiryNote = '';

  activeType: ModelTab = 'Vegh L25';

  // Carousel index per product+variant
  private indices: Record<string, number> = {};
  private touchStartX: Record<string, number> = {};

  products: Product[] = [
    {
      id: 'vegh',
      name: 'Vegh L25',
      subtitle: 'Compact EV built for daily gig commutes',
      type: 'Gig 2W',
      tags: ['Speed - 25 Kmph (low speed)', 'Range - 120 km', 'Registration and License - Not Required'],
      defaultVariantId: 'vegh-01',
      price: "₹60,000",
      variants: [
        { id: 'vegh-01', swatch: '#ffffff', colorName: 'White', images: [{ src: 'assets/models/vegh_white.jpeg', alt: 'VEGH Color White' }] },
        { id: 'vegh-02', swatch: '#81864A', colorName: 'Olive Green', images: [{ src: 'assets/models/vegh_green.jpeg', alt: 'VEGH Color Olive Green' }] },
        { id: 'vegh-03', swatch: '#D2042D', colorName: 'Red', images: [{ src: 'assets/models/vegh_red.jpeg', alt: 'VEGH Color Red' }] },
        { id: 'vegh-04', swatch: '#111827', colorName: 'Black', images: [{ src: 'assets/models/vegh_black.jpeg', alt: 'VEGH Color Black' }] },
        { id: 'vegh-05', swatch: '#A9A9A9', colorName: 'Grey', images: [{ src: 'assets/models/vegh_grey.jpeg', alt: 'VEGH Color Grey' }] },
      ],
    },
    {
      id: 'reveal',
      name: 'REVEAL N1',
      subtitle: 'Purpose-built EV with high speed',
      type: 'Fleet 2W',
      tags: ['Speed - upto 60 Kmph (high speed)', 'Range - 120 km', 'Registration and License - Required'],
      defaultVariantId: 'reveal-white',
      price: "₹80,000",
      variants: [
        {
          id: 'reveal-white',
          colorName: 'White',
          swatch: '#ffffff',
          images: [
            { src: 'assets/models/reveal06_white.jpeg', alt: 'REVEAL White angle 6' },
            { src: 'assets/models/reveal04_white.jpeg', alt: 'REVEAL White angle 4' },
            { src: 'assets/models/reveal05_white.jpeg', alt: 'REVEAL White angle 5' },
            { src: 'assets/models/reveal02_white.jpeg', alt: 'REVEAL White angle 2' },
            { src: 'assets/models/reveal03_white.jpeg', alt: 'REVEAL White angle 3' },
            { src: 'assets/models/reveal01_white.jpeg', alt: 'REVEAL White angle 1' },
          ],
        },
        {
          id: 'reveal-yellow',
          colorName: 'Yellow',
          swatch: '#ffe990',
          images: [
            { src: 'assets/models/reveal03_yellow.jpeg', alt: 'REVEAL Yellow angle 3' },
            { src: 'assets/models/reveal02_yellow.jpeg', alt: 'REVEAL Yellow angle 2' },
            { src: 'assets/models/reveal04_yellow.jpeg', alt: 'REVEAL Yellow angle 4' },
            { src: 'assets/models/reveal01_yellow.jpeg', alt: 'REVEAL Yellow angle 1' },
            { src: 'assets/models/reveal05_yellow.jpeg', alt: 'REVEAL Yellow angle 5' },
            { src: 'assets/models/reveal06_yellow.jpeg', alt: 'REVEAL Yellow angle 6' },
          ],
        },
      ],
    },
  ];

  // ---------- Tab mapping (old tabs -> new product ids) ----------
  private tabToProductId(tab: ModelTab): string {
    return tab === 'Vegh L25' ? 'vegh' : 'reveal';
  }

  get activeProduct(): Product | undefined {
    const id = this.tabToProductId(this.activeType);
    return this.products.find(p => p.id === id);
  }

  setType(type: ModelTab) {
    this.activeType = type;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---------- Carousel helpers ----------
  private key(productId: string, variantId: string) {
    return `${productId}__${variantId}`;
  }

  getIndex(productId: string, variantId: string): number {
    return this.indices[this.key(productId, variantId)] ?? 0;
  }

  setImage(productId: string, variantId: string, index: number) {
    this.indices[this.key(productId, variantId)] = index;
  }

  nextImage(productId: string, variantId: string, total: number) {
    const k = this.key(productId, variantId);
    const current = this.indices[k] ?? 0;
    this.indices[k] = (current + 1) % total;
  }

  prevImage(productId: string, variantId: string, total: number) {
    const k = this.key(productId, variantId);
    const current = this.indices[k] ?? 0;
    this.indices[k] = (current - 1 + total) % total;
  }

  onTouchStart(e: TouchEvent, productId: string, variantId: string) {
    this.touchStartX[this.key(productId, variantId)] = e.touches[0].clientX;
  }

  onTouchEnd(e: TouchEvent, productId: string, variantId: string, total: number) {
    if (total <= 1) return;

    const k = this.key(productId, variantId);
    const startX = this.touchStartX[k] ?? 0;
    const endX = e.changedTouches[0].clientX;
    const delta = endX - startX;

    if (Math.abs(delta) < 35) return;
    if (delta < 0) this.nextImage(productId, variantId, total);
    else this.prevImage(productId, variantId, total);
  }

  // ---------- WhatsApp enquiry ----------
  enquireOnWhatsapp(product: Product) {
    const text = `Voltmart enquiry (Models):
      Model: ${product.name}
      Subtitle: ${product.subtitle}
      Type: ${product.type}`;

    window.open(
      `https://wa.me/${this.waNumber}?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  }
}
