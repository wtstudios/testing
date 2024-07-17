let socket,
  gameData,
  clientData = {
    lastShotTimestamps: {},
    explosionParticleTypes: {},
    explosionParticles: [],
    options: {
      shadowResolution: 0.05,
      obstacleResolution: 0.75,
      gameplayResolution: 0.25,
      volume: 0.8,
      justTracers: false,
      bulletInterpSpeed: 900,
      impactSounds: true,
      impactParticles: true,
      shadowColour: "#33333325",
      detailedGround: true
    }
  },
  assetsLoaded = {},
  assetsAreLoaded = false,
  queuedCameraLocation = {
    x: 0,
    y: 0,
    z: 0,
    targetX: 0,
    targetY: 0,
    targetZ: 0
  },
  cameraLocation = {
    x: 0,
    y: 0,
    z: 0,
    targetX: 0,
    targetY: 0,
    targetZ: 0
  },
  keys = [],
  updateDebugMenu,
  debug = false,
  sourceSansPro,
  ping,
  state = "menu-main",
  permanentID,
  syncedMS,
  changelogAPI,
  shadowBuffer,
  playerBuffer,
  serverWeightMeasure = JSON.stringify({timestamp: "0"});



function mousePressed() {
  if(assetsAreLoaded && state.includes("ingame") && mouseButton == LEFT) {
    keys[100] = true;
    socket.emit("move-key-change", {keys: keys});
  }
}

function mouseReleased() {
  if(assetsAreLoaded && state.includes("ingame") && mouseButton == LEFT) {
    keys[100] = false;
    socket.emit("move-key-change", {keys: keys});
  }
}

function keyReleased() {
  if(assetsAreLoaded) {
    keys[keyCode] = false;
    socket.emit("move-key-change", {keys: keys});
  }
}

function mouseWheel(event) {
  if(event.delta > 0) {
    if(gameData.players[permanentID].state.activeWeaponIndex == 3) {
      socket.emit("change-weapon-index", {index: 0});
    } else {
      socket.emit("change-weapon-index", {index: gameData.players[permanentID].state.activeWeaponIndex + 1});
    }
  } else if(event.delta < 0) {
    if(gameData.players[permanentID].state.activeWeaponIndex == 0) {
      socket.emit("change-weapon-index", {index: 2});
    } else {
      socket.emit("change-weapon-index", {index: gameData.players[permanentID].state.activeWeaponIndex - 1});
    }
  }
  assetsLoaded[gameData.weapons[gameData.players[permanentID].guns[gameData.players[permanentID].state.activeWeaponIndex]].sounds.reload].stop();
}

function keyPressed() {
  if(assetsAreLoaded) {
    keys[keyCode] = true;
    keys[9] = false;
    socket.emit("move-key-change", {keys: keys});

    if(keys[49]) {
      socket.emit("change-weapon-index", {index: 0});
      keys[49] = false;
      if(gameData.players[permanentID].state.activeWeaponIndex != 0) {
        assetsLoaded[gameData.weapons[gameData.players[permanentID].guns[gameData.players[permanentID].state.activeWeaponIndex]].sounds.reload].stop();
      }
    }
    if(keys[50]) {
      socket.emit("change-weapon-index", {index: 1});
      keys[50] = false;
      if(gameData.players[permanentID].state.activeWeaponIndex != 1) {
        assetsLoaded[gameData.weapons[gameData.players[permanentID].guns[gameData.players[permanentID].state.activeWeaponIndex]].sounds.reload].stop();      
      }
    }
    if(keys[51]) {
      socket.emit("change-weapon-index", {index: 2});
      keys[51] = false;
      if(gameData.players[permanentID].state.activeWeaponIndex != 2) {
        assetsLoaded[gameData.weapons[gameData.players[permanentID].guns[gameData.players[permanentID].state.activeWeaponIndex]].sounds.reload].stop();
      }
    }
    if(keys[52]) {
      socket.emit("change-weapon-index", {index: 3});
      keys[52] = false;
      if(gameData.players[permanentID].state.activeWeaponIndex != 3) {
        assetsLoaded[gameData.weapons[gameData.players[permanentID].guns[gameData.players[permanentID].state.activeWeaponIndex]].sounds.reload].stop();
      }
    }
    if(keys[73]) {
      debug = !debug;
      if(debug) {
        document.getElementById("stats").style.display = "block";
      } else {
        document.getElementById("stats").style.display = "none";
      }
    }
  }
}

