// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

document.querySelector('#submit-locale').addEventListener( 'click', async (event) => {
    
    const locale = document.querySelector("#locale-input").value;

    if(locale != ''){
        // showWarning("Carregando informações...");
    
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(locale)}&appid=5b8876daee472a4f563a39a805bfc969&units=metric&lang=pt_br`;
        
        let results = await fetch(url);
        let json = await results.json();
        
        jsonReceiver(json);
    }else{
        showWarning("Ops! Você esqueceu de digitar sua pesquisa.");
    }

});

document.body.addEventListener('keyup', async (event) => {

    if(event.code == 'Enter'){

        const locale = document.querySelector("#locale-input").value;
    
        if(locale != ''){
            // showWarning("Carregando informações...");
        
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(locale)}&appid=5b8876daee472a4f563a39a805bfc969&units=metric&lang=pt_br`;
            
            let results = await fetch(url);
            let json = await results.json();
            
            jsonReceiver(json);
        }else{
            showWarning("Ops! Você esqueceu de digitar sua pesquisa.");
        }
    }
});

function jsonReceiver(json){
    if(json.cod == 200){
        showInfo({
            name: json.name,
            country: json.sys.country,
            temp: json.main.temp,
            tempIcon: json.weather[0].icon,
            wind: json.wind.speed,
            humidity: json.main.humidity,
            tempMin: json.main.temp_min,
            tempMax: json.main.temp_max,
            visibility: json.visibility
        });
        hideWarning();

    }else{
        showWarning("Localização não encontrada, verifique a escrita da cidade que deseja realizar a consulta.");
    }
}

function showInfo(json){
    const date = new Date();
    const month = getMonths(date.getMonth()+1).toLowerCase();
    const day = getDay(date.getDay());
    
    // inserindo informações da API
    document.querySelector('.date').innerHTML = `${day}, ${date.getDate()} de ${month}`;
    document.querySelector('.city').innerHTML = json.name + ', ' +  json.country;
    document.querySelector('.temp').innerHTML = json.temp;
    document.querySelector('.min').innerHTML = json.tempMin;
    document.querySelector('.max').innerHTML = json.tempMax;
    document.querySelector('.visibility').innerHTML = json.visibility /100;
    document.querySelector('.wind').innerHTML = json.wind;
    document.querySelector('.humidity').innerHTML = json.humidity;

    hideWarning();
}

function showWarning(msg){
    document.querySelector('.warning-status').innerHTML = msg;
    document.querySelector('.warning-status').setAttribute('id', 'active');
    document.querySelector(".input-city").setAttribute("id", "error");
}

function hideWarning(){
    document.querySelector(".input-city").removeAttribute("id");
    document.querySelector('.warning-status').removeAttribute('id');
}


function getDay(day){
    const days = { 0: 'Domingo', 1: 'Segunda-Feira', 2: 'Terça-Feira', 3: 'Quarta-Feira', 4: 'Quinta-Feira', 5: 'Sexta-Feira', 6: 'Sábado' }
    return days[day]; 
}

function getMonths(month){
    const months ={ 1: 'Janeiro', 2:'Fevereiro', 3:'Março', 4:'Abril', 5:'Maio', 6:'Junho',7:'Julho', 8:'Agosto',9:'Setembro', 10:'Outubro',11:'Novembro', 12:'Dezembro' }
    return months[month];
}