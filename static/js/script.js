var weatherInfoObj={};

window.addEventListener('load',()=>{
    console.log('window loaded')
    var lat,long;
    var apiKey="q43tIxoscGbpazWizrwLtd4Ev0eIIJd5"
    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position)
        lat=position['coords']['latitude'];
        long=position['coords']['longitude'];
        console.log(lat+"    "+long)
        var geoPositionUrl=`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=${lat},${long}`
        console.log(geoPositionUrl)
        axios.get(geoPositionUrl)
        .then((response)=>{
            console.log(response);
            weatherInfoObj['country']=response.data.Country.EnglishName;
            weatherInfoObj['locationKey']=response.data.Key;
            weatherInfoObj['timeZone']=response.data.TimeZone;
            weatherInfoObj['locationName']=response.data.LocalizedName;
            // console.log(country,locationKey,timeZone,locationName)
            getWeatherData(apiKey,weatherInfoObj.locationKey);
        })
    })
})


function getWeatherData(apiKey,locationKey){
    var weatherInfo={}
    var weatherUrlApi=`http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${apiKey}`
    axios.get(weatherUrlApi).then((response)=>{
        weatherInfoObj['today']=response.data.DailyForecasts[0].Date;
        weatherInfoObj['day']=response.data.DailyForecasts[0].Day;
        weatherInfoObj['night']=response.data.DailyForecasts[0].Night;
        weatherInfoObj['temperature']=response.data.DailyForecasts[0].Temperature;
        console.log(weatherInfoObj)
        returnId('country').textContent=weatherInfoObj.country
        returnId('location').textContent=weatherInfoObj.locationName
        var today=new Date(weatherInfoObj.today)
        returnId('date').textContent=today.getDate()+"-"+(today.getMonth()+1)+"-"+today.getFullYear()+"-"+weatherInfoObj.timeZone.Code
        if (weatherInfoObj.day.Icon<10){
            returnId('day').setAttribute('src',`https://developer.accuweather.com/sites/default/files/0${weatherInfoObj.day.Icon}-s.png`)
        }else{
                returnId('day').setAttribute('src',`https://developer.accuweather.com/sites/default/files/${weatherInfoObj.day.Icon}-s.png`)
    }
        if (weatherInfoObj.night.Icon<10){
            returnId('night').setAttribute('src',`https://developer.accuweather.com/sites/default/files/0${weatherInfoObj.night.Icon}-s.png`)
        }else{
                returnId('night').setAttribute('src',`https://developer.accuweather.com/sites/default/files/${weatherInfoObj.night.Icon}-s.png`)
        }
        returnId('day-desc').textContent=weatherInfoObj.day.IconPhrase
        returnId('night-desc').textContent=weatherInfoObj.night.IconPhrase
    })
}


function returnId(id){
    return document.getElementById(id);
}