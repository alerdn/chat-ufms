/* 
 *  Função para verificar mudanças no estado de autenticação do usuário
 *  Essa função é acionada quando o estado de autenticação é alterado.
 *  Por exemplo, quando o usuário entra ou sai do sistema.
 *	@param user = variável com os dados do usuário
 */
function authStateObserver(user) {
  if (user) { // Usuário está autenticado!
   
   // Implemente as alterações que julgar necessário na interface
   // para quando o usuário estiver autenticado.
   // Por exemplo:
   //     - Esconder o botão de login
   //     - tornar visível o campo de envio de mensagens

  } else { // Usuário não está autenticado!!
    
   // Implemente as alterações que julgar necessário na interface
   // para quando o usuário NÃO estiver autenticado.
   // Por exemplo:
   //     - Mostrar o botão de login
   //     - Esconder o campo de envio de mensagens

  }
}

/* 
 *  Função para obter o conteúdo da mensagem que será enviada
 *	@return texto contido no textarea que será enviado
 */
function getMessageInput(){
	
  // Retornar o conteúdo que está dentro do elemento textarea.
	// A utilização do comando RETURN é obrigatória.
	// Por exemplo:
	//     return document.getElementyById('message').value;

}

/* 
 *  Função que contém o AJAX para ENVIAR a mensagem
 *	@param message_id = Código da mensagem que deve ser enviado junto com os
 *				        demais dados da requição AJAX
 */
function ajaxSendMessage(message_id){
	
  // Os dados devem ser enviados via POST
	
}

/* 
 *  Função que contém o AJAX para RECEBER a mensagem
 *	@param message_id = Código da mensagem que deve ser enviado junto com
 *				  		a requição AJAX
 */
function ajaxReceiveMessage(message_id){
  
  // Os dados devem ser enviados via POST
  // Chamar a função displayMessage(data_message) quando os dados voltarem do servidor

}

/* 
 *  Função que contém o AJAX para ENVIAR uma mensagem quando o usuário ENTRA no chat
 *  @param message_id = Código da mensagem que deve ser enviado junto com os
 *                demais dados da requição AJAX
 */
function ajaxSendMessageLogin(message_id){
  
  // Os dados devem ser enviados via POST

}

/* 
 *  Função que contém o AJAX para ENVIAR uma mensagem quando o usuário SAI no chat
 *  @param message_id = Código da mensagem que deve ser enviado junto com os
 *                demais dados da requição AJAX
 *  @param sender_id = Código do usuário que saiu do sistema
 *  @param sender_name = Nome do usuário que saiu do sistema
 *  @param sender_image = URL da imagem do usuário que saiu do sistema
 */
function ajaxSendMessageLogout(message_id, sender_id, sender_name, sender_image){
  
  // Os dados devem ser enviados via POST

}

/* 
 *  Função que é chamada quando um usuário ENTRA do chat
 *  @param user_id = Código do usuário que entrou do sistema
 *  @param user_name = Nome do usuário que entrou do sistema
 *  @param user_image = URL da imagem do usuário que entrou do sistema
 */
function showUserOnline(user_id, user_name, user_image){

  // Inclua o novo usuário do chat na sua interface para que o usuário
  // que estiver autenticado no momento possa conversar diretamente com ele. 

}

/* 
 *  Função que é chamada quando um usuário SAI do chat
 *  @param user_id = Código do usuário que saiu do sistema
 */
function hideUserOnline(user_id){

  // Enontrar na interface e remover o usuário que saiu do sistema para que
  // o usuário que estiver autenticado no momento não possa conversar diretamente com ele.
  // Para encontrar este usuário, considere o código fornecido como parâmetro.

}

/* 
 *  Função que deve ser chamada quando quando a requisção AJAX que
 *  recupera a mensagem do servidor retornar os valores 
 *  @param data_message = JSON com oados da mensagem retornada 
 *                        que segue o formato especificado nos requisitos
 */
function displayMessage(data_message) {

  // Alterar a interface para mostrar a mensagem recebida

}





