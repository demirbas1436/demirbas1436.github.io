const backgroundMusic = new Audio("music/Alpha.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5; // Ses seviyesini ayarlayabilirsin
let musicStarted = false;

const boxBallSound = new Audio("music/box_ball_getendthrow.mp3");
const successSound = new Audio("music/dogru_gecis.mp3");
const errorSound = new Audio("music/error.mp3");
const labelingSound = new Audio("music/etiketleme.mp3");





// Canvas ve bağlam
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Resimleri yükle
const playerImg = new Image();
playerImg.src = "assets/karakter.png";

const machineImg = new Image();
machineImg.src = "assets/makina.png";

const boxImg = new Image();
boxImg.src = "assets/ball.png";  // Kutu resmi

const emptyBoxImg = new Image();
emptyBoxImg.src = "assets/box.png";  // Empty Box Maker kutusu için

const tableMachineImg = new Image();
tableMachineImg.src = "assets/table_machine.png";

const inputCheckboxImg = new Image();
inputCheckboxImg.src = "assets/inputchexbox.png";

const itemsMachineImg = new Image();
itemsMachineImg.src = "assets/items_machine.png";

const deliveryMachineImg = new Image();
deliveryMachineImg.src = "assets/delivery_machine.png";

const destroyedMachineImg = new Image();
destroyedMachineImg.src = "assets/destroyed_machine.png";

const protectMachineImg = new Image();
protectMachineImg.src = "assets/protect_machine.png";




let placedBoxes = []; // Packing Table üzerinde bırakılan kutular
let deliveredBoxes = [];
let incineratedBoxes = [];
let score = 0;
let isLabeling = false;  // Etiketleme işlemi aktif mi
let labelingTimer = null;



// Oyuncu karakter
let player = {
  x: 0,
  y: 0,
  width: 50,
  height: 70,
  speed: 3
};

// Makineler
let machines = [
  { x: 100, y: 450, width: 40, height: 40, label: "Items 1" },
  { x: 100, y: 580, width: 40, height: 40, label: "Items 2" },
  { x: 100, y: 250, width: 100, height: 100, label: "Fragile Wrapping" },
  { x: 100, y: 50, width: 100, height: 100, label: "Packing Table" },

  { x: 550, y: 80, width: 100, height: 100, label: "Empty Box Maker 1" },
  { x: 800, y: 80, width: 100, height: 100, label: "Empty Box Maker 2" },

  { x: 500, y: 550, width: 100, height: 100, label: "Shipping Label" },
  { x: 500, y: 320, width: 100, height: 100, label: "Delivery Station" },
  { x: 750, y: 320, width: 100, height: 100, label: "Incinerator" }
];

// Konveyör bandı koordinatları
let conveyors = [{ x: 650, y: 100, width: 150, height: 20 }];
conveyors.push({ x: 140, y: 460, width: 10, height: 120 });
// Delivery Station → Incinerator yönünde yatay bant
conveyors.push({ x: 600, y: 370, width: 150, height: 20 });

// Delivery Station → sağ alt köşe yönünde çapraz benzeri bant (yaklaşık)
conveyors.push({ x: 600, y: 390, width: 200, height: 20, rotate: 45 }); // opsiyonel döndürme için



// Birkaç kutu ekleyelim
let boxes = [
  { x: 650, y: 90, width: 40, height: 40, speed: 1 },
  { x: 700, y: 90, width: 40, height: 40, speed: 1 },
  { x: 750, y: 90, width: 40, height: 40, speed: 1 }
];
let itemsBoxes = [
  { x: 120, y: 400, width: 40, height: 40, speed: 1, startY: 460, type: "ball" },
  { x: 120, y: 440, width: 40, height: 40, speed: 1, startY: 440, type: "ball" }
];






// 🎮 **Oyuncunun hareketini sağlayalım**
let keys = {};

document.addEventListener("keydown", (e) => {
  if (!musicStarted && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    backgroundMusic.play();
    musicStarted = true;
  }
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});


// Çarpışma kontrolü fonksiyonu
function isColliding(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

// Oyuncuyu güncelle (çarpışma kontrolü eklendi)
function updatePlayer() {
  if (isLabeling) return; // Etiketleme sırasında hareket etmeyi engelle

  let tempPlayer = { ...player };

  if (keys["ArrowUp"] || keys["w"] || keys["W"]) tempPlayer.y -= player.speed;
  if (keys["ArrowDown"] || keys["s"] || keys["S"]) tempPlayer.y += player.speed;
  if (keys["ArrowLeft"] || keys["a"] || keys["A"]) tempPlayer.x -= player.speed;
  if (keys["ArrowRight"] || keys["d"] || keys["D"]) tempPlayer.x += player.speed;
  // Sınır kontrolü
  tempPlayer.x = Math.max(0, Math.min(canvas.width - player.width, tempPlayer.x));
  tempPlayer.y = Math.max(0, Math.min(canvas.height - player.height, tempPlayer.y));
  console.log(tempPlayer.x)
  // Makine çarpışma kontrolü
  let collision = machines.some(machine => isColliding(tempPlayer, machine));
  if (!collision) {
    player.x = tempPlayer.x;
    player.y = tempPlayer.y;
  }
}

// Kutuları güncelle
function updateBoxes() {
  boxes.forEach(box => {
    box.x += box.speed;
    if (box.x > 800) box.x = 650; // Döngüsel hareket
  });
}

function updateItemsBoxes() {
  itemsBoxes.forEach(box => {
    box.y += box.speed;
    if (box.y > 580) box.y = box.startY;
  });
}

function updateDeliveredBoxes() {
  deliveredBoxes.forEach(box => {
    box.x += box.speedX;
    box.y += box.speedY;
  });
  deliveredBoxes = deliveredBoxes.filter(box => box.x < canvas.width && box.y < canvas.height);
}

function updateIncineratedBoxes() {
  incineratedBoxes.forEach(box => {
    box.x += box.speedX;
    box.y += box.speedY;
  });
  incineratedBoxes = incineratedBoxes.filter(box => box.x > 0 && box.y > 0);
}
function drawDeliveredBoxes() {
  deliveredBoxes.forEach(box => {
    ctx.drawImage(emptyBoxImg, box.x, box.y, box.width, box.height);
    if (box.contains === "ball") {
      ctx.drawImage(boxImg, box.x + 5, box.y + 5, box.width - 10, box.height - 10);
    }
  });
}

function drawIncineratedBoxes() {
  incineratedBoxes.forEach(box => {
    ctx.drawImage(emptyBoxImg, box.x, box.y, box.width, box.height);
    if (box.contains === "ball") {
      ctx.drawImage(boxImg, box.x + 5, box.y + 5, box.width - 10, box.height - 10);
    }
  });
}



// Konveyör ve kutuları çiz
function drawConveyors() {
  conveyors.forEach(conv => {
    ctx.save();
    ctx.fillStyle = "black";

    if (conv.rotate) {
      // Dönüş yapılacaksa önce konumlandır sonra döndür
      ctx.translate(conv.x, conv.y);
      ctx.rotate((conv.rotate * Math.PI) / 180); // dereceyi radyana çevir
      ctx.fillRect(0, 0, conv.width, conv.height);
    } else {
      ctx.fillRect(conv.x, conv.y, conv.width, conv.height);
    }

    ctx.restore();
  });
}




function drawBoxes() {
  boxes.forEach(box => {
    ctx.drawImage(emptyBoxImg, box.x, box.y, box.width, box.height);
  });
}

function drawItemsBoxes() {
  itemsBoxes.forEach(box => {
    ctx.drawImage(boxImg, box.x, box.y, box.width, box.height);
  });
}



function drawHeldBox() {
  if (heldBox) {
    let imgToUse = heldBox.source === "item" ? boxImg : emptyBoxImg;
    ctx.drawImage(imgToUse, player.x, player.y - 50, heldBox.width, heldBox.height);
  }
}



// Oyuncunun makinenin "yanında" olup olmadığını kontrol eden fonksiyon
function isNear(machine, player, distance = 50) {
  return (
      player.x + player.width > machine.x - distance &&
      player.x < machine.x + machine.width + distance &&
      player.y + player.height > machine.y - distance &&
      player.y < machine.y + machine.height + distance
  );
}


let heldBox = null;  // Oyuncunun tuttuğu kutu

document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "W", "A", "S", "D"].includes(e.key)) {
    e.preventDefault();
  }
  keys[e.key] = true;

  if (e.key === "E" && !heldBox) {
  // 1. Empty Box Maker kutularına bak
  let boxIndex = boxes.findIndex(box => isColliding(player, box));
  if (boxIndex !== -1) {
    heldBox = { ...boxes.splice(boxIndex, 1)[0], source: "empty" };
    boxBallSound.play();

  } else {
    // 2. Items kutularına bak
    let itemIndex = itemsBoxes.findIndex(box => isNear(box, player, 40));
    if (itemIndex !== -1) {
      const item = itemsBoxes.splice(itemIndex, 1)[0];
      heldBox = { ...item, source: "item" };
      boxBallSound.play();

    } else {
      // 3. Packing Table'daki dolu kutuya bak
      const fullBox = placedBoxes.find(b => isNear(b, player, 40) && b.contains);
      if (fullBox) {
        heldBox = {
          ...fullBox,
          source: "full",
          contains: fullBox.contains,
          labeled: fullBox.labeled || false
        };
        placedBoxes = placedBoxes.filter(b => b !== fullBox);
        console.log("Dolu kutu alındı:", heldBox);

      } else {
        // 4. Makinelerle etkileşim
        let currentMachine = machines.find(machine => getDistance(player, machine) < 50);

        if (currentMachine) {
          // a. Packing Table’a boş kutu bırakma
          if (currentMachine.label === "Packing Table") {
            boxes.push({
              x: currentMachine.x + 20,
              y: currentMachine.y + 20,
              width: 40,
              height: 40,
              speed: 1
            });
            heldBox = null;

          // b. Shipping Label → etiketleme
          } else if (currentMachine.label === "Shipping Label" && heldBox && heldBox.source === "full") {
            heldBox.labeled = true;
            console.log("Kutu etiketlendi");

          // c. Delivery Station → kontrol
          } else if (currentMachine.label === "Delivery Station" && heldBox && heldBox.source === "full") {
            if (heldBox.labeled) {
              deliveredBoxes.push({
                ...heldBox,
                x: currentMachine.x,
                y: currentMachine.y,
                speedX: 1,
                speedY: 1
              });
              score++;
              console.log("Kutu teslim edildi");
            } else {
              incineratedBoxes.push({
                ...heldBox,
                x: currentMachine.x,
                y: currentMachine.y,
                speedX: -1,
                speedY: -1
              });
              console.log("Etiketsiz kutu yakıldı!");
            }
            heldBox = null;

          // d. Incinerator → kutuyu yok et
          } else if (currentMachine.label === "Incinerator") {
            heldBox = null;
            errorSound.play();
            console.log("Kutu yakıldı.");
          }
        }
      }
    }
  }
}



  if (e.key === "Q" && heldBox) {
  const packingTable = machines.find(m => m.label === "Packing Table");
  const shippingLabel = machines.find(m => m.label === "Shipping Label");
  const deliveryStation = machines.find(m => m.label === "Delivery Station");

  // 1. Packing Table'a kutu bırakma
  if (isNear(packingTable, player, 50)) {
    if (heldBox.source === "empty") {
      placedBoxes.push({
        x: packingTable.x + 20,
        y: packingTable.y + 20,
        width: heldBox.width,
        height: heldBox.height,
        contains: null
      });
      heldBox = null;
      console.log("Boş kutu bırakıldı.");
    } else if (heldBox.source === "item") {
      const targetBox = placedBoxes.find(b => isNear(b, player, 60) && !b.contains);

      if (targetBox) {
        targetBox.contains = "ball";
        heldBox = null;
        console.log("Top kutuya bırakıldı.");
      } else {
        console.log("Yakında boş kutu bulunamadı.");
      }
    }
  }

  // 2. Shipping Label'da etiketleme başlat
  else if (isNear(shippingLabel, player, 50) && heldBox.source === "full") {
    isLabeling = true;
    const boxToLabel = { ...heldBox };
    heldBox = null;
    console.log("Etiketleme başladı...");
    labelingSound.play();

    labelingTimer = setTimeout(() => {
      boxToLabel.labeled = true;
      heldBox = boxToLabel;
      isLabeling = false;
      console.log("Etiketleme tamamlandı!");
    }, 2000);
  }

  // 3. Delivery Station'a kutu bırakma
  else if (isNear(deliveryStation, player, 50) && heldBox.source === "full") {
    if (heldBox.labeled) {
      deliveredBoxes.push({
        ...heldBox,
        x: deliveryStation.x,
        y: deliveryStation.y,
        speedX: 1,
        speedY: 1
      });
      successSound.play();

      score++;
      console.log("Kutu doğru şekilde teslim edildi.");
    } else {
      incineratedBoxes.push({
        ...heldBox,
        x: deliveryStation.x,
        y: deliveryStation.y,
        speedX: 2,   // ✅ sağa doğru yatay gitsin
        speedY: 0
      });

      errorSound.play();
      console.log("Etiketsiz kutu yakılmak üzere gönderildi.");
    }
    heldBox = null;
  }
}


  
  
  
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});



