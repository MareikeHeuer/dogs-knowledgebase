//dogBreedsList array wrapped inside an IIFE
function showModal(title) {
  var modalContainer = $("#modal-container");

  // Clear all existing modal content
  modalContainer.html("");

  var modal = document.createElement("div");
  modal.classList.add("modal");

  // Add the new modal content
  var closeButtonElement = document.createElement("button");
  closeButtonElement.classList.add("modal-close", "btn", "btn-secondary");
  closeButtonElement.innerText = "Close";
  closeButtonElement.addEventListener("click", hideModal);

  var titleElement = document.createElement("h1");
  titleElement.innerText = title;


  modal.appendChild(closeButtonElement);
  modal.appendChild(titleElement);
  modalContainer.append(modal);

  modalContainer.addClass("is-visible");

  //Make modal disappear when pressing esc button
  window.addEventListener("keydown", (e) => {
    var modalContainer = $("#modal-container");
    if (e.key === "Escape" && modalContainer.hasClass("is-visible")) {
      hideModal();
    }
  });

  modalContainer.click(function(e) {

    var target = e.target;
    if (target === modalContainer) {
      hideModal();
    }
  });
}


var modalContainer = $("#modal-container");

var dialogPromiseReject;
//Function to hide modal
function hideModal() {
  modalContainer.removeClass("is-visible");
  if (dialogPromiseReject) {
    dialogPromiseReject();
    dialogPromiseReject = null;
  }
}
//function to show dialog
/*function showDialog(title, text) {
  showModal(title, text);

  // Add a confirm and cancel button to the modal
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
*/



var dogBreedRepository = (function() {
  var dogBreedsList = [];
  var apiUrl = 'https://dog.ceo/api/breeds/list/all';


  //Create a function inside IIFE
  function addListItem(dogBreed) {
    //new variable
    var dogBreedsList = $('.dog-breed-list');
    //create li element
    var listItem = document.createElement('li');
    //create a button createElement
    var button = document.createElement('button');
    button.innerText = dogBreed.name;
    button.classList.add('dog-breed-button', 'btn', 'btn-primary');
    var dataAttribute = document.createAttribute('data-toggle');
    dataAttribute.value = 'modal';
    button.setAttributeNode(dataAttribute);
    var targetAttribute = document.createAttribute('data-target');
    targetAttribute.value = '#breedModal';
    button.setAttributeNode(targetAttribute);
    button.addEventListener('click', function() {
      showDetails(dogBreed)
    })
    // Add to parents
    listItem.appendChild(button);
    dogBreedsList.append(listItem);
  }

  // Function to show details
  function showDetails(dogBreed) {
    loadDetails(dogBreed).then(function() {
      //showModal(dogBreed.name);
      $('#breedLabel').html(dogBreed.name);
      var modal = modalContainer.find(".modal");
      var imageTag = document.createElement("img");
      imageTag.src = dogBreed.imageUrl;
      modal.append(imageTag);
      $('.modal-body').html('')
      $('.modal-body').append(imageTag);
      //$('.modal-body').html('<img src="' + dogBreed.imageUrl + '" />');
    });
  }

  //Function to add dog breed to dog breeds list
  function add(dogBreed) {
    dogBreedsList.push(dogBreed);
  }

  function loadList() {
    return $.ajax(apiUrl, {
      dataType: 'json'
    }).then(function(json) {
      Object.keys(json.message).forEach(function(name) {
        var dogBreed = {
          name: name,
          detailsUrl: "https://dog.ceo/api/breed/" + name + "/images/random"
        };
        add(dogBreed);
      });
    }).catch(function(e) {
      console.error(e);
    })
  }

  //Function to get all the dog breeds
  function getAll() {
    return dogBreedsList;
  }

  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url, {
      dataType: 'json'
    }).then(function(details) {
      // Now we add the details to the item
      item.imageUrl = details.message;
    }).catch(function(e) {
      console.error(e);
    });
  }



  //Return functions to add and get all the dog breeds
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
  };
})();

dogBreedRepository.loadList().then(function() {
  // Now the data is loaded!
  dogBreedRepository.getAll().forEach(function(breed) {
    dogBreedRepository.addListItem(breed);
  });
})
