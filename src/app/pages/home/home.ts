import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import emailjs from '@emailjs/browser';
import * as L from 'leaflet';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements AfterViewInit, OnDestroy {
  private map!: L.Map;
  private onResize = () => this.map && this.map.invalidateSize();

  private readonly address = {
    street: "14 place de l'église",
    city: "Creil",
    postalcode: "60100",
    country: "France",
  };

  // Envoi d'email via EmailJS
  sendEmail(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const statusEl = document.getElementById('form-status') as HTMLElement;
    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;

    if (statusEl) statusEl.innerText = '⏳ Envoi en cours…';
    if (submitBtn) submitBtn.disabled = true;

    // 1) Envoi au cabinet
    const pMessage = emailjs.sendForm(
      'service_zgie9ol',   // Service ID
      'template_fsm6iad',  // Template ID (cabinet)
      form,
      'M4IP2w36cO5j83Syo'  // Public Key
    );

    // 2) Accusé de réception au patient
    const pAccuse = emailjs.sendForm(
      'service_zgie9ol',
      'template_jzuo65r',  // Template ID (accusé patient)
      form,
      'M4IP2w36cO5j83Syo'
    );

    Promise.all([pMessage, pAccuse])
      .then(() => {
        if (statusEl) statusEl.innerText = '✅ Merci, votre message a bien été envoyé.';
        form.reset();
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        if (statusEl) statusEl.innerText = '❌ Une erreur est survenue. Merci de réessayer.';
      })
      .finally(() => {
        if (submitBtn) submitBtn.disabled = false;
        if (statusEl) setTimeout(() => (statusEl.innerText = ''), 5000);
      });
  }

  private async geocodeAddress(addr: typeof this.address) {
    const base = 'https://nominatim.openstreetmap.org/search';
    const url = `${base}?format=jsonv2&limit=1&countrycodes=fr&street=${encodeURIComponent(addr.street)}&city=${encodeURIComponent(addr.city)}&postalcode=${encodeURIComponent(addr.postalcode)}&country=${encodeURIComponent(addr.country)}&email=votre-email@exemple.com`;
    const res1 = await fetch(url, { headers: { 'Accept-Language': 'fr' } });
    let data = await res1.json();

    if (!Array.isArray(data) || data.length === 0) {
      const altStreet = addr.street.replace('é', 'e').replace('É', 'E'); // fallback simple
      const url2 = `${base}?format=jsonv2&limit=1&countrycodes=fr&street=${encodeURIComponent(altStreet)}&city=${encodeURIComponent(addr.city)}&postalcode=${encodeURIComponent(addr.postalcode)}&country=${encodeURIComponent(addr.country)}&email=votre-email@exemple.com`;
      const res2 = await fetch(url2, { headers: { 'Accept-Language': 'fr' } });
      data = await res2.json();
    }

    if (Array.isArray(data) && data.length > 0) {
      const { lat, lon, display_name } = data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon), label: display_name as string };
    }

    return { lat: 49.2583, lon: 2.4833, label: "Creil (approx.)" };
  }
  ngAfterViewInit(): void {
const svg = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="#2563eb" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m0 9.5A2.5 2.5 0 1 1 14.5 9A2.5 2.5 0 0 1 12 11.5"/>
      </svg>
    `);
    const svgIcon = L.icon({
      iconUrl: `data:image/svg+xml;utf8,${svg}`,
      iconSize:    [32, 32],
      iconAnchor:  [16, 32],
      popupAnchor: [0, -28],
      className:   ''
    });

    // Icône par défaut pour tous les marqueurs
    L.Marker.prototype.options.icon = svgIcon;

    this.map = L.map('map', { zoomControl: true }).setView([49.2583, 2.4833], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);
    this.geocodeAddress(this.address)
      .then(({ lat, lon, label }) => {
        const pos: L.LatLngExpression = [lat, lon];
        this.map.setView(pos, 18);
        L.marker(pos).addTo(this.map)
          .bindPopup(`<b>Cabinet Médical</b><br>${this.address.street}, ${this.address.postalcode} ${this.address.city}`)
          .openPopup();
      })
      .catch((err) => {
        console.error('Geocoding error:', err);
      })
      .finally(() => {
        requestAnimationFrame(() => this.map.invalidateSize(true));
        setTimeout(() => this.map.invalidateSize(true), 200);
        window.addEventListener('resize', this.onResize);
      });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
    this.map?.remove();
  }
}