function drawPlacedBoxes() {
  placedBoxes.forEach(box => {
    ctx.drawImage(emptyBoxImg, box.x, box.y, box.width, box.height);
    if (box.contains === "ball") {
      ctx.drawImage(boxImg, box.x + 5, box.y + 5, box.width - 10, box.height - 10);
    }
  });
}



// Oyuncunun elindeki kutuyu çiz
function drawHeldBox() {
  if (heldBox) {
    const imgToUse = heldBox.source === "item" ? boxImg : emptyBoxImg;
    ctx.drawImage(imgToUse, player.x, player.y - 50, heldBox.width, heldBox.height);
  }
}


// Oyuncu ve makineleri çiz
function drawMachines() {
  machines.forEach(machine => {
    let img = machineImg; // varsayılan

    switch (machine.label) {
      case "Packing Table":
        img = tableMachineImg;
        break;
      case "Empty Box Maker 1":
      case "Empty Box Maker 2":
        img = inputCheckboxImg;
        break;
      case "Items 1":
      case "Items 2":
        img = itemsMachineImg;
        break;
      case "Shipping Label":
        img = protectMachineImg;
        break;
      case "Delivery Station":
        img = deliveryMachineImg;
        break;
      case "Incinerator":
        img = destroyedMachineImg;
        break;
      // Fragile Wrapping default kalır
    }

    ctx.drawImage(img, machine.x, machine.y, machine.width, machine.height);
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(machine.label, machine.x + machine.width / 2, machine.y + machine.height + 20);
  });
}


