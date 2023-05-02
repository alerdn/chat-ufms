// Inicializa o Firebase
var config = {
  apiKey: "AIzaSyCb4emrOFLvCvgfrbVVNi5dHaNfT4qvxRY",
  authDomain: "pw1-2018-1.firebaseapp.com",
  databaseURL: "https://pw1-2018-1.firebaseio.com",
  projectId: "pw1-2018-1",
  storageBucket: "",
  messagingSenderId: "816043355438"
};
firebase.initializeApp(config);

// Verifica se o SDK do Firebase foi importado e configurado corretamente.
if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
  Swal.fire({
    title: 'Oops...',
    html: 'Você não configurou nem importou o SDK do Firebase.<br>Certifique-se de seguir as instruções de configuração do codelab e certifique-se de estar executando o codelab usando o `firebase serve`',
    icon: 'error'
  })
}

// Evita que o usuário permaneça logado após sair ou atualizar a página
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
.catch(function(error) {
  console.error('Error to authenticate on Firebase', error);
  var errorMessage = error.message;
});

// Armazena o timestamp de início da sessão do chat
sessionStorage.setItem('timestamp', Date.now());

// Inicializa o um observador para verificar mudanças de estados 
// na autenticação do usuário do Firebase.
// Por exemplo, quando o usuário entra ou sai do sistema.
firebase.auth().onAuthStateChanged(function(user){
  authStateObserver(user);
});

// Função para autenticar o usuário no sistema
function signIn() {
  // Realiza o login do usuário com uma conta do Google
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function() {
    firebase.database().ref('users/' + getUserId()).set({
      id: getUserId(),
      name: getUserName(),
      image : getProfileImageUrl()
    });
    firebase.database().ref('/messages/').push({
      user: getUserId(),
      text: 'Singin',
      timestamp: Date.now()
    }).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
    }).then(function(snap) {
      // Chama a função que contém o AJAX para cadastro da mensagem
      ajaxSendMessageLogin(snap.key);
    });
  });
}

// Função para encerrar a sessão do usuário no sistema
function signOut() {
  let user_id = getUserId();
  let user_name = getUserName();
  let user_image = getProfileImageUrl();
  // Realiza o logout.
  firebase.database().ref('users/' + getUserId()).remove();
  firebase.database().ref('/messages/').push({
    user: getUserId(),
    text: 'SingOut',
    timestamp: Date.now()
  }).catch(function(error) {
    console.error('Error writing new message to Firebase Database', error);
  }).then(function(snap) {
    // Chama a função que contém o AJAX para cadastro da mensagem
    ajaxSendMessageLogout(snap.key, user_id, user_name, user_image);
  });
  firebase.auth().signOut();
}

//Encerra a sessão antes de fechar ou atualizar a página
window.addEventListener('beforeunload', function (event) {
  signOut();
});
window.addEventListener('unload', function (event) {
  signOut();
});

// Função para recuperar a URL com a imagem do usuário autenticado
// @return URL da imagem do usuário autenticado
function getProfileImageUrl() {
  return firebase.auth().currentUser.photoURL || 'http://cafe.intermidia.icmc.usp.br:22080/humberto/pw1/images/profile.png';
}

// Função para recuperar o nome do usuário autenticado
// @return Nome do usuário autenticado
function getUserName() {
  return firebase.auth().currentUser.displayName;
}

// Função para recuperar o nome do usuário autenticado
// @return Nome do usuário autenticado
function getUserId() {
  return firebase.auth().currentUser.uid;
}

// Função para verificar se o usuário está autenticado
// Retorna TRUE se o usuário está autenticado e FALSE caso contrário
function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}

// Salva a requisição da mensagem no Firebase e envia a mensagem para o Servidor
function saveMessage() {
  // Adiciona uma nova entrada na base de dados do Firebase.
  return firebase.database().ref('/messages/').push({
    user: getUserId(),
    text: getMessageInput(),
    timestamp: Date.now()
  }).catch(function(error) {
    console.error('Error writing new message to Firebase Database', error);
  }).then(function(snap) {
    // Chama a função que contém o AJAX para cadastro da mensagem
    ajaxSendMessage(snap.key);
  });
}

// Função para verificar se o usuário está autenticado.
// @return TRUE se o usuário estiver conectado. 
//         Caso contrário, FALSE e exibe uma mensagem de alerta.
function checkSignedInWithMessage() {
  // Retorna TRUE se o usuário estiver conectado no Firebase
  if (isUserSignedIn()) {
    return true;
  }

  // Mostra uma mensagem para o usuário usando uma caixa de alerta
  Swal.fire({
    position: 'top-end',
    title: 'Você precisa realizar o login antes de enviar uma mensagem!',
    showConfirmButton: false,
    timer: 3000,
    icon: 'warning'
  })

  return false;
}

// Carrega as mensagens de chat existentes a partir do momento que 
// a página foi carregada e fica aguardando por novas mensagens.
firebase.database()
    .ref('/messages/')
    .orderByChild('timestamp')
    .startAt(Number(sessionStorage.getItem('timestamp')))
    .on('child_added', function(snap) {
      var data = snap.val();
      setTimeout(function(){ ajaxReceiveMessage(snap.key); }, 1000);
    });

// Carrega os usuários online a partir do momento que a página foi carregada 
// Fica aguardando por novos usuários.
firebase.database()
    .ref('/users/')
    .orderByChild('name')
    .on('child_added', function(snap) {
      var data = snap.val();
      showUserOnline(data.id, data.name, data.image);
    })
// Fica aguardando quando um usuário realiza logout.
firebase.database()
    .ref('/users/')
    .orderByChild('name')
    .on('child_removed', function(snap) {
      var data = snap.val();
      hideUserOnline(data.id, data.name, data.image);
    });