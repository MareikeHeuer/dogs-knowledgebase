var modalContainer = $("#modal-container");

var dogBreedRepository = (function() {
  var dogBreedsList = [];
  var apiUrl = "https://dog.ceo/api/breeds/list/all";


  //Create a function inside IIFE
  function addListItem(dogBreed) {
    //new variable
    var dogBreedsList = $(".dog-breed-list");
    //create a button createElement
    var button = document.createElement("button");
    button.innerText = dogBreed.name;
    button.classList.add("list-group-item", "list-group-item-action", "dog-breed");
    var dataAttribute = document.createAttribute("data-toggle");
    dataAttribute.value = "modal";
    button.setAttributeNode(dataAttribute);
    var targetAttribute = document.createAttribute("data-target");
    targetAttribute.value = "#breedModal";
    button.setAttributeNode(targetAttribute);
    button.addEventListener("click", function() {
      showDetails(dogBreed)
    })

    dogBreedsList.append(button);
  }

  // Function to show details
  function showDetails(dogBreed) {
    loadDetails(dogBreed).then(function() {
      //showModal(dogBreed.name);
      $("#breedLabel").html(dogBreed.name);
      var modal = modalContainer.find(".modal");
      var imageTag = document.createElement("img");
      imageTag.src = dogBreed.imageUrl;
      modal.append(imageTag);
      $(".modal-body").html("")
      $(".modal-body").append(imageTag);
      //$('.modal-body').html('<img src="' + dogBreed.imageUrl + '" />');
    });
  }

  //Function to add dog breed to dog breeds list
  function add(dogBreed) {
    dogBreedsList.push(dogBreed);
  }

  function loadList() {
    return $.ajax(apiUrl, {
      dataType: "json"
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
      dataType: "json"
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
