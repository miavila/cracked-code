let fila = "fila1"
let posResults = ''
let numeros = [0,1,2,3,4,5,6,7,8,9]
let secret = []

start()
secret = JSON.parse(localStorage.getItem('secret'))


function start () {
    const lastPlayed = Date.now()
	// Fecha actual
    let timestamp = Date.now()
	let date = new Date(timestamp)
	//let date = new Date('Jul 16 2022')
	let diaActual = date.getDate()

    // Estado de la partida
    let estadoPartida = JSON.parse(localStorage.getItem('status'))

    // Fecha ultima partida
	let ultimaPartida = JSON.parse(localStorage.getItem('lastPlayed'))
    let lastDate = new Date(ultimaPartida)
    //let lastDate = new Date(2022/01/15)
    let ultimoDia = lastDate.getDate()
    let numeroClave = numeros.sort(()=>Math.random() -0.5)
    secret = numeroClave.splice(0,3)
    //secret = [0,1,2]

    if (diaActual !=ultimoDia ) {        
        localStorage.clear()
        localStorage.setItem("lastPlayed", JSON.stringify(lastPlayed))
        localStorage.setItem("secret", JSON.stringify(secret))
        localStorage.setItem("status", JSON.stringify("gameRun"))
    } else if (diaActual == ultimoDia && estadoPartida == "gameEnd")  {
        console.log(diaActual != ultimoDia)
        console.log(estadoPartida !="gameEnd")
        nextDay()
    } else if (JSON.parse(localStorage.getItem('secret')) == null) {
        localStorage.setItem("lastPlayed", JSON.stringify(lastPlayed))
        localStorage.setItem("secret", JSON.stringify(secret))
        localStorage.setItem("status", JSON.stringify("gameRun"))
    } else {
        localStorage.setItem("status", JSON.stringify("gameRun"))
        getInputs()        
    }
}

// Registra los nhumeros entrados mediante los botones "botones numeros"
function enterNumber (number) {
    if (JSON.parse(localStorage.getItem('posResults')) == null)  {
        posResults = 1
    } else {
        posResults = JSON.parse(localStorage.getItem('posResults'))
    }
    fila = "fila"+posResults

    let elem = document.getElementById(fila).getElementsByTagName('input');
    if (elem[0].value == '' ) {
        elem[0].value = number 
    } else if (elem[0].value != '' && elem[1].value == '') {
        elem[1].value = number
    } else if (elem[0].value != '' && elem[1].value != '' && elem[2].value == '') {
        elem[2].value = number
    }    
}

// Borra los nhumeros entrados mediante los botones "borrar"
function borrar (){
    let elem = document.getElementById(fila).getElementsByTagName('input');
    if (elem[2].value != '') {
        elem[2].value = ''
    } else if (elem[1].value !='') {
        elem[1].value =''
    } else if (elem[0].value = '') {
        elem[0].value = ''
    }
}

// Pasa los numeros de la fila a comprovar resultado "enter"
function registerNumber(){
    let elem = document.getElementById(fila).getElementsByTagName('input');
    let entrada = []
    if(elem[0].value  != '' && elem[1].value  != '' && elem[2].value  != '') {
        entrada.push(elem[0].value, elem[1].value, elem[2].value)    
        result(entrada)
        saveInput()
        localStorage.setItem("posResults", JSON.stringify(posResults))
    } 
}

// Verifica los resultados fila entrada Bull/Cows
function result(entrada) {
    posResults = posResults+1
    let bulls = 0;
    let cows = 0;
    let elem = document.getElementById(fila).getElementsByTagName('input');
    let bullsResult = document.getElementById(fila).getElementsByClassName("bulls")[0];
    let cowsResult = document.getElementById(fila).getElementsByClassName("cows")[0];

    const count = Array(10).fill(0);
    for (let i = 0; i < secret.length; i++) {
        if (secret[i] == entrada[i]) {
            bulls++;
        } else {
            if (count[secret[i] - '0'] < 0) cows++;
            if (count[entrada[i] - '0'] > 0) cows++;
            count[secret[i] - '0']++;
            count[entrada[i] - '0']--;
        }
    }
    if (bulls == 3) {
        elem[0].setAttribute("class","ok");
        elem[1].setAttribute("class","ok");
        elem[2].setAttribute("class","ok");
        popupOk()
        
    } else {
        elem[0].setAttribute("class","nook");
        elem[1].setAttribute("class","nook");
        elem[2].setAttribute("class","nook");
    }

    if (posResults == "7" && bulls != 3) {
        popupNoOk()
    }

    bullsResult.value = bulls;
    cowsResult.value = cows;    
    fila = "fila"+posResults
}

// Gruardar valores Localstorage
function saveInput(){
    let elem = document.getElementsByTagName('input');
    let allInputs =[]; 
    let i = 0
    for(i=0; i<elem.length; i++){
      allInputs.push(elem[i].value)
    }
    localStorage.setItem("allInputs", JSON.stringify(allInputs))
} 

