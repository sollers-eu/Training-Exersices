function showAndHideUIDetails(theId, theLink) {
   var el = document.getElementById(theId);
   var link = document.getElementById(theLink);

   if (el.style.display=="none") {
      showUIDetails(theId, theLink);
   }
   else {
      hideUIDetails(theId, theLink);
   }
   return false;
}

function showAndHideRefBox(theId, theLink) {
   var el = document.getElementById(theId);
   var link = document.getElementById(theLink);

   if (el.style.display=="none") {
      showRefBox(theId, theLink);
   }
   else {
      hideRefBox(theId, theLink);
   }
   return false;
}

function hideUIDetails(theId, theLink) {
   var el = document.getElementById(theId);
   var link = document.getElementById(theLink);

   el.style.display="none"; //hide element
   link.innerHTML = '<img src="../../res/blackup.gif" border="0">Show user interface details...';
   return false;
}

function showUIDetails(theId, theLink) {
   var el = document.getElementById(theId);
   var link = document.getElementById(theLink);

   el.style.display="block"; //show element
   link.innerHTML = '<img src="../../res/blackdown.gif" border="0">Hide user interface details...';
   return false;
}function hideRefBox(theId, theLink) {
   var el = document.getElementById(theId);
   var link = document.getElementById(theLink);

   el.style.display="none"; //hide element
   link.firstChild.src = '../../res/blackup.gif';
   return false;
}

function showRefBox(theId, theLink) {
   var el = document.getElementById(theId);
   var link = document.getElementById(theLink);

   el.style.display="block"; //show element
   link.firstChild.src='../../res/blackdown.gif';
   return false;
}
function popupDefinition(event, def) {
   if(!event) var event = window.event;
   var popup = document.createElement('div');
   popup.style.position = 'absolute';
   var posx = 0;
   var posy = 0;
   if (event.pageX || event.pageY){
     posx = event.pageX;
     posy = event.pageY;
   }
   else if (event.clientX || event.clientY){
     posx = event.clientX + document.body.scrollLeft;
     posy = event.clientY + document.body.scrollTop;
   }
   popup.style.left = posx + 10;
   popup.style.top = posy + 7;
   popup.className = 'defPopup';
   popup.id = 'popup';
   popup.innerHTML = def;
   document.body.appendChild(popup);
   document.body.onmousemove = function() {document.body.removeChild(document.getElementById('popup')); document.body.onmousemove = null};
}
function generateTOC() {
   var tocdiv = document.createElement('div');
   tocdiv.className = 'TOC';
   var divs = document.body.getElementsByTagName('DIV');
   for(var i=0; i<divs.length; i++){
     if(divs[i].className == 'arraysbox'){
       var sectionName = divs[i].firstChild.nodeValue;
       var link = document.createElement('a');
       link.href = '#' + sectionName;
       link.appendChild(document.createTextNode(sectionName));
       tocdiv.appendChild(link);
       tocdiv.appendChild(document.createTextNode(' | '))
     }
   }
   if(tocdiv.childNodes.length > 0){
     tocdiv.removeChild(tocdiv.lastChild);
   }
   if(tocdiv.childNodes.length > 1){
     var placeholder = document.getElementById('TOC');
     placeholder.parentNode.insertBefore(tocdiv, placeholder);
   }
}
