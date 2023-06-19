/**
 *  Função para verificar mudanças no estado de autenticação do usuário
 *  Essa função é acionada quando o estado de autenticação é alterado.
 *  Por exemplo, quando o usuário entra ou sai do sistema.
 *	@param user = variável com os dados do usuário
 */
function authStateObserver(user) {
  if (user) {
    selectChat(0, "Grupo Público");

    document
      .querySelector("#login-container")
      .classList.replace("d-flex", "d-none");
    $("#input-container").removeClass("d-none").addClass("d-flex");
  } else {
    $("#login-container").removeClass("d-none").addClass("d-flex");
    $("#input-container").removeClass("d-flex").addClass("d-none");
  }
}

/**
 *  Função para obter o conteúdo da mensagem que será enviada
 *	@return texto contido no textarea que será enviado
 */
function getMessageInput() {
  // Retornar o conteúdo que está dentro do elemento textarea.
  // A utilização do comando RETURN é obrigatória.
  // Por exemplo:
  //     return document.getElementyById('message').value;
  return $("#message-input").val();
}

/**
 *  Função que contém o AJAX para ENVIAR a mensagem
 *	@param message_id = Código da mensagem que deve ser enviado junto com os
 *				        demais dados da requição AJAX
 */
function ajaxSendMessage(message_id) {
  const chatId = localStorage.getItem("chat-id");
  const receiverName = localStorage.getItem("receiver-name");

  const params = {
    method: "POST",
    body: JSON.stringify({
      message_id: message_id,
      timestamp: Date.now(),
      sender_id: getUserId(),
      sender_name: getUserName(),
      sender_image: getProfileImageUrl(),
      receiver_id: chatId == 0 ? null : chatId,
      receiver_name: receiverName,
      visibility: chatId == 0,
      message_text: getMessageInput(),
      color: "#81c2eb",
    }),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  };

  console.log("enviando mensagem %o", JSON.parse(params.body));

  fetch("https://antonellis.com.br/ufms/pw/chat/messages/", params);
  $("#message-input").val("");
}

/**
 *  Função que contém o AJAX para RECEBER a mensagem
 *	@param message_id = Código da mensagem que deve ser enviado junto com
 *				  		a requição AJAX
 */
function ajaxReceiveMessage(message_id) {
  // Os dados devem ser enviados via POST
  // Chamar a função displayMessage(data_message) quando os dados voltarem do servidor
  fetch("https://antonellis.com.br/ufms/pw/chat/messages/" + message_id)
    .then((resultado) => {
      if (!resultado.ok) {
        return new Error(
          JSON.stringify({
            sender_id: null,
            message: "Não foi possível recuperar mensagem",
          })
        );
      }
      return resultado.text();
    })
    .then((conteudo) => displayMessage(JSON.parse(conteudo)))
    .catch((erro) => displayMessage(erro));
}

/**
 *  Função que contém o AJAX para ENVIAR uma mensagem quando o usuário ENTRA no chat
 *  @param message_id = Código da mensagem que deve ser enviado junto com os
 *                demais dados da requição AJAX
 */
function ajaxSendMessageLogin(message_id) {
  // Os dados devem ser enviados via POST
  $("#user-name").text(getUserName());
  $("#signout-button").removeClass("d-none").addClass("d-flex");

  const params = {
    method: "POST",
    body: JSON.stringify({
      message_id: message_id,
      timestamp: Date.now(),
      sender_id: getUserId(),
      sender_name: getUserName(),
      sender_image: getProfileImageUrl(),
      receiver_id: 0,
      receiver_name: "System",
      visibility: true,
      message_text: `${getUserName()} acabou de chegar`,
      color: "#999999",
    }),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  };

  fetch("https://antonellis.com.br/ufms/pw/chat/messages/", params);
}

/**
 *  Função que contém o AJAX para ENVIAR uma mensagem quando o usuário SAI no chat
 *  @param message_id = Código da mensagem que deve ser enviado junto com os
 *                demais dados da requição AJAX
 *  @param sender_id = Código do usuário que saiu do sistema
 *  @param sender_name = Nome do usuário que saiu do sistema
 *  @param sender_image = URL da imagem do usuário que saiu do sistema
 */
function ajaxSendMessageLogout(
  message_id,
  sender_id,
  sender_name,
  sender_image
) {
  // Os dados devem ser enviados via POST
  $("#user-name").textContent = "";
  $("#signout-button").removeClass("d-flex").addClass("d-none");

  const params = {
    method: "POST",
    body: JSON.stringify({
      message_id: message_id,
      timestamp: Date.now(),
      sender_id: sender_id,
      sender_name: sender_name,
      sender_image: sender_image,
      receiver_id: 0,
      receiver_name: "System",
      visibility: true,
      message_text: `${sender_name} saiu da conversa`,
      color: "#999999",
    }),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  };

  fetch("https://antonellis.com.br/ufms/pw/chat/messages/", params);
}

