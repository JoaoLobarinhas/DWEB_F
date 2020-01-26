var recievedData = null

$(document).ready(function() {
    setPhotos()
});

function setPhotos(){
    var sn = $("#studentNumber").text()
    sn = sn.split(' ');
    sn = sn[2]
    axios.get("http://localhost:3001/aux/photos/"+sn)
      .then(data=>{
        recievedData = data.data
        base64img = _arrayBufferToBase64(recievedData.profilePhoto.photo.data)
        src = "data:"+recievedData.profilePhoto.filetype+";base64,"+base64img
        $("#profilePhoto").attr('src',src);
        base64img = _arrayBufferToBase64(recievedData.bannerPhoto.photo.data)
        src = "data:"+recievedData.profilePhoto.filetype+";base64,"+base64img
        $('#headerPhoto').css("background-image", "url("+src+")")
        $('#studentNumber').removeAttr('id');
      })
      .catch(erro=>console.log(erro))
}

function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}