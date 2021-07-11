$(document).ready(function () {
  $("#spinner").hide();
  $("#error").hide();
  $("#success").hide();

  // On profile form submit
  $("#profile-form").submit(function (e) {
    e.preventDefault();

    const email = $("input[name=email").val();
    const username = $("input[name=username").val();
    const profile_pic_url = $("input[name=profile_pic_url").val();
    const id = $(this).data("id");
    console.log(id);

    // Validate email and username
    const emailError = validateEmail(email);
    const usernameError = validateUsername(username);
    if (usernameError) {
      showText("#error", usernameError);
      return;
    }
    if (emailError) {
      showText("#error", emailError);
      return;
    }

    // Try to update user profile
    $.ajax({
      method: "PUT",
      url: `/api/users/${id}`,
      data: $(this).serialize(),
      success: function (data) {
        // Show success, hide spinner
        $("#error").hide();
        $("#spinner").hide();
        $("#profile-submit").show();
        showText("#success", "Update is successful.");
      },
      error: function (error) {
        // Show error, hide spinner
        showText("#error", error.responseJSON.error);
        $("#spinner").hide();
        $("#profile-submit").show();
      },
      beforeSend: function () {
        // Show spinner, hide submit button and messages
        $("#spinner").show();
        $("#profile-submit").hide();
        $("#error").hide();
        $("#success").hide();
      },
    });
  });
});