/**
 *  Função que é chamada quando um usuário ENTRA do chat
 *  @param user_id = Código do usuário que entrou do sistema
 *  @param user_name = Nome do usuário que entrou do sistema
 *  @param user_image = URL da imagem do usuário que entrou do sistema
 */
function showUserOnline(user_id, user_name, user_image) {
  if (user_id == getUserId()) return;

  const friendButton = $(
    `<button id=${user_id} class="btn btn-light w-100" onClick="selectChat('${user_id}', '${user_name}')" style="font-size: 11px">
      <span class="d-flex flex-row align-items-center">
        <img class="mr-1" src="${user_image}" style="width: 40px;height: 40px"></img>
        <p class="m-0 text-truncate" >${user_name}</p>
      </span>
    </button>`
  );

  $("#friend-list").append(friendButton);
}

/**
 *  Função que é chamada quando um usuário SAI do chat
 *  @param user_id = Código do usuário que saiu do sistema
 */
function hideUserOnline(user_id) {
  // Enontrar na interface e remover o usuário que saiu do sistema para que
  // o usuário que estiver autenticado no momento não possa conversar diretamente com ele.
  // Para encontrar este usuário, considere o código fornecido como parâmetro.
  $(`#${user_id}`).remove();
}

/**
 *  Função que deve ser chamada quando quando a requisção AJAX que
 *  recupera a mensagem do servidor retornar os valores
 *  @param data_message = JSON com oados da mensagem retornada
 *                        que segue o formato especificado nos requisitos
 */
function displayMessage(data_message) {
  if (!data_message.sender_id) return;

  const chatId = localStorage.getItem("chat-id");

  // Se a mensagem é pública e eu estou no grupo público
  if (data_message.visibility && chatId == 0) {
    $("#chat-scroll").append(getMessageDiv(data_message));
  } else if (
    (data_message.sender_id == getUserId() &&
      chatId == data_message.receiver_id) ||
    (data_message.receiver_id == getUserId() &&
      chatId == data_message.sender_id)
  ) {
    $("#chat-scroll").append(getMessageDiv(data_message));
  }
}

function getMessageDiv(data_message) {
  console.log(data_message);
  const isMine = getUserId() == data_message["sender_id"];

  if (data_message.receiver_name == "System") {
    return $(`<div class="d-flex flex-row justify-content-center w-100">
    <div class="text-secondary mt-2" style="max-width: 320px">
      <p
        class="m-0 px-4 py-2 rounded"
        style="color: #fff; font-size: 14px; background-color: ${data_message.color}"
      >
      ${data_message.message_text}
      </p>
    </div>
  </div>`);
  }

  data_message.message_text = data_message.message_text.replace("\n", "<br/>");

  if (isMine) {
    return $(`<div class="d-flex flex-row justify-content-end w-100">
      <div class="text-secondary mt-2" style="max-width: 320px">
        <p
          class="m-0 w-100 d-flex flex-row justify-content-end"
          style="font-size: 0.8em"
        >
          <i>${data_message.sender_name} - ${data_message.timestamp}</i>
        </p>
        <span class="d-flex w-100">
          <img class="mr-1 rounded" src="${data_message.sender_image}" style="width: 40px;height: 40px"></img>
          <p
            class="m-0 px-4 py-2 rounded w-100"
            style="color: #fff; background-color: ${data_message.color}"
          >
          ${data_message.message_text}
          </p>
        </span>
      </div>
    </div>`);
  } else
    return $(`<div class="d-flex flex-row justify-content-start w-100">
    <div
      class="text-secondary mt-2 justify-content-start"
      style="max-width: 320px"
    >
      <p
        class="m-0 w-100 d-flex flex-row justify-content-end"
        style="font-size: 0.8em"
      >
      <i>${data_message.sender_name} - ${data_message.timestamp}</i>
      </p>
      <span class="d-flex w-100">
        <img class="mr-1 rounded" src="${data_message.sender_image}" style="width: 40px;height: 40px"></img>
        <p
          class="m-0 px-4 py-2 rounded w-100"
          style="color: #fff; background-color: ${data_message.color}"
        >
        ${data_message.message_text}
        </p>
      </span>
    </div>
  </div>`);
}

function onInputChange() {
  $("#enviar-button").prop("disabled", getMessageInput() == "");
}

/**
 * Chat-id guardado no localStorage para saber com quem está conversando
 * 0 = público
 */
function selectChat(id, receiver) {
  localStorage.setItem("chat-id", id);
  localStorage.setItem("receiver-name", receiver);

  $("#chat-scroll").empty();
  $("#chat-title").text(receiver);
  $(`#${id}`).removeClass("btn-light").addClass("btn-secondary");

  for (const child of $("#friend-list").children()) {
    if (child.id != id) child.classList.replace("btn-secondary", "btn-light");
  }
}
