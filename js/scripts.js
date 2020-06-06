//pokemonList array wrapped inside an IIFE
function showModal(title, text) {
  var modalContainer = $("#modal-container");

  // Clear all existing modal content
  modalContainer.html("");

  var modal = document.createElement("div");
  modal.classList.add("modal");

  // Add the new modal content
/*  var closeButtonElement = document.createElement("button");
  closeButtonElement.classList.add("modal-close");
  closeButtonElement.innerText = "Close";*/

  var closeButtonElement = document.createElement("button");
  closeButtonElement.classList.add("modal-close");
  closeButtonElement.innerText = "Close";
  closeButtonElement.addEventListener("click", hideModal);

  var titleElement = document.createElement("h1");
  titleElement.innerText = title;

  var contentElement = document.createElement("p");
  contentElement.innerText = text;

  modal.appendChild(closeButtonElement);
  modal.appendChild(titleElement);
  modal.appendChild(contentElement);
  modalContainer.append(modal);

  modalContainer.addClass("is-visible");



  window.addEventListener("keydown", (e) => {
    var modalContainer = $("#modal-container");
    if (e.key === "Escape" && modalContainer.classList.contains("is-visible")) {
      hideModal();
    }
  });

  modalContainer.click(function(e) {
    // Since this is also triggered when clicking INSIDE the modal
    // We only want to close if the user clicks directly on the overlay
    var target = e.target;
    if (target === modalContainer) {
      hideModal();
    }
  });
}


var modalContainer = $("#modal-container");

var dialogPromiseReject;

function hideModal() {
  modalContainer.removeClass("is-visible");
  if (dialogPromiseReject) {
    dialogPromiseReject();
    dialogPromiseReject = null;
  }
}

function showDialog(title, text) {
  showModal(title, text);

  // We want to add a confirm and cancel button to the modal
  var modal = modalContainer.querySelector(".modal");

  var confirmButton = document.createElement("button");
  confirmButton.classList.add("modal-confirm");
  confirmButton.innerText = "Confirm";

  var cancelButton = document.createElement("button");
  cancelButton.classList.add("modal-cancel");
  cancelButton.innerText = "Cancel";

  modal.appendChild(confirmButton);
  modal.appendChild(cancelButton);

  // We want to focus the confirmButton so that the user can simply press Enter
  confirmButton.focus();

  // Return a promise that resolves when confirmed, else rejects
  return new Promise((resolve, reject) => {
    cancelButton.addEventListener("click", hideModal);
    confirmButton.addEventListener("click", () => {
      dialogPromiseReject = null; // Reset this
      hideModal();
      resolve();
    });

    // This can be used to reject from other functions
    dialogPromiseReject = reject;
  });
}




var pokemonRepository = (function () {
  var pokemonList = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';


  //Create a function inside IIFE
  function addListItem(pokemon) {
    //new variable
    var pokemonList = $('.pokemon-list');
    //create li element
    var listItem = document.createElement('li');
    //create a button createElement
    var button = document.createElement('button');
    button.innerText = pokemon.name;
    button.classList.add('pokemon-button')
    button.addEventListener('click', function() {
      showDetails(pokemon)
    })
    // Add to parents
    listItem.appendChild(button);
    pokemonList.append(listItem);
  }

// Function to show details
function showDetails(pokemon) {
  loadDetails(pokemon).then(function () {
    showModal(pokemon.name, 'Height: ' + pokemon.height);
    var modal = modalContainer.find(".modal");
    var imageTag = document.createElement("img");
    imageTag.src = pokemon.imageUrl;
    modal.append(imageTag)
  });
}

  //Function to add Pokemon to the Pokemon list
  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  function loadList() {
    return $.ajax(apiUrl, { dataType: 'json' }).then(function (json) {
      json.results.forEach(function (item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
    })
  }

  //Function to get all the Pokemons
  function getAll() {
    return pokemonList;
  }

  function loadDetails(item) {
  var url = item.detailsUrl;
  return $.ajax(url, { dataType: 'json' }).then(function (details) {
    // Now we add the details to the item
    item.imageUrl = details.sprites.front_default;
    item.height = details.height;
    item.types = details.types;
  }).catch(function (e) {
    console.error(e);
  });
}



  //Return functions to add and get all the Pokemons
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
  };
})();

pokemonRepository.loadList().then(function() {
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});
