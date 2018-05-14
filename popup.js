var tabId;
var accessToken;
var alpacaBackgrounds = ["bg-b0e0e6", "bg-ffeae5", "bg-ddf7be", "bg-e6e6fa", "bg-ffe4e1", "bg-d3ffce", "bg-f0f8ff", "bg-c6e2ff", "bg-faebd7"];

window.onload = function() {
  if(localStorage.getItem("ACCESS_TOKEN") === null) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tab = tabs[0];
      if(tab.url != undefined && tab.url.indexOf("cryptoalpaca.pet") > -1) {
        tabId = tab.id;

        let message = {
          action: "get_access_token"
        }

        chrome.tabs.sendMessage(tab.id, message, function(res) {
          if(res != undefined && res.data != undefined) {
            accessToken = res.data;
            localStorage.setItem("ACCESS_TOKEN", accessToken);

            getAlpacas();
          }
        });
      }
    });
  } else {
    accessToken = localStorage.getItem("ACCESS_TOKEN");

    getAlpacas();
  }

  document.getElementById("open-ca").onclick = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tab = tabs[0];
      if(tab.url == undefined || tab.url.indexOf("cryptoalpaca.pet") == -1) {
        chrome.tabs.create({url: "https://www.cryptoalpaca.pet"});
      }
    });
  }
}

function getAlpacas() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://api.cryptoalpaca.pet/users/alpacas/", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.setRequestHeader("authorization", "Token " + accessToken);
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      loadAlpacas(JSON.parse(this.responseText).results);
    }
  }
  xhttp.send();
}

function loadAlpacas(alpacas) {
  for(let alpaca of alpacas) {
    addAlpaca(alpaca);
  }
}

function addAlpaca(alpaca) {
  var gene = alpaca.gene;
  var alpacaDiv = document.createElement("div");
  alpacaDiv.classList.add("alpaca-div", alpacaBackgrounds[alpaca.id % alpacaBackgrounds.length]);

  var ear = "/image/alpaca/ear" + gene.substring(1,2) + ".svg";
  var body = "/image/alpaca/body" + gene.substring(2,3) + ".svg";
  var face = "/image/alpaca/face" + gene.substring(3,4) + ".svg";
  var decorations = "/image/alpaca/decorations" + gene.substring(4,5) + ".svg";
  var tail = "/image/alpaca/tail" + gene.substring(5,6) + ".svg";

  var earImg = document.createElement("img");
  earImg.src = "https://www.cryptoalpaca.pet" + ear;
  var earContainer = document.createElement("div");
  earContainer.appendChild(earImg);
  earContainer.classList.add("alpaca-img");
  alpacaDiv.appendChild(earContainer);

  var bodyImg = document.createElement("img");
  bodyImg.src = "https://www.cryptoalpaca.pet" + body;
  var bodyContainer = document.createElement("div");
  bodyContainer.appendChild(bodyImg);
  bodyContainer.classList.add("alpaca-img");
  alpacaDiv.appendChild(bodyContainer);

  var faceImg = document.createElement("img");
  faceImg.src = "https://www.cryptoalpaca.pet" + face;
  var faceContainer = document.createElement("div");
  faceContainer.appendChild(faceImg);
  faceContainer.classList.add("alpaca-img");
  alpacaDiv.appendChild(faceContainer);

  var decorationsImg = document.createElement("img");
  decorationsImg.src = "https://www.cryptoalpaca.pet" + decorations;
  var decorationsContainer = document.createElement("div");
  decorationsContainer.appendChild(decorationsImg);
  decorationsContainer.classList.add("alpaca-img");
  alpacaDiv.appendChild(decorationsContainer);

  var tailImg = document.createElement("img");
  tailImg.src = "https://www.cryptoalpaca.pet" + tail;
  var tailContainer = document.createElement("div");
  tailContainer.appendChild(tailImg);
  tailContainer.classList.add("alpaca-img");
  alpacaDiv.appendChild(tailContainer);

  var idLabel = document.createElement("p");
  idLabel.textContent = alpaca.id;
  idLabel.classList.add("alpaca-id-p");
  alpacaDiv.appendChild(idLabel);

  document.getElementById("alpaca").appendChild(alpacaDiv);

  alpacaDiv.onclick = () => {
    alpacaDiv.classList.toggle("active-alpaca");
  }
}