// Reuperar valores Localstorage
function getInputs(){
    let result = JSON.parse(localStorage.getItem('result'))
    let resultInputs = JSON.parse(localStorage.getItem('allInputs'))
    if (resultInputs != 'null' && result =='win') {        
        resultInputs = resultInputs.filter(Boolean)
        for(let j=0; j<(resultInputs.length-5); j++){
            let numero =document.getElementsByTagName('input')[j];
            numero.value = resultInputs[j]
            if (numero.value != '' && numero.classList.contains('number')) {
                numero.setAttribute("class","nook");  
            } 
        }
        for(let j=(resultInputs.length-5); j<(resultInputs.length); j++){
            let numero =document.getElementsByTagName('input')[j];
            numero.value = resultInputs[j]
            if (numero.value != '' && numero.classList.contains('number')) {
                numero.setAttribute("class","ok");  
            } 
        }
    } 
    else {
        for(let j=0; j<(resultInputs.length); j++){
            let numero =document.getElementsByTagName('input')[j];
            numero.value = resultInputs[j]
            if (numero.value != '' && numero.classList.contains('number')) {
                numero.setAttribute("class","nook");  
            } 
        }
    }
} 

// Partida acabada esperar proximo dia
function nextDay () {
    getInputs()
    let result = JSON.parse(localStorage.getItem('result'))
    if (result == "win") {
        popupOk()
    } else {
        popupNoOk()
    }
}

// Popup no Ok
function popupNoOk () {
    countTime();
    $('#titleEsperar').html('Intentalo mañana');
    $('#esperar').html('¡Código no correcto!<br>Tiempo de espera:');
    $('#popupManana').modal('toggle');
    localStorage.setItem("status", JSON.stringify("gameEnd"))
}

// :happy Popup Ok
function popupOk () {
    countTime();
    if (JSON.parse(localStorage.getItem('posResults')) == null)  {
        posResults = 1
        console.log(posResults)
    } else {
        posResults = JSON.parse(localStorage.getItem('posResults'))
    }
    $('#result').html('Próximo número:');
    $('#posicion').html('Código encontrado en el '+'<b>'+(posResults)+'</b>'+" intento");
    if (posResults ==1 ) {
        $('#imgPosition').html('<hr>🟩🟩🟩🟩🟧<hr>⬜⬜⬜🟩🟧<hr>⬜⬜⬜🟩🟧<hr>⬜⬜⬜🟩🟧<hr>⬜⬜⬜🟩🟧<hr>⬜⬜⬜🟩🟧')
    } else if (posResults ==2 ) {
        $('#imgPosition').html('<hr>⬜⬜⬜🟩🟧<hr>🟩🟩🟩🟩🟧<hr>⬜⬜⬜🟩🟧<hr>⬜⬜⬜🟩🟧<hr>⬜⬜⬜🟩🟧<hr>⬜⬜⬜🟩🟧')
    } else if (posResults ==3 ) {
        $('#imgPosition').html('<hr>⬜⬜⬜🟩🟧<hr>⬜⬜⬜🟩🟧<hr>🟩🟩🟩🟩🟧<hr>⬜⬜⬜🟩🟧<hr>⬜⬜⬜🟩🟧<hr>⬜⬜⬜🟩🟧')
    } else if (posResults ==4 ) {
        $('#imgPosition').html('<hr>⬜⬜⬜🟩🟧<hr>⬜⬜⬜🟩🟧<hr>⬜⬜⬜🟩🟧<hr>🟩🟩🟩🟩🟧<hr>⬜⬜⬜🟩🟧<hr>⬜⬜⬜🟩🟧')
    } else if (posResults ==5 ) {
        $('#imgPosition').html('<hr>⬜⬜⬜🟩🟧<hr>⬜⬜⬜🟩🟧<hr>⬜⬜⬜🟩🟧<hr>⬜⬜⬜🟩🟧<hr>🟩🟩🟩🟩🟧<hr>⬜⬜⬜🟩🟧')
    } else if (posResults ==6 ) {
        $('#imgPosition').html('<hr>⬜⬜⬜🟩🟧<hr>⬜⬜⬜🟩🟧<hr>⬜⬜⬜🟩🟧<hr>⬜⬜⬜🟩🟧<hr>⬜⬜⬜🟩🟧<hr>🟩🟩🟩🟩🟧')
    }

    $('#shareButton').html('<button type="button" class="btn btn-lg shareButton" onclick="share()">COMPRATIR RESULTADO</button>')
    $('#popup').modal('toggle');
    localStorage.setItem("status", JSON.stringify("gameEnd"))
    localStorage.setItem("result", JSON.stringify("win"))
}