function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

// 🔄 **Oyun döngüsüne eklemeleri yap**
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  

  drawConveyors();     // 🔹 1. En arkada: bantlar
  drawBoxes();         // 🔹 2. Empty box kutuları
  drawItemsBoxes();    // 🔹 3. Items kutuları
  drawMachines();      // 🔹 4. Üzerine makineleri çiz
  drawPlacedBoxes();   // Packing Table'daki kutuları çiz
  drawPlayer();        // 🔹 5. Oyuncu
  drawHeldBox();       // 🔹 6. Oyuncunun taşıdığı kutu
  drawDeliveredBoxes();
  drawIncineratedBoxes();
  if (isLabeling) {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Etiketleniyor...", canvas.width / 2, canvas.height / 2);
}


  
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.textAlign = "right";
  ctx.fillText("Score: " + score, canvas.width - 20, 110);
  ctx.fillText("Move: Arrow Keys", canvas.width - 20, 30);
  ctx.fillText("Interact: E", canvas.width - 20, 50);
  ctx.fillText("Throw: Q", canvas.width - 20, 70);
}

// 🔄 **Oyun döngüsüne oyuncu ve kutuları ekle**
function gameLoop() {
  updatePlayer(); // Oyuncu hareketini güncelle
  updateBoxes(); // Kutuların hareketini güncelle
  updateItemsBoxes();
  updateDeliveredBoxes();
  updateIncineratedBoxes();
  draw(); // Çizimi yap
  requestAnimationFrame(gameLoop);
  
}

// 📥 **Resimler yüklendikten sonra oyunu başlat**
let assetsLoaded = 0;
function assetLoaded() {
  assetsLoaded++;
  if (assetsLoaded === 4) {
    // 🚚 Sonsuz boş kutu üretimi
    setInterval(() => {
      boxes.push({
        x: 650,
        y: 90,
        width: 40,
        height: 40,
        speed: 1
      });
    }, 10000); // her 3 saniyede bir kutu

    // ⚽ Sonsuz top üretimi
    setInterval(() => {
      itemsBoxes.push({
        x: 120,
        y: 400,
        width: 40,
        height: 40,
        speed: 1,
        startY: 460,
        type: "ball"
      });
    }, 10000); // her 4 saniyede bir top

    gameLoop(); // oyun başlasın
  }
}


playerImg.onload = assetLoaded;
machineImg.onload = assetLoaded;
boxImg.onload = assetLoaded;
emptyBoxImg.onload = assetLoaded;