// jquery html method 
 // Shorthand for $( document ).ready()
$(function () {
  // Display all games in a list
  function displayGames(data) {
    let html = "";
    for (let i = 0; i < data.length; i++) {
      html += `
                    <li>
                        <a href="/game/${data[i].gameid}">
                        <div class="white-card-outline game-card">
                            <div class="game-img-wrapper">
                            <img src="assets/img/${data[i].gameid}.jpg" alt="game" />
                            </div>
                            <div class="game-content">
                            <h2>${data[i].title}</h2>
                            <span>${data[i].description}</span>
                            <div class="price-text mt-2">$${data[i].price}</div>
                            </div>
                        </div>
                        </a>
                    </li>
                    `;
    }
     // jquery html method
    $("#games-list").html(html);
  }

  $("#spinner").hide();
  
//Perform an asynchronous HTTP (Ajax) request.
  // Fetch all games and display them
  $.ajax({
    method: "GET",
    url: "/api/games",
    failure: function (error) {
      console.log(error);
    },
    success: function (data) {
      $("#spinner").hide();
      displayGames(data);
    },
    beforeSend: function () {
      $("#spinner").show();
    },
  });

  // When user search by title and max price
  $("#title-price-form").submit(function (e) {
    e.preventDefault();

    const title = $("input[name=title]").val();
    let price = $("input[name=price]").val();
    // Set price to -1 if user did not enter price
    if (price === "") {
      price = "-1";
    }

    // Find games with similar title and max price (none if no price filled)
    $.ajax({
      method: "GET",
      url: `/api/games/${price}/${title}`,
      success: function (data) {
        $("#spinner").hide();

        // Show search term
        showText(
          "#search-message",
          `Search results for title, ${title} ${
            price === "-1" ? "" : ", and max price, $" + price
          }`
        );

        // Display games
        displayGames(data);
      },
      failure: function (error) {
        console.log(error);
      },
      beforeSend: function () {
        // Show spinner, clear inputs
        $("input[name=title]").val("");
        $("input[name=price]").val("");
        $("#spinner").show();
      },
    });
  });

  // When user search by platform
  $("#platform-form").submit(function (e) {
    e.preventDefault();

    const platform = $("select[name=platform]").val();

    // Find games with selected platform
    $.ajax({
      method: "GET",
      url: `/api/games/${platform}`,
      success: function (data) {
        $("#spinner").hide();

        // Show search term
        showText("#search-message", `Search results for platform, ${platform}`);

        // Display games
        displayGames(data);
      },
      failure: function (error) {
        console.log(error);
      },
      beforeSend: function () {
        // Show spinner, set input to PC by default
        $("select[name=platform]").val("PC");
        $("#spinner").show();
      },
    });
  });
});
