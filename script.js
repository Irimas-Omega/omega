// Global variables for news items
let newsItems = [];
let newsDisplayCount = 3;

// Render news items based on the current display count
function renderNews() {
  const newsList = document.getElementById("news-list");
  newsList.innerHTML = "";
  const itemsToShow = newsItems.slice(0, newsDisplayCount);

  itemsToShow.forEach((news) => {
    const div = document.createElement("div");
    div.className = "col-12 news-item";
    // Format: date: text
    div.innerHTML = `
      <div class="d-flex">
        <span><strong>${news.date}:</strong> ${news.text}</span>
      </div>
    `;
    newsList.appendChild(div);
  });
}

// Event listeners for "Show More" and "Show Less" buttons
document.getElementById("show-more").addEventListener("click", () => {
  if (newsDisplayCount < newsItems.length) {
    newsDisplayCount += 3;
    renderNews();
  }
});

document.getElementById("show-less").addEventListener("click", () => {
  newsDisplayCount = Math.max(3, newsDisplayCount - 3);
  renderNews();
});

// Load news data from news.json
function loadNews() {
  fetch("data/news.json")
    .then((response) => response.json())
    .then((data) => {
      newsItems = data;
      renderNews();
    })
    .catch((error) => console.error("Error loading news:", error));
}

// Load team members from members.json
function loadMembers() {
  fetch("data/members.json")
    .then((response) => response.json())
    .then((data) => {
      const membersList = document.getElementById("members-list");
      data.forEach((member) => {
        const col = document.createElement("div");
        col.className = "col-6 col-md-4 col-lg-3 col-xl-2 mb-4";
        col.innerHTML = `
          <div class="card shadow-sm hover-card min-height">
            <img src="${member.image ? member.image : "img/avatar.png"}" alt="${member.firstName} ${member.lastName}" class="card-img-top member-img mt-3">
            <div class="card-body text-center">
              <h5 class="card-title">${member.firstName} ${member.lastName}</h5>
              <p class="card-text">${member.position}</p>
            </div>
          </div>
        `;
        membersList.appendChild(col);
      });
    })
    .catch((error) => console.error("Error loading members:", error));
}

// Load projects and collaborations from projects.json
function loadProjects() {
  fetch("data/projects.json")
    .then((response) => response.json())
    .then((data) => {
      const projectsList = document.getElementById("projects-list");
      data.forEach((project) => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4";
        col.innerHTML = `
          <div class="card shadow project-card">
            <div class="card-body">
              <h5 class="card-title">${project.title || "Project"}</h5>
              <p class="card-text">
                <strong>Start:</strong> ${project.startDate} <br>
                <strong>End:</strong> ${project.endDate}
              </p>
              <p class="card-text">${project.description}</p>
            </div>
          </div>
        `;
        projectsList.appendChild(col);
      });
    })
    .catch((error) => console.error("Error loading projects:", error));
}

/* Helper function: Format publication info in MLA style */
function formatMLACitation(pub) {
  let citation = `${pub.authors}. "<em>${pub.paperTitle}</em>." ${pub.journal}, ${pub.year}.`;
  if (pub.link) {
    citation += ` <a href="${pub.link}" target="_blank">[Link]</a>`;
  }
  return citation;
}

// Load publications from publications.json, group by category, number them, and apply hover & colors
function loadPublications() {
  fetch("data/publications.json")
    .then((response) => response.json())
    .then((data) => {
      const publicationsContent = document.getElementById("publications-content");
      // Group publications by category
      const grouped = {};
      data.forEach((pub) => {
        if (!grouped[pub.category]) {
          grouped[pub.category] = [];
        }
        grouped[pub.category].push(pub);
      });

      // Create sections for each category with MLA citations and numbering
      for (const category in grouped) {
        const section = document.createElement("div");
        section.className = "publication-section";
        const header = document.createElement("h4");
        header.textContent = category;
        section.appendChild(header);

        grouped[category].forEach((pub, index) => {
          const div = document.createElement("div");
          div.className = "publication-item";
          // Prepend numbering (index+1) to each publication
          div.innerHTML = `
            <span class="pub-number">${index + 1}.</span>
            <p class="mla-citation">${formatMLACitation(pub)}</p>
          `;
          section.appendChild(div);
        });
        publicationsContent.appendChild(section);
      }
    })
    .catch((error) => console.error("Error loading publications:", error));
}

// Initialize data when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadNews();
  loadMembers();
  loadProjects();
  loadPublications();
});