function share() {
    let posResults = JSON.parse(localStorage.getItem('posResults'))
    let posicion =''
    console.log(posResults)
    if (posResults ==1 ) {
        posicion = "Código encontrado en el "+posResults+" intento %0a🟩🟩🟩🟩🟧%0a⬜⬜⬜🟩🟧%0a⬜⬜⬜🟩🟧%0a⬜⬜⬜🟩🟧%0a⬜⬜⬜🟩🟧%0a⬜⬜⬜🟩🟧%0a https://akanweb.com/vitle %0a %23vitle %23wordle"
    } else if (posResults == 2) {
        posicion = "Código encontrado en el "+posResults+" intento %0a⬜⬜⬜🟩🟧%0a🟩🟩🟩🟩🟧%0a⬜⬜⬜🟩🟧%0a⬜⬜⬜🟩🟧%0a⬜⬜⬜🟩🟧%0a⬜⬜⬜🟩🟧%0a https://akanweb.com/vitle %0a %23vitle %23wordle"
    } else if (posResults == 3) {
        posicion = "Código encontrado en el "+posResults+" intento %0a⬜⬜⬜🟩🟧%0a⬜⬜⬜🟩🟧%0a🟩🟩🟩🟩🟧%0a⬜⬜⬜🟩🟧%0a⬜⬜⬜🟩🟧%0a⬜⬜⬜🟩🟧%0a https://akanweb.com/vitle %0a %23vitle %23wordle"
    } else if (posResults ==4) {
        posicion = "Código encontrado en el "+posResults+" intento %0a⬜⬜⬜🟩🟧%0a⬜⬜⬜🟩🟧%0a⬜⬜⬜🟩🟧%0a🟩🟩🟩🟩🟧%0a⬜⬜⬜🟩🟧%0a⬜⬜⬜🟩🟧%0a https://akanweb.com/vitle %0a %23vitle %23wordle"
    } else if (posResults ==5) {
        posicion = "Código encontrado en el "+posResults+" intento %0a⬜⬜⬜🟩🟧%0a⬜⬜⬜🟩🟧%0a⬜⬜⬜🟩🟧%0a⬜⬜⬜🟩🟧%0a🟩🟩🟩🟩🟧%0a⬜⬜⬜🟩🟧%0a https://akanweb.com/vitle %0a %23vitle %23wordle"
    } else if (posResults ==6) {
        posicion = "Código encontrado en el "+posResults+" intento %0a⬜⬜⬜🟩🟧%0a⬜⬜⬜🟩🟧%0a⬜⬜⬜🟩🟧%0a⬜⬜⬜🟩🟧%0a⬜⬜⬜🟩🟧%0a🟩🟩🟩🟩🟧%0a https://akanweb.com/vitle %0a %23vitle %23wordle"
    }
    $('#whatsapp').html('<a href="whatsapp://send?text='+posicion+'" data-action="share/whatsapp/share" target="_blank"><img border="0" src="img/whatsapp.png" width="50" height="50"></a>')
    $('#twitter').html('<a href="https://twitter.com/intent/tweet?text='+posicion+'" target="_blank"><img border="0" src="img/twitter.png" width="50" height="50"></a>')
    //$('#insta').html('<a href="http://instagram.com"><img border="0" src="img/insta.png" width="50" height="50"></a>')
}


// Cuenta atras proximo número
function countTime() {
    let  date = new Date();
    let  now = date.getTime();    
    let timestampNewDate = date.setDate(date.getDate()+1)
    let endTimestamp = new Date(timestampNewDate)
    let endDay = endTimestamp.getDate()
    let endMonth = endTimestamp.getMonth()
    let endYear = endTimestamp.getFullYear()
    let  endDate = new Date (endYear+"/"+(endMonth+1)+"/"+endDay+" "+"00:00:00"); // Establecer la fecha límite
    let  end = endDate.getTime();
    let  leftTime = end-now; // Diferencia horaria                              
    let h, m, s, ms;
    if(leftTime >= 0) {
        // d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
        h = Math.floor(leftTime / 1000 / 60 / 60);
        m = Math.floor(leftTime / 1000 / 60 % 60);
        s = Math.floor(leftTime / 1000 % 60);
        ms = Math.floor(leftTime % 1000);
        if(ms < 100) {
            ms = "0" + ms;
        }
        if(s < 10) {
            s = "0" + s;
        }
        if(m < 10) {
            m = "0" + m;
        }
        if(h < 10) {
            h = "0" + h;
        }
    } else {
        console.log ('Cerrado')
    }
    // Asignar la cuenta regresiva al div
    // document.getElementById ("_ d"). innerHTML = d + "día";
    document.getElementById ("_h").innerHTML = h + ":";
    document.getElementById ("_m").innerHTML = m + ":";
    document.getElementById ("_s").innerHTML = s;
    document.getElementById ("_h1").innerHTML = h + ":";
    document.getElementById ("_m1").innerHTML = m + ":";
    document.getElementById ("_s1").innerHTML = s;
    // document.getElementById ("_ ms"). innerHTML = ms + "ms";
    // Llamar al método countTime de forma recursiva cada segundo para mostrar el efecto de tiempo dinámico
    setTimeout(countTime, 50);
}