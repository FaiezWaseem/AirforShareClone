var ip = null;
const fb = firebase.database();
var type = 'global'
const maxTime = 7200000
fetch("https://ipapi.co/ip/")
.then(function(data) {
 return data.text()
})
.then(function(data) {
   ip =  data;
    })
.catch(function(error) {
alert('Error: '+error)
console.log(error)
});


function get($){
    return document.querySelector($); 
}


const input = get('#input');
const button = get('#btnSaveCopy');
input.addEventListener("change", function(e){
    // on input changed 
} );
input.addEventListener("keydown", function(e){
    //for value removed
    setBtnText('save')
} );
input.addEventListener("keyup", function(e){
    //for value added
    setBtnText('save')
} );




fb.ref('share/global/').on('child_added' , function(snapshot){
    if(snapshot.exists()){
        if(snapshot.key == 'time'){
            const d = new Date();
            const currentTime =  d.getTime()
            if((snapshot.val() - currentTime) > maxTime){
                
                ClearBoard()
            }
        }
        if(snapshot.key == 'text'){
            get('#input').value = atob(snapshot.val())
            setBtnText('copy')
        }
        
    }else{
        setBtnText('save')
        console.log("Empty")
    }
})
fb.ref('share/global/').on('child_changed' , function(snapshot){
    if(snapshot.exists()){
        if(snapshot.key == 'time'){
            const d = new Date();
            const currentTime =  d.getTime()
            if((snapshot.val() - currentTime) > maxTime){
                
                ClearBoard()
            }
        }
        if(snapshot.key == 'text'){
            get('#input').value = atob(snapshot.val())
            setBtnText('copy')
        }
        
    }else{
        setBtnText('save')
        console.log("Empty")
    }
})
fb.ref('share/').on('child_removed' , function(snapshot){
   
    if(snapshot.key == 'global'){
        get('#input').value = ""
    }else{
        get('#input').value = ""
    }
})


function SaveText(){
    if(type === 'global' ){
        if(get('#input').value != ""){
            const d = new Date();
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            fb.ref('share/global/').set({
                ip : ip,
                text : btoa(get('#input').value),
                date : d.getDate() + '/'+months[d.getMonth()] +'/'+ d.getFullYear(), 
                time :  d.getTime()
            })
        }else{
            alert('Please Type Something To Save')
        }
    }
}


button.addEventListener('click' , function(){
    const btnType = button.getAttribute('data-text')
    if(btnType == 'Copy'){
        copytext(get('#input').value)
    }else{
        SaveText()
    }
})



function copytext(text) {
    var input = document.createElement('textarea');
    input.innerHTML = text;
    document.body.appendChild(input);
    input.select();
    var resultCopy = document.execCommand("copy");
    document.body.removeChild(input);
    return resultCopy;
  }


function ClearBoard(){
    if(type == 'global'){
  fb.ref('share/').child('global').remove();
    }else{
        fb.ref('share/').child(ip).remove();
    }
}

function setBtnText(val){
    if(val == 'copy'){
     button.innerText =  'Copy'
     button.setAttribute('data-text' , 'Copy')
    }else{
        button.innerText =  'Save'
        button.setAttribute('data-text' , 'Save')
    }
}