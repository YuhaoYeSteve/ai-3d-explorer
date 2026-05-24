(function () {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 3, 5);
  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.getElementById('game-container').appendChild(renderer.domElement);

  var groundGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
  var groundMaterial = new THREE.MeshStandardMaterial({ color: 0x3a5a3a });
  var ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  var ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 10);
  scene.add(directionalLight);

  var skyCanvas = document.createElement('canvas');
  skyCanvas.width = 2048;
  skyCanvas.height = 1024;
  var skyCtx = skyCanvas.getContext('2d');
  var gradient = skyCtx.createLinearGradient(0, 0, 0, skyCanvas.height);
  gradient.addColorStop(0, '#0a1a3a');
  gradient.addColorStop(0.5, '#4a90d9');
  gradient.addColorStop(1, '#ffffff');
  skyCtx.fillStyle = gradient;
  skyCtx.fillRect(0, 0, skyCanvas.width, skyCanvas.height);
  var skyTexture = new THREE.CanvasTexture(skyCanvas);
  skyTexture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = skyTexture;
  scene.environment = skyTexture;

  var character = new THREE.Group();

  var head = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 8, 6),
    new THREE.MeshStandardMaterial({ color: 0xffd5b4 })
  );
  head.position.y = 1.4;
  character.add(head);

  var body = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.6, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x4a90d9 })
  );
  body.position.y = 0.85;
  character.add(body);

  var leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.35, 1.1, 0);
  var leftArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.5, 0.15),
    new THREE.MeshStandardMaterial({ color: 0x4a90d9 })
  );
  leftArm.position.y = -0.25;
  leftArmPivot.add(leftArm);
  character.add(leftArmPivot);

  var rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.35, 1.1, 0);
  var rightArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.5, 0.15),
    new THREE.MeshStandardMaterial({ color: 0x4a90d9 })
  );
  rightArm.position.y = -0.25;
  rightArmPivot.add(rightArm);
  character.add(rightArmPivot);

  var leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.12, 0.5, 0);
  var leftLeg = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.5, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x2d5a8a })
  );
  leftLeg.position.y = -0.25;
  leftLegPivot.add(leftLeg);
  character.add(leftLegPivot);

  var rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.12, 0.5, 0);
  var rightLeg = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.5, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x2d5a8a })
  );
  rightLeg.position.y = -0.25;
  rightLegPivot.add(rightLeg);
  character.add(rightLegPivot);

  scene.add(character);

  var isWalking = false;
  var walkTime = 0;
  var keys = {};
  var moveSpeed = 0.08;

  window.addEventListener('keydown', function (e) {
    keys[e.key.toLowerCase()] = true;
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].indexOf(e.key.toLowerCase()) !== -1) {
      e.preventDefault();
    }
  });
  window.addEventListener('keyup', function (e) {
    keys[e.key.toLowerCase()] = false;
  });

  function isChatFocused() {
    return document.activeElement === chatInput;
  }

  function updateCharacterAnimation(delta) {
    if (isWalking) {
      walkTime += delta * 8;
      leftArmPivot.rotation.x = Math.sin(walkTime) * 0.5;
      rightArmPivot.rotation.x = -Math.sin(walkTime) * 0.5;
      leftLegPivot.rotation.x = -Math.sin(walkTime) * 0.5;
      rightLegPivot.rotation.x = Math.sin(walkTime) * 0.5;
      character.position.y = 0;
    } else {
      leftArmPivot.rotation.x = 0;
      rightArmPivot.rotation.x = 0;
      leftLegPivot.rotation.x = 0;
      rightLegPivot.rotation.x = 0;
      character.position.y = Math.sin(Date.now() * 0.003) * 0.02;
    }
  }

  function updateCharacterPosition() {
    if (isChatFocused()) {
      isWalking = false;
      return;
    }

    var moveDir = new THREE.Vector3(0, 0, 0);
    var forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    var right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    if (keys['w'] || keys['arrowup']) moveDir.add(forward);
    if (keys['s'] || keys['arrowdown']) moveDir.sub(forward);
    if (keys['a'] || keys['arrowleft']) moveDir.sub(right);
    if (keys['d'] || keys['arrowright']) moveDir.add(right);

    if (moveDir.length() > 0) {
      moveDir.normalize();
      character.position.x += moveDir.x * moveSpeed;
      character.position.z += moveDir.z * moveSpeed;
      character.rotation.y = Math.atan2(moveDir.x, moveDir.z);
      isWalking = true;
    } else {
      isWalking = false;
    }

    character.position.x = Math.max(-48, Math.min(48, character.position.x));
    character.position.z = Math.max(-48, Math.min(48, character.position.z));
  }

  function updateCamera() {
    var targetPos = new THREE.Vector3(
      character.position.x,
      character.position.y + 3,
      character.position.z + 5
    );
    camera.position.lerp(targetPos, 0.05);
    camera.lookAt(character.position);
  }

  var chatInput = document.getElementById('chat-input');
  var chatSend = document.getElementById('chat-send');
  var chatMessages = document.getElementById('chat-messages');

  function addMessage(text, type) {
    var msg = document.createElement('div');
    msg.className = 'chat-message ' + type;
    msg.innerHTML = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msg;
  }

  async function generateEnvironment(prompt) {
    var fullPrompt = prompt + '，360 degree panoramic view, equirectangular, full surround environment, seamless';
    var loadingMsg = addMessage('正在生成环境... <span class="loading-dots"><span></span><span></span><span></span></span>', 'system');
    var fadeOverlay = document.getElementById('fade-overlay');

    try {
      var response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt })
      });

      var data = await response.json();

      if (data.data && data.data[0] && data.data[0].b64_json) {
        var b64 = data.data[0].b64_json;
        var img = new Image();
        img.onload = function () {
          var previewOverlay = document.getElementById('preview-overlay');
          var previewPopup = document.getElementById('preview-popup');
          var previewImage = document.getElementById('preview-image');
          previewImage.src = 'data:image/png;base64,' + b64;
          previewOverlay.classList.add('active');
          previewPopup.classList.add('active');
          loadingMsg.innerHTML = '图片已生成，请预览';
          var applyBtn = document.getElementById('preview-apply-btn');
          var cancelBtn = document.getElementById('preview-cancel-btn');
          var closeBtn = document.getElementById('preview-close-btn');
          function applySkybox() {
            previewOverlay.classList.remove('active');
            previewPopup.classList.remove('active');
            fadeOverlay.classList.add('active');
            setTimeout(function () {
              var texture = new THREE.Texture(img);
              texture.mapping = THREE.EquirectangularReflectionMapping;
              texture.needsUpdate = true;
              scene.background = texture;
              scene.environment = texture;
              setTimeout(function () {
                fadeOverlay.classList.remove('active');
              }, 100);
              loadingMsg.innerHTML = '环境已生成！';
            }, 500);
            cleanup();
          }
          function closePreview() {
            previewOverlay.classList.remove('active');
            previewPopup.classList.remove('active');
            loadingMsg.innerHTML = '已取消应用';
            loadingMsg.className = 'chat-message system';
            cleanup();
          }
          function cleanup() {
            applyBtn.removeEventListener('click', applySkybox);
            cancelBtn.removeEventListener('click', closePreview);
            closeBtn.removeEventListener('click', closePreview);
            previewOverlay.removeEventListener('click', closePreview);
          }
          applyBtn.addEventListener('click', applySkybox);
          cancelBtn.addEventListener('click', closePreview);
          closeBtn.addEventListener('click', closePreview);
          previewOverlay.addEventListener('click', closePreview);
        };
        img.src = 'data:image/png;base64,' + b64;
      } else {
        loadingMsg.className = 'chat-message error';
        loadingMsg.innerHTML = '生成失败：无效的响应数据';
      }
    } catch (err) {
      loadingMsg.className = 'chat-message error';
      loadingMsg.innerHTML = '生成失败：' + err.message;
    }

    chatInput.disabled = false;
    chatSend.disabled = false;
    chatInput.focus();
  }

  function handleSend() {
    var text = chatInput.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    chatInput.value = '';
    chatInput.disabled = true;
    chatSend.disabled = true;
    generateEnvironment(text);
  }

  chatSend.addEventListener('click', handleSend);
  chatInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      handleSend();
    }
  });

  var clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    var delta = clock.getDelta();
    updateCharacterAnimation(delta);
    updateCharacterPosition();
    updateCamera();
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
