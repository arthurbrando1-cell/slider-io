// ===== UI SLITERZ =====

const lobby = document.getElementById("lobby")
const panel = document.getElementById("panel")

// criar containers
const screens = {}

function createScreen(id, html){
  const div = document.createElement("div")
  div.id = id
  div.style.display = "none"
  div.innerHTML = html
  panel.appendChild(div)
  screens[id] = div
}

// ===== TELAS =====

// LOJA
createScreen("shopScreen", `
  <h2>🛒 Loja</h2>
  <p>Moedas: <span id="coins">0</span></p>
  <button onclick="buyItem('speed',50)">+ Velocidade (50)</button><br><br>
  <button onclick="buyItem('boost',100)">Boost melhor (100)</button><br><br>
  <button onclick="back()">⬅ Voltar</button>
`)

// SKINS
createScreen("skinScreen", `
  <h2>🎨 Skins</h2>
  <p>Skin atual:</p>
  <div id="skinPreview" style="height:40px;background:#4cff87;border-radius:20px"></div><br>
  <button onclick="changeSkin()">Trocar cor</button><br><br>
  <button onclick="back()">⬅ Voltar</button>
`)

// CONFIG
createScreen("configScreen", `
  <h2>⚙️ Configurações</h2>

  <label>
    <input type="checkbox" id="bgToggle" checked>
    Mostrar fundo
  </label><br><br>

  <label>
    Zoom da câmera
    <input type="range" min="0.5" max="1.5" step="0.1" id="zoom">
  </label><br><br>

  <button onclick="saveConfig()">Salvar</button><br><br>
  <button onclick="back()">⬅ Voltar</button>
`)

// ===== FUNÇÕES =====

window.openScreen = function(id){
  for(const k in screens){
    screens[k].style.display = "none"
  }
  screens[id].style.display = "block"
}

// voltar
window.back = function(){
  for(const k in screens){
    screens[k].style.display = "none"
  }
}

// LOJA
let coins = Number(localStorage.getItem("coins")||0)
document.getElementById("coins")?.innerText = coins

window.buyItem = function(type,cost){
  if(coins < cost){
    alert("Sem moedas 😭")
    return
  }
  coins -= cost
  localStorage.setItem("coins",coins)
  document.getElementById("coins").innerText = coins
  alert("Comprado: "+type)
}

// SKIN
window.changeSkin = function(){
  const c = `hsl(${Math.random()*360},80%,60%)`
  document.getElementById("skinPreview").style.background = c
  localStorage.setItem("skin",c)
}

// CONFIG
window.saveConfig = function(){
  localStorage.setItem("showBg", document.getElementById("bgToggle").checked)
  localStorage.setItem("zoom", document.getElementById("zoom").value)
  alert("Config salva ✔")
}
