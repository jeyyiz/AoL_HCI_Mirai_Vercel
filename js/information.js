document.addEventListener("DOMContentLoaded", function () {
  const accordionHeaders = document.querySelectorAll(
    ".accordion-item .info-box-header",
  );

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      const parentItem = this.parentElement;

      parentItem.classList.toggle("active");
    });
  });
});
