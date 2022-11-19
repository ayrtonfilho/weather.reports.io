// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

document.body.addEventListener('keyup', (event) => { consultAPI(event)});
document.querySelector('#submit-locale').addEventListener( 'click', (event) => { consultAPI(event)});

async function consultAPI(event){

    if(event.code == 'Enter' || event.type == 'click'){
        
        const locale = document.querySelector("#locale-input").value;

        if(locale != ''){
            showLoader();
        
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(locale)}&appid=5b8876daee472a4f563a39a805bfc969&units=metric&lang=pt_br`;
            
            let results = await fetch(url);
            let json = await results.json();
            
            jsonReceiver(json);

        }else{
            showWarning("Você esqueceu de digitar o nome da cidade.");
        }
    }
}



function showLoader(){
    document.querySelector('.loader-status').setAttribute('id', 'show');
    setTimeout(() => {
        document.querySelector('.loader-status').removeAttribute('id');
    }, 1500);
}

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
            visibility: json.visibility,
            timeZone: json.timezone,
            cloudy: json.clouds.all
        });

        hideWarning();

    }else{
        showWarning("Localização não encontrada, verifique a escrita da cidade que deseja realizar a consulta.");
    }
}

function showInfo(json){
    
    const timezone = json.timeZone == 0 ? json.timeZone: json.timeZone/3600;
    const date = timeZone(timezone);
    
    // inserindo informações da API
    themeTimer(date.timeZone);
    
    document.querySelector('.icon-temp img').setAttribute('src', `./src/img/icons/${json.tempIcon}.svg`);
    // document.querySelector('.icon-temp img').setAttribute('src', `https://openweathermap.org/img/wn/${json.tempIcon}@2x.png`);
    printValue('.date', date.dateZone);
    printValue('.city', json.name + ', ' +  json.country);
    printValue('.temp', json.temp);
    printValue('.min', json.tempMin);
    printValue('.max', json.tempMax);
    printValue('.visibility', json.visibility / 100);
    printValue('.wind', json.wind);
    printValue('.humidity', json.humidity);
    printValue('.hour', date.timeZone);
    printValue('.cloudy', json.cloudy);

    
    hideWarning();
}
        
function printValue(selector, value){
    document.querySelector(selector).innerHTML = value;
}

function timeZone(timezone){
    let dataLocale = new Date();

    const str = dataLocale.toLocaleString('en-GB', {timeZone: 'Europe/London'});

    const [dateValues, timeValues] = str.split(',');
    const [day, month, year] = dateValues.split('/');
    const [hours, minutes, seconds] = timeValues.split(':');

    const date = new Date(+year, (+month - 1), +day, (+hours + timezone), +minutes, +seconds);

    const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    
    const day_ = date.getDate();
    const dd = date.getDay();
    const mm = date.getMonth();
    const yy = date.getFullYear();

    const timeZone = `${h}:${m}:${s}`;
    const dateZone = `${getDay(+dd)}, ${day_} de ${getMonths(+mm).toLowerCase()} de ${yy}`
    
    return {timeZone, dateZone};
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
    const months = { 0: 'Janeiro', 1:'Fevereiro', 2:'Março', 3:'Abril', 4:'Maio', 5:'Junho',6:'Julho', 7:'Agosto',8:'Setembro', 9:'Outubro',10:'Novembro', 11:'Dezembro' }
    return months[month];
}

function themeTimer(timeZone){
    const hours = timeZone.slice(0,2);

    if( +hours > 5 && +hours < 18  ){
        document.querySelector('main').removeAttribute('class');
    }else{
        document.querySelector('main').setAttribute('class', 'dark-mode');
    }
}

showLoader();