const twitchApi = {
  api: "https://id.twitch.tv/oauth2/authorize",
  response_type: 'token',
  client_id: '2tmc0zaqoqsblbtv0v3tbj583q6kl5',
  scope: 'user:read:follows',
  redirect_uri: 'https://nicodemos234.github.io/twitch.html'
}
document.querySelector('#login-btn').addEventListener('click', (event) => {
  event.preventDefault();

  chrome.tabs.create({ url: `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${twitchApi.client_id}&redirect_uri=${twitchApi.redirect_uri}&scope=${twitchApi.scope}` })
})

const handleUser = (user, token) => {
  document.querySelector('#username').innerHTML = user.display_name;
  $.ajax({
    url: `https://api.twitch.tv/helix/streams/followed?user_id=${user.id}`,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Client-Id": twitchApi.client_id
    }
  }).then(resp => {
    resp.data.forEach(item => {
      const wrapperDiv = document.querySelector("#lives-here");
      wrapperDiv.innerHTML = wrapperDiv.innerHTML + `
      <a href="https://twitch.tv/${item.user_login}" target="_blank">
      <div class="card-live">
      <div>
        <img src="${item.thumbnail_url.replace('{width}', '500').replace('{height}', '280')}" />
      </div>
      <div  class="right-side">
        <h3>
        <span style="font-size: 14px; color: #a970ff; font-weight: 800;">${item.user_name}</span>: ${item.title}
        </h3>
        <div class="line-2">
          <div class="category">${item.game_name}</div>
          <div class="online-now">
            <div class="red-dot"></div>${item.viewer_count}
          </div>
        </div>
      </div>
    </div>
      </a>
      `;
    })
  })
}

chrome.storage.local.get("token", function (data) {
  if (!!data.token) {
    // Remove the login btn if is logged
    document.querySelector('#login-btn').style.display = 'none';
    chrome.storage.local.get("user", function (user) {
      const token = data.token
      if (!user.user) {
        $.ajax({
          url: 'https://api.twitch.tv/helix/users',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Client-Id": twitchApi.client_id
          }
        }).then(resp => {
          const user = resp.data[0]
          chrome.storage.local.set({
            user
          }, function () { });
          handleUser(user, token)
        })
      } else {
        handleUser(user.user, token)
      }
    })
  }
});
