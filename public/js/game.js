$(document).ready(function () {
  $("#error").hide();
  $("#success").hide();
  $("#spinner").hide();

  const gid = window.location.pathname.slice(6);
  const uid = $("#review-form").data("uid");

  // Set up game details
  $.ajax({
    method: "GET",
    url: `/api/game/${gid}/review`,
    success: function (data) {
      // Calculate average rating
      let avgRating = 0;
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          avgRating += data[i].rating;
        }
        avgRating /= data.length;
      }
      $("#avg-rating").text(avgRating.toFixed(2));
    },
  });

  // On submit review by user
  $("#review-form").submit(function (e) {
    e.preventDefault();

    $.ajax({
      method: "POST",
      url: `/api//user/${uid}/game/${gid}/review/`,
      data: $(this).serialize(),
      success: function (data) {
        // Show success, hide spinner
        $("#spinner").hide();
        $("#review-btn").show();
        showText("#success", "Review added successfully.");
      },
      error: function (error) {
        // Show error, hide spinner
        $("#spinner").hide();
        $("#review-btn").show();
        showText("#error", error.responseJSON.message);
      },
      beforeSend: function () {
        // Show spinner, hide submit button
        $("#spinner").show();
        $("#review-btn").hide();
      },
    });
  });
});
