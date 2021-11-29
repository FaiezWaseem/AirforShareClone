var ip = null;
const fb = firebase.database();
var type = 'global'
const maxTime = 7200000
var AutoSave = false;
//----------Get User Same IP-------------//
try{
fetch("https://airforshare.com/apiv3/clip.php")
.then(function(data) {
 return data.json()
})
.then(function(data) {
   ip =  data.clipId;
    })
.catch(function(error) {

console.warn(error)
});
}catch(err){
    console.warn(err)
}

function get($){
    return document.querySelector($); 
}

//------------Get Input---------------------------------//
const input = get('#input');
const button = get('#btnSaveCopy');
input.addEventListener("change", function(e){
    // on input changed 
    SaveText()
    setBtnText('copy')
    AutoSave = false
} );
input.addEventListener("keydown", function(e){
    //for value removed
    setBtnText('save')
} );
input.addEventListener("keyup", function(e){
    //for value added
    if(!AutoSave){
        setBtnText('save')
    }
} );
input.onpaste = function(event) {
    event.preventDefault();
    get('#input').value = get('#input').value + event.clipboardData.getData('text/plain')
    SaveText()
    setBtnText('copy')
    AutoSave = true
  };

//-----------------Load Data------------------------------//  
  if(type=== "global"){
    fb.ref('share/'+ip+'/').off();
    Global();
}else{
fb.ref('share/global/').off();
LocalNetwork();
}

//---------Functions Loader------------------//
function Global(){
fb.ref('share/global/').on('child_added' , function(snapshot){
    if(snapshot.exists()){
        if(snapshot.key == 'time'){
            const d = new Date();
            const currentTime =  d.getTime()
            if((currentTime - snapshot.val()) > maxTime){
                
                ClearBoard()
            }
        }
        if(snapshot.key == 'text'){
            get('#input').value = atob(snapshot.val())
            inputValue = atob(snapshot.val())
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
            inputValue = atob(snapshot.val())
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
        inputValue = ""
    }else{
        get('#input').value = ""
    }
})
}

function LocalNetwork(){
    fb.ref('share/'+ip+"/").on('child_added' , function(snapshot){
        if(snapshot.exists()){
            if(snapshot.key == 'time'){
                const d = new Date();
                const currentTime =  d.getTime()
                if((currentTime - snapshot.val()) > maxTime){
                    
                    ClearBoard()
                    console.log( {
                        uploadTime : snapshot.val(),
                        currentTime : currentTime,
                        maxTime : maxTime
                    })
                }
            }
            if(snapshot.key == 'text'){
                get('#input').value = atob(snapshot.val())
                inputValue = atob(snapshot.val())
                setBtnText('copy')
            }
            
        }else{
            setBtnText('save')
            console.log("Empty")
        }
    })
    fb.ref('share/'+ip+"/").on('child_changed' , function(snapshot){
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
                inputValue = atob(snapshot.val())
                setBtnText('copy')
            }
            
        }else{
            setBtnText('save')
            console.log("Empty")
        }
    })
    fb.ref('share/'+ip+"/").on('child_removed' , function(snapshot){
       
        if(snapshot.key == ip){
            get('#input').value = ""
            inputValue = ""
        }else{
            get('#input').value = ""
        }
    })    
}
//------------------------------------------//


//---------SAVE TEXT -----------------------------//
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
    }else{
        if(get('#input').value != ""){
            const d = new Date();
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            fb.ref('share/'+ip+'/').set({
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

//----------COPY TEXT ON CLICK----------------------//
button.addEventListener('click' , function(){
    const btnType = button.getAttribute('data-text')
    if(btnType == 'Copy'){
        copytext(get('#input').value)
    }else{
        SaveText()
        AutoSave = false
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

//-----------------------------//
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
//------------------------------//



//------------DROPDOWN OPTIONS---------------------------------------------------------//
document.querySelector('.select-wrapper').addEventListener('click', function() {
    this.querySelector('.select').classList.toggle('open');
})
for (const option of document.querySelectorAll(".custom-option")) {
    option.addEventListener('click', function() {
        if (!this.classList.contains('selected')) {
            this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
            this.classList.add('selected');
            this.closest('.select').querySelector('.select__trigger span').textContent = this.textContent;
            if(this.textContent === "Global"){
                get('#input').value = '';
                  type= 'global'
                  fb.ref('share/'+ip+'/').off();
                  Global();
            }else{
                get('#input').value = ''
          type = 'local'
          fb.ref('share/global/').off();
          LocalNetwork();
            }

        }
    })
}