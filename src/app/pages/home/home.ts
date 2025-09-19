import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import emailjs from '@emailjs/browser';
import * as L from 'leaflet';

// ⬇️ Import des icônes locales de Leaflet
// import marker2xUrl from 'leaflet/dist/images/marker-icon-2x.png';
// import markerUrl from 'leaflet/dist/images/marker-icon.png';
// import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements AfterViewInit, OnDestroy {
  private map!: L.Map;

  // ✅ Envoi d'email via EmailJS
  sendEmail(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const statusEl = document.getElementById('form-status') as HTMLElement;
    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;

    // UI: message "en cours" + désactiver bouton
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
        form.reset(); // Réinitialiser le formulaire
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        if (statusEl) statusEl.innerText = '❌ Une erreur est survenue. Merci de réessayer.';
      })
      .finally(() => {
        if (submitBtn) submitBtn.disabled = false;
        // Masquer le message après 5s
        if (statusEl) setTimeout(() => (statusEl.innerText = ''), 5000);
      });
  }

  private onResize = () => this.map && this.map.invalidateSize();

  // ✅ Initialisation Leaflet
  ngAfterViewInit(): void {
    L.Icon.Default.mergeOptions({
      iconUrl: 'assets/leaflet/marker-icon.png',
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
    });

    this.map = L.map('map', { zoomControl: true }).setView([49.2583, 2.4833], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    L.marker([49.2583, 2.4833])
      .addTo(this.map)
      .bindPopup("<b>Cabinet Médical</b><br>14 place de l'Église, 60100 Creil");

    requestAnimationFrame(() => this.map.invalidateSize(true));
    setTimeout(() => this.map.invalidateSize(true), 200);

    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
    this.map?.remove();
  }
}
