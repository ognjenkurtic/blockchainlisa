App = {
  web3Provider: null,
  contracts: {},

  init: function () {
    // Load paintings.
    $.getJSON('../paintings.json', function (data) {
      var paintingRow = $('#paintingRow');
      var paintingTemplate = $('#paintingTemplate');

      for (i = 0; i < data.length; i++) {
        paintingTemplate.find('.panel-title').text(data[i].painter);
        paintingTemplate.find('img').attr('src', data[i].picture);
        paintingTemplate.find('.painting-name').text(data[i].name);
        paintingTemplate.find('.painting-year').text(data[i].year);
        paintingTemplate.find('.painting-museum').text(data[i].museum);
        paintingTemplate.find('.museum-address').attr('id', "museum-address-" + data[i].id);
        paintingTemplate.find('.btn-lend').attr('data-id', +data[i].id);
        paintingTemplate.find('.btn-accept').attr('data-id', +data[i].id);

        paintingRow.append(paintingTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    $.getJSON('Museum.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var MuseumArtifact = data;
      App.contracts.Museum = TruffleContract(MuseumArtifact);

      // Set the provider for our contract
      App.contracts.Museum.setProvider(App.web3Provider);

      return App.initCollection();
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on('click', '.btn-lend', App.handleAdopt);
    $(document).on('click', '.btn-accept', App.acceptArtwork);
  },

  initCollection: function () {
    var museumInstance;
    App.contracts.Museum.deployed().then(function (instance) {
      museumInstance = instance;
      console.log("bla");

      return museumInstance.initCollection();
    }).then(function () {
      console.log("op op");

      return museumInstance.getAllArtworks.call();
    }).then(function (artworks) {
      console.log(artworks);
    });
  },

  // // markAdopted: function(adopters, account) {
  // //   var adoptionInstance;
  // //   App.contracts.Adoption.deployed().then(function(instance){
  // //     adoptionInstance = instance;

  // //     return adoptionInstance.getAdopters.call();

  // //   }).then(function(adopters){
  // //     for (i = 0; i < adopters.length; i++) {
  // //       if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
  // //         $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
  // //       }
  // //     }
  // //   }).catch(function(err) {
  // //     console.log(err.message);
  // //   });
  // // },

  getArtworkDetails: function (artworkId) {
    var museumInstance;
    App.contracts.Museum.deployed().then(function (instance) {
      museumInstance = instance;

      return museumInstance.getArtworkDetails.call(artworkId);

    }).then(function (response) {
      // // for (i = 0; i < adopters.length; i++) {
      // //   if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
      // //     $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
      // //   }
      // // }
      console.log("Offered: " + response);
    }).catch(function (err) {
      console.log(err.message);
    });
  },

  acceptArtwork: function (event) {
    var museumInstance;
    var artworkId = parseInt($(event.target).data('id'));

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Museum.deployed().then(function (instance) {
        museumInstance = instance;
        console.log("ratata"+artworkId);
        
        return museumInstance.accept(artworkId, { from: account });
     
    }).then(function (response) {
      // // for (i = 0; i < adopters.length; i++) {
      // //   if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
      // //     $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
      // //   }
      // // }
      console.log("Accepted: " + response);
    }).catch(function (err) {
      console.log(err.message);
    });
  });
  },

  handleAdopt: function (event) {
    event.preventDefault();

    var artworkId = parseInt($(event.target).data('id'));
    var museumAddress = $("#museum-address-" + artworkId).val();

    var adoptionInstance;
    var museumInstance;


    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      // // App.contracts.Adoption.deployed().then(function (instance) {
      // //   adoptionInstance = instance;

      // //   // Execute adopt as a transaction by sending account
      // //   return adoptionInstance.adopt(petId, { from: account });
      // // }).then(function (result) {
      // //   return App.markAdopted();
      // // }).catch(function (err) {
      // //   console.log(err.message);
      // // });
      App.contracts.Museum.deployed().then(function (instance) {
        museumInstance = instance;

        // Execute adopt as a transaction by sending account
        return museumInstance.lend(artworkId, museumAddress, { from: account });
      }).then(function (result) {
        console.log(result);
      }).then(function () {
        return museumInstance.getAllArtworks.call()
      }).then(function (resp) {
        App.getArtworkDetails(artworkId);
        console.log(resp);
      }).catch(function (err) {
        console.log(err.message);
      });
    });

  }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