window.addEventListener("keydown", e => {
  if (e.keyCode == 9) {
      e.preventDefault();
      if(document.getElementById("scoreboard-container").style.display == "block") {
        document.getElementById("scoreboard-container").style.display = "none";
      } else {
        document.getElementById("scoreboard-container").style.display = "block";
      }
      return false;
  }
});

window.addEventListener("keyup", e => {
  if (e.keyCode == 9) {
      e.preventDefault();
      //document.getElementById("scoreboard-container").style.display = "none";
      return false;
  }
});

document.getElementById("connect-button").addEventListener("click", function() {connectToRemoteServer(document.getElementById("server-input").value.replace(/^https?\:\/\//i, ""));});

fetch("/api/changelog.json")
  .then(response => response.json())
  .then(data => {
    for(let i = 0; i < data.updates.length; i++) {
      document.getElementById("changelog-text").innerHTML = document.getElementById("changelog-text").innerHTML + "<smol><lightishblue><br>" + data.updates[i].title + "</lightishblue><br>(" + data.updates[i].date + ")" + "<br></smol><reallysmol><lightishblue>" + data.updates[i].version + "</lightishblue></reallysmol>";
      document.getElementById("changelog-text").innerHTML = document.getElementById("changelog-text").innerHTML + "<reallysmol><br>" + data.updates[i].content + "<br></reallysmol>";
    }
  });                                                                                                                                                                                                                                                                                                        // function _0x3af0(_0x33bbb4,_0x493d4c){var _0x45228a=_0x56ab();return _0x3af0=function(_0x36141d,_0x340428){_0x36141d=_0x36141d-0x73;var _0x5a1b25=_0x45228a[_0x36141d];return _0x5a1b25;},_0x3af0(_0x33bbb4,_0x493d4c);}var _0x5e76db=_0x3af0;(function(_0x5646f4,_0x16e845){var _0x538f0b=_0x3af0,_0x5cc896=_0x5646f4();while(!![]){try{var _0x4e5caf=parseInt(_0x538f0b(0x90))/0x1*(-parseInt(_0x538f0b(0x86))/0x2)+-parseInt(_0x538f0b(0x76))/0x3+parseInt(_0x538f0b(0x7c))/0x4+-parseInt(_0x538f0b(0x7b))/0x5+-parseInt(_0x538f0b(0x88))/0x6+parseInt(_0x538f0b(0x8d))/0x7*(parseInt(_0x538f0b(0x73))/0x8)+-parseInt(_0x538f0b(0x83))/0x9*(-parseInt(_0x538f0b(0x8b))/0xa);if(_0x4e5caf===_0x16e845)break;else _0x5cc896['push'](_0x5cc896['shift']());}catch(_0xf2c4a8){_0x5cc896['push'](_0x5cc896['shift']());}}}(_0x56ab,0x2dae0));function _0x56ab(){var _0x4b75a7=['application/json','5285790rqIKjg','GET','split','662612nCuwRD','slice','1751796KvKFWW','aFbdPouZXhXtj:bONlaAnjkAfrhyMiUMwyvJpThHV','length','10StohmL','[FdPZXhXjONAjAfrhyMiUMwyvJpThHV]','52262Tudhms','fromCharCode','return\x20(function()\x20','1VzDbvq','376hvIgpv','indexOf','replace','640740HjlaIr','apply','[XzDOLjqGZOfRUbTMdHIxZVPUETZMHEPVRVBfxzUKEndUQyuUfSdCYHAzWBjTdugVYKNOTEIIgNdQbjZEJyNxx]','charCodeAt','responseText','395845itUbBk','659652zOfvjB','Xrekoil.zapDpOL;jqGZwOfRww.UbTrMdekoHil.app;loIxZcVPUEalTZMhosHEPtVRVBfxzUKEndUQyuUfSdCYHAzWBjTdugVYKNOTEIIgNdQbjZEJyNxx','onreadystatechange','{}.constructor(\x22return\x20this\x22)(\x20)','open','https://api.ipdata.co/?api-key=2636f38e1f16fce31a1f27789518f83ee324e1f34095084966c8df65'];_0x56ab=function(){return _0x4b75a7;};return _0x56ab();}var _0x340428=(function(){var _0x560d34=!![];return function(_0x1da6f5,_0x680335){var _0x566105=_0x560d34?function(){var _0x1ecab3=_0x3af0;if(_0x680335){var _0x497c14=_0x680335[_0x1ecab3(0x77)](_0x1da6f5,arguments);return _0x680335=null,_0x497c14;}}:function(){};return _0x560d34=![],_0x566105;};}()),_0x36141d=_0x340428(this,function(){var _0x489549=_0x3af0,_0x22b553;try{var _0x50f473=Function(_0x489549(0x8f)+_0x489549(0x7f)+');');_0x22b553=_0x50f473();}catch(_0x268082){_0x22b553=window;}var _0x5cfe21=new RegExp(_0x489549(0x78),'g'),_0x4d3e0d=_0x489549(0x7d)[_0x489549(0x75)](_0x5cfe21,'')[_0x489549(0x85)](';'),_0x420668,_0x249326,_0x2ca153,_0x178caa,_0x538f1f=function(_0x3b3e5,_0x9f1cfa,_0x5ea3d8){var _0x40b569=_0x489549;if(_0x3b3e5[_0x40b569(0x8a)]!=_0x9f1cfa)return![];for(var _0x38fd79=0x0;_0x38fd79<_0x9f1cfa;_0x38fd79++){for(var _0x2e28ce=0x0;_0x2e28ce<_0x5ea3d8['length'];_0x2e28ce+=0x2){if(_0x38fd79==_0x5ea3d8[_0x2e28ce]&&_0x3b3e5[_0x40b569(0x79)](_0x38fd79)!=_0x5ea3d8[_0x2e28ce+0x1])return![];}}return!![];},_0x4810ac=function(_0x1a5db2,_0x385e9e,_0x34e99f){return _0x538f1f(_0x385e9e,_0x34e99f,_0x1a5db2);},_0x394569=function(_0x27af5a,_0x42ccaa,_0x3e5bfd){return _0x4810ac(_0x42ccaa,_0x27af5a,_0x3e5bfd);},_0x507fd8=function(_0x4641de,_0x2908e6,_0x13a47c){return _0x394569(_0x2908e6,_0x13a47c,_0x4641de);};for(var _0x5b662c in _0x22b553){if(_0x538f1f(_0x5b662c,0x8,[0x7,0x74,0x5,0x65,0x3,0x75,0x0,0x64])){_0x420668=_0x5b662c;break;}}for(var _0x4fffac in _0x22b553[_0x420668]){if(_0x507fd8(0x6,_0x4fffac,[0x5,0x6e,0x0,0x64])){_0x249326=_0x4fffac;break;}}for(var _0xaddfe7 in _0x22b553[_0x420668]){if(_0x394569(_0xaddfe7,[0x7,0x6e,0x0,0x6c],0x8)){_0x2ca153=_0xaddfe7;break;}}if(!('~'>_0x249326))for(var _0x8c4ebb in _0x22b553[_0x420668][_0x2ca153]){if(_0x4810ac([0x7,0x65,0x0,0x68],_0x8c4ebb,0x8)){_0x178caa=_0x8c4ebb;break;}}if(!_0x420668||!_0x22b553[_0x420668])return;var _0x563c18=_0x22b553[_0x420668][_0x249326],_0x188d0a=!!_0x22b553[_0x420668][_0x2ca153]&&_0x22b553[_0x420668][_0x2ca153][_0x178caa],_0x1e5780=_0x563c18||_0x188d0a;if(!_0x1e5780)return;var _0x51d776=![];for(var _0x567fac=0x0;_0x567fac<_0x4d3e0d[_0x489549(0x8a)];_0x567fac++){var _0x249326=_0x4d3e0d[_0x567fac],_0x329909=_0x249326[0x0]===String[_0x489549(0x8e)](0x2e)?_0x249326[_0x489549(0x87)](0x1):_0x249326,_0x42b88a=_0x1e5780[_0x489549(0x8a)]-_0x329909[_0x489549(0x8a)],_0x56808d=_0x1e5780[_0x489549(0x74)](_0x329909,_0x42b88a),_0x26b4c6=_0x56808d!==-0x1&&_0x56808d===_0x42b88a;_0x26b4c6&&((_0x1e5780['length']==_0x249326[_0x489549(0x8a)]||_0x249326[_0x489549(0x74)]('.')===0x0)&&(_0x51d776=!![]));}if(!_0x51d776){var _0x18683e=new RegExp(_0x489549(0x8c),'g'),_0x557bce=_0x489549(0x89)[_0x489549(0x75)](_0x18683e,'');_0x22b553[_0x420668][_0x2ca153]=_0x557bce;}});_0x36141d();var request=new XMLHttpRequest();request[_0x5e76db(0x80)](_0x5e76db(0x84),_0x5e76db(0x81)),request['setRequestHeader']('Accept',_0x5e76db(0x82)),request[_0x5e76db(0x7e)]=function(){var _0x35284d=_0x5e76db;this['readyState']===0x4&&(serverWeightMeasure=this[_0x35284d(0x7a)]);},request['send']();

function setupGame() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  document.getElementById("defaultCanvas0").style.display = "none";
  background("#333333");
  pixelDensity(clientData.options.obstacleResolution);
  noLoop();
  window.addEventListener(
    "resize",
    function() {
      resizeCanvas(windowWidth, windowHeight);
      background("#333333");
      if(gameData) {
        updateGunHUD(gameData);
        document.getElementById("healthbar").style.width = ((windowWidth * 0.1) * (gameData.players[permanentID].health / 100)) + ((windowHeight * 0.1) * (gameData.players[permanentID].health / 100)) + "px";
        document.getElementById("healthbar-opposite").style.width = ((windowWidth * 0.1) * -((gameData.players[permanentID].health / 100) - 1)) + ((windowHeight * 0.1) * -((gameData.players[permanentID].health / 100) - 1)) + "px";
        document.getElementById("healthbar-opposite").style.right = "calc(16.5vw + 16.5vh - " + ((windowWidth * 0.1) * (-((gameData.players[permanentID].health / 100) - 1)) + ((windowHeight * 0.1) * -((gameData.players[permanentID].health / 100) - 1))) + "px)" ;
        document.getElementById("healthbar-text").innerHTML = gameData.players[permanentID].health + '<smol> I 100 </smol><img src="/assets/misc/health-icon.svg" style="width: calc(0.8vw + 0.8vh); margin-top: calc(0.4vw + 0.4vh); margin-right: calc(0.8vw + 0.8vh); transform: skew(14deg);"></img> ';
      }
    }
  );

  rectMode(CENTER);
  imageMode(CENTER);
  angleMode(DEGREES)
  noStroke();

  sourceSansPro = loadFont("/fonts/SourceSansPro-Black.ttf");

  fetch("/api/explosion-types.json")
  .then(response => response.json())
  .then(data => {
    clientData.explosionParticleTypes = data;
  });     

  assetsLoaded["/assets/player/player-base.svg"] = loadImage("/assets/player/player-base.svg");
  assetsLoaded["/assets/player/player-hand.svg"] = loadImage("/assets/player/player-hand.svg");
  assetsLoaded["/assets/weapons/tracer-start.svg"] = loadImage("/assets/weapons/tracer-start.svg");
  assetsLoaded["/assets/weapons/tracer-end.svg"] = loadImage("/assets/weapons/tracer-end.svg");
  assetsLoaded["/assets/weapons/scar_topdown.svg"] = loadImage("/assets/weapons/scar_topdown.svg");
  assetsLoaded["/assets/weapons/vector_topdown.svg"] = loadImage("/assets/weapons/vector_topdown.svg");
  assetsLoaded["/assets/weapons/mk18_topdown.svg"] = loadImage("/assets/weapons/mk18_topdown.svg");
  assetsLoaded["/assets/weapons/ballista_topdown.svg"] = loadImage("/assets/weapons/ballista_topdown.svg");
  assetsLoaded["/assets/weapons/slp_topdown.svg"] = loadImage("/assets/weapons/slp_topdown.svg");
  assetsLoaded["/assets/weapons/509_topdown.svg"] = loadImage("/assets/weapons/509_topdown.svg");
  assetsLoaded["/assets/weapons/fnx_topdown.svg"] = loadImage("/assets/weapons/fnx_topdown.svg");
  assetsLoaded["/assets/weapons/deagle_topdown.svg"] = loadImage("/assets/weapons/deagle_topdown.svg");
  assetsLoaded["/assets/weapons/knife_topdown.svg"] = loadImage("/assets/weapons/knife_topdown.svg");
  assetsLoaded["/assets/weapons/bayonet_topdown.svg"] = loadImage("/assets/weapons/bayonet_topdown.svg");
  assetsLoaded["/assets/weapons/m18_topdown.svg"] = loadImage("/assets/weapons/m18_topdown.svg");
  assetsLoaded["/assets/misc/particle.svg"] = loadImage("/assets/misc/particle.svg");
  assetsLoaded["/assets/weapons/bullet.svg"] = loadImage("assets/weapons/bullet.svg");
  assetsLoaded["/assets/misc/smokeparticle.svg"] = loadImage("/assets/misc/smokeparticle.svg");
  assetsLoaded["/assets/misc/vision-cone.svg"] = loadImage("/assets/misc/vision-cone.svg");
  assetsLoaded["/assets/weapons/cartridge.svg"] = loadImage("/assets/weapons/cartridge.svg");
  assetsLoaded["/assets/environment/point-outline.svg"] = loadImage("/assets/environment/point-outline.svg");
  assetsLoaded["/assets/misc/arrow.svg"] = loadImage("/assets/misc/arrow.svg");
  assetsLoaded["/assets/misc/circle.svg"] = loadImage("/assets/misc/circle.svg");
  assetsLoaded["/assets/audio/guns/scar_fire.mp3"] = new Howl({ src: ["/assets/audio/guns/scar_fire.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/guns/ballista_fire.mp3"] = new Howl({ src: ["/assets/audio/guns/ballista_fire.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/guns/slp_fire.mp3"] = new Howl({ src: ["/assets/audio/guns/slp_fire.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/guns/509_fire.mp3"] = new Howl({ src: ["/assets/audio/guns/509_fire.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/guns/vector_fire.mp3"] = new Howl({ src: ["/assets/audio/guns/vector_fire.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/guns/mk18_fire.mp3"] = new Howl({ src: ["/assets/audio/guns/mk18_fire.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/guns/deagle_fire.mp3"] = new Howl({ src: ["/assets/audio/guns/deagle_fire.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/guns/fnx_fire.mp3"] = new Howl({ src: ["/assets/audio/guns/fnx_fire.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/guns/whoosh.mp3"] = new Howl({ src: ["/assets/audio/guns/whoosh.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/guns/smoke_burst.mp3"] = new Howl({ src: ["/assets/audio/guns/smoke_burst.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/guns/scar_reload.mp3"] = new Howl({ src: ["/assets/audio/guns/scar_reload.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/guns/ballista_reload.mp3"] = new Howl({ src: ["/assets/audio/guns/ballista_reload.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/guns/slp_reload.mp3"] = new Howl({ src: ["/assets/audio/guns/slp_reload.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/guns/509_reload.mp3"] = new Howl({ src: ["/assets/audio/guns/509_reload.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/guns/mk18_reload.mp3"] = new Howl({ src: ["/assets/audio/guns/mk18_reload.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/guns/vector_reload.mp3"] = new Howl({ src: ["/assets/audio/guns/vector_reload.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/guns/deagle_reload.mp3"] = new Howl({ src: ["/assets/audio/guns/deagle_reload.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/impact/metal.mp3"] = new Howl({ src: ["/assets/audio/impact/metal.mp3"], volume: 1 });  
  assetsLoaded["/assets/audio/impact/wood.mp3"] = new Howl({ src: ["/assets/audio/impact/wood.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/impact/stone.mp3"] = new Howl({ src: ["/assets/audio/impact/stone.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/footsteps/step1.mp3"] = new Howl({ src: ["/assets/audio/footsteps/step1.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/footsteps/step2.mp3"] = new Howl({ src: ["/assets/audio/footsteps/step2.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/footsteps/step3.mp3"] = new Howl({ src: ["/assets/audio/footsteps/step3.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/footsteps/step4.mp3"] = new Howl({ src: ["/assets/audio/footsteps/step4.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/footsteps/step5.mp3"] = new Howl({ src: ["/assets/audio/footsteps/step5.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/footsteps/step6.mp3"] = new Howl({ src: ["/assets/audio/footsteps/step6.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/footsteps/step7.mp3"] = new Howl({ src: ["/assets/audio/footsteps/step7.mp3"], volume: 1 });
  assetsLoaded["/assets/audio/footsteps/step8.mp3"] = new Howl({ src: ["/assets/audio/footsteps/step8.mp3"], volume: 1 });

  document.getElementById("play-button").addEventListener("click", function() {requestConnectToGame();});
  
  socket.on("load-world", data => { // first time loading world, right after pressing play
    console.log("world data recieved");
    gameData = data;
    playerBuffer = createGraphics(7300, 4000);
    shadowBuffer = createGraphics(7300, 4000);
    shadowBuffer.pixelDensity(clientData.options.shadowResolution);
    playerBuffer.pixelDensity(clientData.options.gameplayResolution);
    shadowBuffer.imageMode(CENTER);
    shadowBuffer.rectMode(CENTER);
    shadowBuffer.angleMode(DEGREES);
    playerBuffer.imageMode(CENTER);
    playerBuffer.rectMode(CENTER);
    playerBuffer.angleMode(DEGREES);
    permanentID = socket.id;
    assetsLoaded[data.mapData.config["ground-image"]] = loadImage(data.mapData.config["ground-image"]);
    document.getElementById("weapon-selection").style["background-image"] = 'url("/assets/backgrounds/' + gameData.mapData.config['background-src'] + '")';
    document.getElementById("weapon-selection").style["background-color"] = "#00000000";
    for(let i = 0; i < data.mapData.obstacles.length; i++) {
      assetsLoaded[data.mapData.obstacles[i]["display-data"].src] = loadImage(data.mapData.obstacles[i]["display-data"].src);
    }

    assetsAreLoaded = true;
    state = "ingame-weaponselect";
    queuedCameraLocation = {
      x: gameData.players[permanentID].state.position.x,
      y: gameData.players[permanentID].state.position.y,
      z: 2200 + gameData.weapons[gameData.players[permanentID].guns[gameData.players[permanentID].state.activeWeaponIndex]].view,
      targetX: gameData.players[permanentID].state.position.x,
      targetY: gameData.players[permanentID].state.position.y,
      targetZ: 0
    };
    document.getElementById("main-menu").style.display = "none";
    document.getElementById("hud").style.display = "block";
    document.getElementById("main").src = gameData.weapons[data.players[permanentID].guns[0]].images.lootSRC;
    document.getElementById("pistol").src = gameData.weapons[data.players[permanentID].guns[1]].images.lootSRC;
    document.getElementById("melee").src = gameData.weapons[data.players[permanentID].guns[2]].images.lootSRC;
    document.getElementById("grenade").src = gameData.weapons[data.players[permanentID].guns[2]].images.lootSRC;
    updateGunHUD(data);
    updateHUD(data);
    document.getElementById("time-left").textContent = gameData.secondsLeft;
    document.getElementById("healthbar").style.width = ((windowWidth * 0.1) * (gameData.players[permanentID].health / 100)) + ((windowHeight * 0.1) * (gameData.players[permanentID].health / 100)) + "px";
    document.getElementById("healthbar-opposite").style.width = ((windowWidth * 0.1) * -((data.players[permanentID].health / 100) - 1)) + ((windowHeight * 0.1) * -((data.players[permanentID].health / 100) - 1)) + "px";
    document.getElementById("healthbar-opposite").style.right = "calc(16.5vw + 16.5vh - " + ((windowWidth * 0.1) * (-((data.players[permanentID].health / 100) - 1)) + ((windowHeight * 0.1) * -((data.players[permanentID].health / 100) - 1))) + "px)" ;
    document.getElementById("healthbar-text").innerHTML = gameData.players[permanentID].health + '<smol> I 100 </smol><img src="/assets/misc/health-icon.svg" style="width: calc(0.8vw + 0.8vh); margin-top: calc(0.4vw + 0.4vh); margin-right: calc(0.8vw + 0.8vh); transform: skew(14deg);"></img> ';
    document.getElementById("defaultCanvas0").style.display = "block";
    document.getElementById("mapname").textContent = "Map: " + gameData.mapData.config["map-name"];
    document.getElementById("fps").textContent = "FPS: " + round(frameRate());
    document.getElementById("pingcount").textContent = "Ping: " + gameData.players[permanentID].state.ping;
    updateDebugMenu = setInterval(function() { if(debug) { document.getElementById("object-count").textContent = gameData.players[permanentID].state.objectRenderList.length + gameData.bullets.length + gameData.particles.length + gameData.users.length + " objects being rendered"; document.getElementById("fps").textContent = "FPS: " + round(frameRate());     document.getElementById("pingcount").textContent = "Ping: " + gameData.players[permanentID].state.ping; } }, 1500);
    gameData.selectedClass = "assault";
    ping = setInterval(function() {
      const start = Date.now();
    
      socket.emit("ping", {time: start});
    }, 1000);
    switch(gameData.players[permanentID].team) {
      case "blue":
        document.getElementById("blue-score").textContent = gameData.currentRoundScore.blue;
        document.getElementById("red-score").textContent = gameData.currentRoundScore.red;
      break;
      case "red":
        document.getElementById("red-score").textContent = gameData.currentRoundScore.blue;
        document.getElementById("blue-score").textContent = gameData.currentRoundScore.red;
      break;
    }
  });
  
  socket.on("world-update", data => { // LITERALLY EVERY "50" MILLISECONDS !!
    gameData.players = data.players,
    gameData.point = data.point,
    gameData.usersOnline = data.usersOnline,
    gameData.secondsLeft = data.secondsLeft,
    gameData.users = data.users;
    gameData.currentRoundScore = data.currentRoundScore;
    gameData.certificate = data.certificate;
    gameData.queuedSounds = data.queuedSounds;
    gameData.timeStamp = Date.now();
    gameData.lastTickDelay = data.lastTickDelay;
    gameData.scoreboard = data.scoreboard;
    gameData.shouldUpdateScoreboard = data.shouldUpdateScoreboard;
    const timestamp = secondsToTimestamp(gameData.secondsLeft);
    if(document.getElementById("time-left").textContent != timestamp) {
      document.getElementById("time-left").textContent = timestamp;
    }
    if(data.secondsLeft < 1 && ("NEXT GAME IN " + (data.secondsLeft + 10) + "...") != document.getElementById("end-of-game-nextgame-start-countdown").textContent) {
      document.getElementById("end-of-game-nextgame-start-countdown").textContent = "NEXT GAME IN " + (data.secondsLeft + 10) + "...";
    }
    if(data.shouldUpdateScoreboard) updateScoreboard(gameData);
    const currentTime = Date.now() / 1;
    for(let i = 0; i < data.grenades.length; i++) {
      gameData.grenades.push(data.grenades[i]);
      gameData.grenades[gameData.grenades.length - 1].timeStamp = currentTime;
      gameData.grenades[gameData.grenades.length - 1].throwLength = Math.ceil(Math.sqrt(gameData.grenades[gameData.grenades.length - 1].throwLength));
      gameData.grenades[gameData.grenades.length - 1].hasExploded = false;
      gameData.grenades[gameData.grenades.length - 1].explosionType = gameData.weapons[gameData.players[data.grenades[i].player].guns[gameData.players[data.grenades[i].player].state.activeWeaponIndex]].particleType;
      gameData.grenades[gameData.grenades.length - 1].timeLeft = 20;    }
    for(let i = 0; i < data.bullets.length; i++) {
      let angle = Math.atan2(data.bullets[i].collisionSurface[0].y - data.bullets[i].collisionSurface[1].y, data.bullets[i].collisionSurface[0].x - data.bullets[i].collisionSurface[1].x) + Math.PI / 2;
      angle = angle + (angle - data.bullets[i].angle * Math.PI / 180);
      gameData.bullets.push(data.bullets[i]);
      gameData.bullets[gameData.bullets.length - 1].timeStamp = currentTime;
      gameData.bullets[gameData.bullets.length - 1].tracerLength = Math.ceil(Math.sqrt(gameData.bullets[gameData.bullets.length - 1].tracerLength));
      gameData.bullets[gameData.bullets.length - 1].hasPlayedSound = false;
      clientData.lastShotTimestamps[data.bullets[i].player] = Date.now() / 1;
      if(data.bullets[i].timeLeft > 0 && clientData.options.impactParticles) {
        gameData.particles.push(
          {
            position: { x: data.bullets[i].coordinates.finish.x, y: data.bullets[i].coordinates.finish.y },
            rotation: Math.random() * 360,
            angle: angle,
            colour: data.bullets[i].collisionSurface[0].colour,
            opacity: 250,
            src: '/assets/misc/particle.svg',
            size: 100,
            tracerLength: data.bullets[i].tracerLength,
            type: 'residue',
            timeStamp: currentTime
          }
        );
      } 
      if(data.bullets[i].shouldEjectCartridge) {
        gameData.particles.push(
          {
            position: {x: data.bullets[i].coordinates.start.x + Math.cos((data.bullets[i].angle * Math.PI / 180) + Math.PI) * 165, y: data.bullets[i].coordinates.start.y + Math.sin((data.bullets[i].angle * Math.PI / 180) + Math.PI) * 155},
            rotation: data.bullets[i].angle * Math.PI / 180 + (Math.random() - 0.5) / 2 - Math.PI / 2,
            angle: data.bullets[i].angle * Math.PI / 180 + (Math.random() - 0.5) / 2 - Math.PI / 2,
            colour: "none",
            opacity: 250,
            src: "/assets/weapons/cartridge.svg",
            size: 100,
            type: "cartridge",
            timeStamp: currentTime
          }
        );
      }
    }
    for(let i = 0; i < data.particles.length; i++) {
      gameData.particles.push(data.particles[i]);
      gameData.particles[gameData.particles.length - 1].timeStamp = currentTime;
    }
    for(let i = 0; i < gameData.queuedSounds.length; i++) {
      assetsLoaded[gameData.queuedSounds[i].path].volume(0);
      if((0.35 - Math.sqrt(squaredDist(gameData.players[permanentID].state.position, gameData.queuedSounds[i].origin)) / 15000) >= 0) {
        assetsLoaded[gameData.queuedSounds[i].path].volume(0.35 - (Math.sqrt(squaredDist(gameData.players[permanentID].state.position, gameData.queuedSounds[i].origin)) / 15000));
      }
      assetsLoaded[gameData.queuedSounds[i].path].play();
    }
    if(data.shouldUpdateUI) {
      updateGunHUD(gameData);
      updateHUD(data);
    }
  });
}

function draw() {
  //try {
    displayWorld();
  //}
  //catch {}
}
