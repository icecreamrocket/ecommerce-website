$(document).ready(function () {
  $(window).scroll(function () {
    // When user scrolls
    if (window.scrollY > 50) {
      // Change the navbar background to light
      $(".navbar").removeClass("bg-dark");
      $(".navbar").removeClass("navbar-dark");
      $(".navbar").addClass("bg-light");
    } else {
      // Change the navbar background to dark
      $(".navbar").addClass("bg-dark");
      $(".navbar").addClass("navbar-dark");
      $(".navbar").removeClass("bg-light");
    }
  });
});
