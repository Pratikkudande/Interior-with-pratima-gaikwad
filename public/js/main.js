document.addEventListener('DOMContentLoaded', () => {
  // When clicking "Enquire" on services page, pre-fill the contact form service (if present)
  const enquireButtons = document.querySelectorAll('.js-service-enquire');
  enquireButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const service = btn.getAttribute('data-service') || '';
      const contactUrl = `/contact?service=${encodeURIComponent(service)}`;
      window.location.href = contactUrl;
    });
  });
});



