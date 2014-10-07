    
var destinataire = window.destinataire; 
var mon_identifiant = window.identifiant;
socket = window.socket;

// listener that notify personal chat. It retrieves informations like the recipient and message's content.
socket.on('notification_PersonalChat', function(infos) {
    var obj = JSON.parse(infos);
    if (obj.destinataire === mon_identifiant && obj.emetteur === destinataire) {
        var divChat = document.getElementById("messageChat");
        divChat.innerHTML += "<p class='msg-bubble destinataire'>" /* + obj.emetteur + ":" */ + obj.contenu + "</p>"; 
        divChat.scrollTop = divChat.scrollHeight;  
    }
});
    
/* function that add messages on personal chat frames both on the client and then notify recipient 
 * Recipient receive messages from the server after control
 */
function ajouterMessageChat(messageInput,event) {
   var texte = messageInput.value;

   if (event.keyCode == 13) {
     var divChat = document.getElementById("messageChat");
     divChat.innerHTML += "<p class='msg-bubble emetteur'>" /*  + mon_identifiant +  ":" */  + texte + "</p>";
     divChat.scrollTop = divChat.scrollHeight;
     document.getElementById("zone_texte_Chat").value = "";
                              
     socket.emit('new_message_PersonalChat', JSON.stringify({
          emetteur: mon_identifiant,
          destinataire: destinataire,
          contenu: texte
     }));    
   }
}
      
// function that load some informations from parent frame like client's pseudo, client's recipient and history
function chargerDonnees(){
    document.getElementById("pseudo").innerHTML = /*window.mon_identifiant + " --> " + */ "Chat privé avec "+window.destinataire;
    document.getElementById("messageChat").innerHTML = window.historique;
}
        
/* Function that catch frame closing in order to warn parent frame that one recipient is gone.
   Therefore, parent frame receive from the server recipient's identifier and then updates opened windows table. 
*/
window.onbeforeunload = function(e){ 
    socket.emit('MAJ_tab_windows_opened', JSON.stringify({
        emetteur: mon_identifiant,
        destinataire: destinataire
    }));            
} 
    
