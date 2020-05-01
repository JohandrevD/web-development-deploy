if(!!window.performance && window.performance.navigation.type === 2)
{
    window.location.reload();
    console.log('Reloading');
}

var t_day=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var t_month=["January","February","March","April","May","June","July","August","September","October","November","December"];

//  Function to get and display the current time and date
function GetClock()
{
    var d = new Date();
    var n_day = d.getDay(), n_month = d.getMonth(), n_date = d.getDate(), n_year = d.getFullYear();
    var n_hour = d.getHours(), n_min = d.getMinutes(), n_sec = d.getSeconds();

    if(n_min<=9) n_min = "0" + n_min;
    if(n_sec<=9) n_sec = "0" + n_sec;

    var time_text = "" + n_hour + ":" + n_min + ":" + n_sec + "";
    var date_text = "" + t_day[n_day] + ", " + n_date + " " + t_month[n_month] + " " + n_year;
    document.getElementById('time_display').innerHTML = time_text;
    document.getElementById('date_display').innerHTML = date_text;
}

GetClock();
setInterval(GetClock,1000);
