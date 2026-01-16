const searchBtn = document.getElementById("searchBtn");
const usernameInput = document.getElementById("username");
const profileDiv = document.getElementById("profile");
const reposDiv = document.getElementById("repos");
const errorP = document.getElementById("error");

searchBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (!username) return;

  fetchProfile(username);
});

async function fetchProfile(username) {
  errorP.textContent = "";
  profileDiv.innerHTML = "";
  reposDiv.innerHTML = "";

  try {
    // Fetch profile using the username that is passed into the input feild
    const resProfile = await fetch(`https://api.github.com/users/${username}`);
    if (!resProfile.ok) throw new Error("User not found");

    const user = await resProfile.json();

    // Display profile of the user with the avatar
    profileDiv.innerHTML = `
      <div class="profile-card">
        <img src="${user.avatar_url}" alt="profile" />
        <h2>${user.name || user.login}</h2>
        <p>${user.bio || ""}</p>
        <p>Repos: ${user.public_repos} | Followers: ${user.followers} | Following: ${user.following}</p>
        <button onclick="window.open('${user.html_url}', '_blank')">View Profile</button>
      </div>
    `;

    //this will fethches the latet 5 repos of the user 
    const resRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
    const repos = await resRepos.json();

    if (repos.length > 0) {
      reposDiv.innerHTML = "<h3>Latest Repositories</h3>";
      repos.forEach(repo => {
        const repoCard = document.createElement("div");
        repoCard.className = "repo-card";
        repoCard.innerHTML = `
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
          <div class="repo-info">
            <span>${repo.stargazers_count}</span>
            <span>${repo.language || "N/A"}</span>
          </div>
        `;
        reposDiv.appendChild(repoCard);
      });
    }

  } catch (err) {
    errorP.textContent = err.message;
  }
}
