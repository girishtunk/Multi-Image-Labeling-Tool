const c = document.querySelector('#imgCanvas')
const label = ['top_left', 'top_right', 'bot_right','bot_left']
let ctx = c.getContext("2d");
let coordinates = new Array();
let dispCoord = new Array();
let textarea = document.getElementById('textarea');



//Clear List Button
function clear_can() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  img.onload();
  coordinates = new Array();
  dispCoord = new Array();

  textarea.value = '';
  draw();

}

//Save Button
function saveTextAsFile()
{
  var textToWrite = document.getElementById("textarea").value;
  textToWrite = "{"+"\""+fileNames[imgIndex]+"\""+":"+textToWrite+"}"
  var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
  var fileNameToSaveAs = fileNames[imgIndex]+".txt";

  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL != null)
  {
    // Chrome allows the link to be clicked
    // without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  }
  else
  {
    // Firefox requires the link to be added to the DOM
    // before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }

  downloadLink.click();
}


//Next Button
let imgIndex = 0;
function next() {
  clear_can();
  imgIndex++;
  if (imgIndex > fileNames.length-1) {
    imgIndex = 0;
  }
  console.log(imgIndex);
  img.src = contentImgsList[imgIndex];
}

//Undo Button
function undo() {
  if (coordinates.length == 0) {
    return alert('There is nothing to undo.')
  } else {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  img.onload();
  coordinates.pop();
  dispCoord.pop();
  textarea.value = dispCoord;
  draw();
}
}

// Creating circle
const point = (x,y) => {
  let rad = 3;
	ctx.beginPath();
	ctx.arc(x, y, rad, 0, 2 * Math.PI, false);
	ctx.fillStyle="#FF0000";
	ctx.fill();
}

function draw() {
  for (let i=0; i < coordinates.length; i++) {
    point(coordinates[i]['x'],coordinates[i]['y']);
  }
}


//Getting X Y Coordinates
function getMousePos(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

// newcoor.push("{"+label[0]+": "+"{'x':"+mousePos.x+",'y':"+mousePos.y+"}"+"}");

let canClick = document.querySelector('#imgCanvas');

canClick.addEventListener ('click', function(event){
  let corLen = coordinates.length;
  if (corLen < 4) {
  let mousePos = getMousePos(canClick, event);
  // coordinates.push(n);
  coordinates.push({"x":mousePos.x,"y":mousePos.y})
  let n = '{"'+label[corLen]+'":{"x":'+mousePos.x+',"y":'+mousePos.y+'}}'
  dispCoord.push(n);
  draw();

} else {

  alert('Only Four points are allowed.')
}

// print coordinates
if(coordinates.length == 0){
  textarea.value = '';
} else {
  textarea.value = dispCoord;
}
});


let fileList = document.querySelector('#myfileinput');
//Getting File Names of the user selected files
let fileNames = new Array();
//To Get Selected Images stacked in an Array
let contentImgsList = new Array();

fileList.addEventListener('change', readfiles, false);

function readfiles(event) {
  let selectFiles = fileList.files;
  for (var i = 0; i < selectFiles.length; i++) {
    //Creating an array of filenames
    fileNames.push(selectFiles[i].name);
    let reader = new FileReader();
    reader.onload = (function(){
      return function(event) {
        //Creating an array of user selected images
        contentImgsList.push(event.target.result);
        if(contentImgsList.length == 1) {
        img.src = event.target.result;
        }
      };
    })(selectFiles[i]);

    reader.readAsDataURL(selectFiles[i]);
  }
  // img.src = "images/"+fileNames[0];
}



// Displaying image
let img = new Image();
// img.src = "images/"+imgname+".jpg";

img.onload = function () {
    ctx.canvas.width = img.width;
    ctx.canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
}
