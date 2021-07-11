$(document).ready(function () {
  $(".loader").hide();
  $(".error").hide();
  $(".success").hide();

  // Populate game form with data
  function setGameFormData(game) {
    $('.create-edit-game-form input[name="title"]').val(game ? game.title : "");
    $('.create-edit-game-form input[name="platform"]').val(
      game ? game.platform : ""
    );
    $('.create-edit-game-form input[name="year"]').val(game ? game.year : "");
    $('.create-edit-game-form select[name="category"]').val(
      game ? game.categoryid : ""
    );
    $('.create-edit-game-form input[name="description"]').val(
      game ? game.description : ""
    );
    $('.create-edit-game-form input[name="price"]').val(game ? game.price : "");
    $(".create-edit-game-form").attr("data-id", game ? game.gameid : "");
  }

  // Populate category form with data
  function setCategoryFormData(category) {
    $('.create-edit-category-form input[name="catname"]').val(
      category ? category.catname : ""
    );
    $('.create-edit-category-form input[name="description"]').val(
      category ? category.description : ""
    );
    $(".create-edit-category-form").attr(
      "data-id",
      category ? category.id : ""
    );
  }

  // Set up delete form
  function setDeleteFormData(form, id) {
    $(form).attr("data-id", id ? id : "");
  }

  // Keep track of edit or create states for games and categories
  let gameState = "create";
  let categoryState = "create";

  // Hide messages on modal close
  $("#gameModal").on("hidden.bs.modal", function () {
    $("#game-success").hide();
    $("#game-error").hide();
  });

  // Set up modal data
  $.ajax({
    method: "GET",
    url: "/api/categories",
  })
    .then((data) => {
      for (let category of data) {
        // On edit button click
        $(`#edit-category-btn-${category.id}`).click(function (e) {
          e.preventDefault();

          // Set category state to edit
          categoryState = "edit";

          // Display existing data on form
          setCategoryFormData(category);
        });

        // On delete button click
        $(`#delete-category-btn-${category.id}`).click(function (e) {
          e.preventDefault();

          setDeleteFormData(".delete-category-form", category.id);
        });
      }

      // Set up category options
      let html = "";
      for (let i = 0; i < data.length; i++) {
        const category = data[i];
        html += `<option value="${category.id}">${category.catname}</option>`;
      }
      $(`.create-edit-game-form select[name="category"]`).append(html);
    })
    .then(
      // Set up edit modal for games
      () =>
        $.ajax({
          method: "GET",
          url: "/api/games",
          data: $(this).serialize(),
          success: function (data) {
            // For each game
            for (let game of data) {
              // On edit button click
              $(`#edit-game-btn-${game.gameid}`).click(function (e) {
                e.preventDefault();

                // Set game state to edit
                gameState = "edit";

                // Display existing data on form
                setGameFormData(game);
              });

              // On delete button click
              $(`#delete-game-btn-${game.gameid}`).click(function (e) {
                e.preventDefault();

                setDeleteFormData(".delete-game-form", game.gameid);
              });
            }
          },
          error: function (error) {
            console.log(error);
          },
        })
    );

  $("#add-game-btn").click(function (e) {
    e.preventDefault();

    // Set game state to create
    gameState = "create";

    // Reset data on form
    setGameFormData(null);
  });

  $("#edit-game-btn").click(function (e) {
    e.preventDefault();

    // Set game state to create
    gameState = "edit";
  });

  $("#add-category-btn").click(function (e) {
    e.preventDefault();

    // Set category state to edit
    categoryState = "create";

    // Reset data on form
    setCategoryFormData(null);
  });

  // On delete game form submit
  $(".delete-game-form").submit(function (e) {
    e.preventDefault();

    $.ajax({
      url: `/api/game/${$(this).data("id")}`,
      method: "DELETE",
      success: function (data) {
        // Show success
        showText("#game-delete-success", "Game was successfully deleted.");
      },
      failure: function (error) {
        // Show error
        showText("#game-delete-error", error.responseJSON.message);
      },
      beforeSend: function () {},
    });
  });

  // On delete category form submit
  $(".delete-category-form").submit(function (e) {
    e.preventDefault();

    $.ajax({
      url: `/api/category/${$(this).data("id")}`,
      method: "DELETE",
      success: function (data) {
        // Show success
        showText(
          "#category-delete-success",
          "Category was successfully deleted."
        );
      },
      failure: function (error) {
        // Show error
        showText("#category-delete-error", error.responseJSON.message);
      },
      beforeSend: function () {},
    });
  });

  // Update or create game on submit
  $(".create-edit-category-form").submit(function (e) {
    e.preventDefault();

    // Create a new category
    if (categoryState === "create") {
      $.ajax({
        url: `/api/category`,
        method: "POST",
        data: $(this).serialize(),
        success: function (data) {
          // Show success, hide spinner
          showText("#category-success", "Category sucessfully created!");
          $("#category-spinner").hide();
          $("#category-submit-btn").show();
        },
        failure: function (error) {
          // Show error, hide spinner
          showText("#category-error", error.responseJSON.message);
          $("#category-spinner").hide();
          $("#category-submit-btn").show();
          
        },
        beforeSend: function () {
          // Show spinner, hide submit button
          $("#category-spinner").show();
          $("#category-submit-btn").hide();
        },
      });
    } else if (categoryState === "edit") {
      $.ajax({
        url: `/api/category/${$(this).data("id")}`,
        method: "PUT",
        data: $(this).serialize(),
        success: function (data) {
          // Show success, hide spinner
          showText("#category-success", "Category sucessfully updated!");
          $("#category-spinner").hide();
          $("#category-submit-btn").show();
        },
        failure: function (error) {
          // Show error, hide spinner
          showText("#category-error", error.responseJSON.message);
          $("#category-spinner").hide();
          $("#category-submit-btn").show();
        },
        beforeSend: function () {
          // Show spinner, hide submit button
          $("#category-spinner").show();
          $("#category-submit-btn").hide();
        },
      });
    }
  });

  // Update or create game on submit
  $(".create-edit-game-form").submit(function (e) {
    e.preventDefault();

    console.log(gameState);

    // Create a new game
    if (gameState === "create") {
      $.ajax({
        url: `/api/game`,
        method: "POST",
        data: $(this).serialize(),
        success: function (data) {
          // Show success, hide spinner
          showText("#game-success", "Game sucessfully created!");
          $("#game-spinner").hide();
          $("#game-submit-btn").show();
        },
        failure: function (error) {
          // Show error, hide spinner
          showText("#game-error", error.responseJSON.message);
          $("#game-spinner").hide();
          $("#game-submit-btn").show();
        },
        beforeSend: function () {
          // Show spinner, hide submit button
          $("#game-spinner").show();
          $("#game-submit-btn").hide();
        },
      });
    } else if (gameState === "edit") {
      // Update an existing game
      $.ajax({
        url: `/api/game/${$(this).data("id")}`,
        method: "PUT",
        data: $(this).serialize(),
        success: function (data) {
          // Show success, hide spinner
          showText("#game-success", "Game sucessfully updated!");
          $("#game-spinner").hide();
          $("#game-submit-btn").show();
        },
        failure: function (error) {
          // Show error, hide spinner
          showText("#game-error", error.responseJSON.message);
          $("#game-spinner").hide();
          $("#game-submit-btn").show();
        },
        beforeSend: function () {
          // Show spinner, hide submit button
          $("#game-spinner").show();
          $("#game-submit-btn").hide();
        },
      });
    }
  });
});
