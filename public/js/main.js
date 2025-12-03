document.addEventListener('DOMContentLoaded', () => {
  // Services page CTA buttons → jump to contact with selected service
  const enquireButtons = document.querySelectorAll('.js-service-enquire');
  enquireButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const service = btn.getAttribute('data-service') || '';
      const contactUrl = `/contact?service=${encodeURIComponent(service)}`;
      window.location.href = contactUrl;
    });
  });

  // Keep hidden service field synced with dropdown on contact page (used by forms)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const serviceSelect = contactForm.querySelector('#serviceSelect');
    const serviceField = contactForm.querySelector('#serviceField');

    const syncHiddenField = () => {
      if (serviceField && serviceSelect) {
        serviceField.value = serviceSelect.value;
      }
    };

    if (serviceSelect) {
      serviceSelect.addEventListener('change', syncHiddenField);
      syncHiddenField();
    }
  }

});



