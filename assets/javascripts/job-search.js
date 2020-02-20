var firebaseConfig = {
    apiKey: "AIzaSyDszSEFfAInsMpPqe4PhgYYTrs2AOR8AsM",
    authDomain: "project-1-job-src.firebaseapp.com",
    databaseURL: "https://project-1-job-src.firebaseio.com",
    projectId: "project-1-job-src",
    storageBucket: "project-1-job-src.appspot.com",
    messagingSenderId: "1753867064",
    appId: "1:1753867064:web:ecbdeb2a2106075407d7cd",
    measurementId: "G-NE3FQV23HM"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
  
// firebase.initializeApp(firebaseConfig);
var database= firebase.database();
var modalbutValue;
  // Initialize Firebase

  var listArr=[];
  

$(document).ready(function() {

    database.ref("/search/").orderByChild("dateAdded").limitToLast(1).once("value").then(   function(snapshot){
        if(snapshot.val()==null){
            $("#serch-box").html("<h5>No recent search is available</h5>");
        }
    },function(e){


    });


    $(".modalbut").on("click",function(e){
        e.preventDefault();
        modalbutValue = $(this).text();
        console.log(modalbutValue);
    $('.modal').modal();
        console.log(modalbutValue);
    });
    
    $(".btn-signup").on("click",function(e){
        e.preventDefault();
        var inputText = $("#signupuserName").val();
        var inputpassword = $("#signupPassWord").val();
        firebase.database().ref('/user/'+ inputText).set({
        pwd:inputpassword
        });    
    });

    $(".btn-login").on("click",function(e){

        e.preventDefault();
        var inputloginText = $("#userName").val();
        
        
    });
   
$(".btn-src").on("click",function(e){
    e.preventDefault();
    var btnValue= $(this).text();
    var jobRole = $("#job-category-input").val().trim().toLowerCase();
    var jobLocation = $("#location-input").val().trim().toLowerCase();
    var queryURL="";
        
    
    if(jobRole!=="" || jobLocation!==""){

        if(btnValue ==="GitHub"){
            if((jobRole!=="") && (jobLocation!=="")){
                queryURL = "https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json?description="+jobRole+"&location="+jobLocation;
                                    
            } else if(jobRole!==""){

                queryURL = "https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json?description="+jobRole;
                
            }
            else if(jobLocation!=="") {
                queryURL = "https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json?location="+jobLocation;

            }

        }
        else if(btnValue ==="Authentic"){
            if(jobRole!==""){
            
                queryURL = "https://cors-anywhere.herokuapp.com/https://authenticjobs.com/api/?api_key=df526b666a30218cb52a00568251e672&method=aj.jobs.search&keywords="+jobRole+"&format=JSON";
        
            }
            else if(jobLocation!==""){
                queryURL = "https://cors-anywhere.herokuapp.com/https://authenticjobs.com/api/?api_key=df526b666a30218cb52a00568251e672&method=aj.jobs.getlocations&location="+jobLocation+"&format=JSON";

            }
            
        }
        else if(btnValue ==="Adzuna"){
            if(jobRole!=="" && jobLocation!==""){

                queryURL= "https://cors-anywhere.herokuapp.com/https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=33343f64&app_key=81f0d268dcce1766901ea09e54008698&results_per_page=10&what="+jobRole+"&where="+jobLocation+"&content-type=application/json"
            }
            else if (jobRole!=""){
                queryURL="https://cors-anywhere.herokuapp.com/https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=33343f64&app_key=81f0d268dcce1766901ea09e54008698&results_per_page=10&what="+jobRole+"&content-type=application/json"
            }
            else if(jobLocation!=="")
            {
                queryURL="https://cors-anywhere.herokuapp.com/https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=33343f64&app_key=81f0d268dcce1766901ea09e54008698&results_per_page=10&where="+jobLocation+"&content-type=application/json"
            }

        }

        $.ajax({
            url:queryURL,
            method:"GET"
        })
        .then(function(response){
            
            var resultArr=[];
            console.log(response)
            if(response){
                if(btnValue ==="Authentic"){
                
                    
                    data = response.listings.listing;
                    var keys = Object.keys(data);
                
                    if(data.length>0){
                            for(var i=0;i<data.length;i++){

                                resultArr.push({
                
                                    jobRole:data[keys[i]].title,
                                    jobLocation:data[keys[i]].location || "US",
                                    jobDescriprion:data[keys[i]].description,
                                    Url:data[keys[i]].url, 
                                    userLocation:jobLocation,
                                    userRole:jobRole,
                                    siteChoice:btnValue
                    
                                })
                            }
                            database.ref("/search/").push({
                                resultArr:resultArr,
                                dateAdded:firebase.database.ServerValue.TIMESTAMP,
                    
                            });
                        }
                        else{
                            $("#new-search-id").html("<br><h4>No data is available for the given search!!</h4>")
                        }
                        
            
                }
                else if (btnValue ==="GitHub"){
                    
                    if(response.length>0){
                        var keys = Object.keys(response);
                        var length=10;
                        if(response.length<10)
                            length = response.length;
                        for(var i=0; i<length;i++){
                            
                            resultArr.push({

                                jobRole:response[keys[i]].title,
                                jobLocation:response[keys[i]].location||jobLocation,
                                jobDescriprion:response[keys[i]].description,
                                Url:response[keys[i]].url,                                
                                userLocation:jobLocation,
                                userRole:jobRole,
                                siteChoice:btnValue
                
                            })
                        }
                        database.ref("/search/").push({
                            resultArr:resultArr,
                            dateAdded:firebase.database.ServerValue.TIMESTAMP,
                
                        })
                    }
                    else{
                        $("#new-search-id").html("<br><h4>No data is available for the given search!!</h4>")
                    }
                    
                }
                else if(btnValue==="Adzuna"){

                    var data =response.results;
                    if(data.length>0){
                        for(var i=0; i<data.length;i++){
                            var title=response.results[i].title.replace(/[</>]/g,"").replace(/strong/g,"")
                            
                            resultArr.push({

                                jobRole:title,
                                jobLocation:response.results[i].location.display_name  || UK,
                                jobDescriprion:response.results[i].description.replace(/[</>]/g,"").replace(/strong/g,""),
                                Url:response.results[i].redirect_url,
                                userLocation:jobLocation,
                                userRole:jobRole,
                                siteChoice:btnValue
                
                            })
                        }
                    
                        database.ref("/search/").push({
                            resultArr:resultArr,
                            dateAdded:firebase.database.ServerValue.TIMESTAMP,
                
                        })
                }
                else{
                    $("#new-search-id").html("<br><h4>No data is available for the given search!!</h4>")
                }
            } 
            }
            else{
                $("#new-search-id").html("<h4>No data is available for the given search!!</h4>")
            }

        });
    }

 });





$("#serch-box").on("click",'a',function(e){
    
    var val = $(this).text();
    var str = val.replace(/\d+/g,"");
    
    for (var i = 0; i < listArr.length; i++) {
        var keys = Object.keys(listArr[i]) 
        if(keys[0]===str){
            $("#new-search-id").empty();
            loadSearchResults(listArr[i][keys[0]])
            break;
        }    
       
    }
})


$('.collapsible').collapsible();
$('.dropdown-trigger').dropdown();
$('.sidenav').sidenav();
$('.scrollspy').scrollSpy();

});
database.ref("/search/").orderByChild("dateAdded").limitToLast(5).on("child_added",function(snapshot){

    if(snapshot.val()){
       
        var keys = Object.keys(snapshot.val());
        var temp = snapshot.val()[keys[1]];
        
        var location = temp[0].userLocation;
        var role = temp[0].userRole;
        var site = temp[0].siteChoice;


        var key=(role+" - "+location+" - "+site);
       
        var obj ={};
        obj[key]=temp;
        var keysOfArray=[];
        if(listArr.length>0){
            
            for (var i=0;i<listArr.length;i++){
                var temVar =Object.keys(listArr[i]);
                keysOfArray.push(temVar[0])
            }
            if(!keysOfArray.includes(key)){
               
                listArr.push(obj);
                if(listArr.length>5)
                {
                    listArr.shift();
                }
                
                $("#serch-box").empty();
                for(var j=0;j<listArr.length;j++){
                    
                    var temVar = Object.keys(listArr[j]);
                    console.log(temVar[0]);
                    var spanLink = $("<span class='new badge' data-badge-caption='results'>");
                    spanLink.text(temp.length);
                    var jobLink = $("<a href=#>").attr("class","collection-item").text(temVar[0])
                    spanLink.appendTo(jobLink);
                    jobLink.append("<br>").prependTo("#serch-box");
                }  
            }
            else{
                var index= keysOfArray.indexOf(key);
                console.log(index)
                listArr.splice(index,1);
                listArr.push(obj);
                $("#serch-box").empty();
                for(var j=0;j<listArr.length;j++){
                    
                    var temVar = Object.keys(listArr[j]);
                    var spanLink = $("<span class='new badge' data-badge-caption='results'>");
                    spanLink.text(temp.length);
                    var jobLink = $("<a href=#>").attr("class","collection-item").text(temVar[0])
                    spanLink.appendTo(jobLink);
                    jobLink.append("<br>").prependTo("#serch-box");
                }  
                    
            }
        }
        else if(listArr.length==0){
            $("#serch-box").empty();
            listArr.push(obj);
            var spanLink = $("<span class='new badge' data-badge-caption='results'>");
            spanLink.text(temp.length);
            var jobLink = $("<a href=#>").attr("class","collection-item").text(role+" - "+location+" - "+site)
            spanLink.appendTo(jobLink);
            jobLink.append("<br>").prependTo("#serch-box");   
        }
        
        
    }
    else{
        console.log("empty research")
    }

    

}, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
});

database.ref("/search/").orderByChild("dateAdded").limitToLast(1).on("child_added",function(snapshot){

    $("#new-search-id").empty();
    var keys = Object.keys(snapshot.val());
    
    var temp=snapshot.val()[keys[1]];
    if(snapshot.val()){

        loadSearchResults(temp);
       
    }
    
    

}, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
});

function loadSearchResults(temp) {
    
    for (var i = 0; i < temp.length; i++) {
        var elementArr = temp[i];
        var location = elementArr.jobLocation;
        var role = elementArr.jobRole;
        var description = elementArr.jobDescriprion;
        var url = elementArr.Url;

        var div = $("<div class='card z-depth-1 search-card'>");
        var jobLink = $("<a href=#>").attr("class", "search-item").text(role);
        $("<span>").text("  ,  " + location).appendTo(jobLink);
        jobLink.appendTo(div);
        
        if (temp[0].siteChoice == "Adzuna")
            $("<p>").text(description).appendTo(div);
        else
            div.append(description);
        $("<a>").attr("href", url).appendTo(div);
        div.appendTo("#new-search-id");
        
    }
}

