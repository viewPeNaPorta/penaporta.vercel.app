import * as params from "@params";

const resList = document.getElementById("searchResults");
const sInput = document.getElementById("searchInput");

let fuse;
let first;
let last;
let currentElem = null;
let resultsAvailable = false;
let allPosts = [];

if (resList && sInput) {
  window.addEventListener("load", loadIndex);
  sInput.onkeyup = handleSearch;
  sInput.addEventListener("search", handleNativeSearchReset);
  document.onkeydown = handleKeyboardNavigation;
}

function loadIndex() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) {
      return;
    }

    if (xhr.status !== 200) {
      console.log(xhr.responseText);
      return;
    }

    const data = JSON.parse(xhr.responseText) || [];
    allPosts = data.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    fuse = new Fuse(allPosts, getFuseOptions());
    renderResults(allPosts);
  };

  xhr.open("GET", "../index.json");
  xhr.send();
}

function getFuseOptions() {
  if (!params.fuseOpts) {
    return {
      distance: 100,
      threshold: 0.4,
      ignoreLocation: true,
      keys: ["title", "summary", "content", "permalink"],
    };
  }

  return {
    isCaseSensitive: params.fuseOpts.iscasesensitive ?? false,
    includeScore: params.fuseOpts.includescore ?? false,
    includeMatches: params.fuseOpts.includematches ?? false,
    minMatchCharLength: params.fuseOpts.minmatchcharlength ?? 1,
    shouldSort: params.fuseOpts.shouldsort ?? true,
    findAllMatches: params.fuseOpts.findallmatches ?? false,
    keys: params.fuseOpts.keys ?? ["title", "summary", "content", "permalink"],
    location: params.fuseOpts.location ?? 0,
    threshold: params.fuseOpts.threshold ?? 0.4,
    distance: params.fuseOpts.distance ?? 100,
    ignoreLocation: params.fuseOpts.ignorelocation ?? true,
  };
}

function renderResults(items) {
  if (!items || items.length === 0) {
    resultsAvailable = false;
    resList.innerHTML = "";
    return;
  }

  let resultSet = "";
  for (let item of items) {
    const dateText = item.date || "";
    resultSet += `<li class="post-entry"><header class="entry-header">${item.title}</header><div class="entry-content"><p>${dateText}</p></div><a href="${item.permalink}" aria-label="${item.title}"></a></li>`;
  }

  resList.innerHTML = resultSet;
  resultsAvailable = true;
  first = resList.firstChild;
  last = resList.lastChild;
}

function activeToggle(ae) {
  document.querySelectorAll(".focus").forEach(function (element) {
    element.classList.remove("focus");
  });
  if (ae) {
    ae.focus();
    currentElem = ae;
    ae.parentElement.classList.add("focus");
  } else {
    document.activeElement.parentElement.classList.add("focus");
  }
}

function reset() {
  sInput.value = "";
  renderResults(allPosts);
  sInput.focus();
}

function handleSearch() {
  if (!fuse) return;

  const query = this.value.trim();

  if (!query) {
    renderResults(allPosts);
    return;
  }

  let results;
  if (params.fuseOpts) {
    results = fuse.search(query, { limit: params.fuseOpts.limit });
  } else {
    results = fuse.search(query);
  }

  renderResults(results.map((result) => result.item));
}

function handleNativeSearchReset() {
  if (!this.value) reset();
}

function handleKeyboardNavigation(e) {
  const key = e.key;
  let ae = document.activeElement;

  const inbox = document.getElementById("searchbox").contains(ae);

  if (ae === sInput) {
    const elements = document.getElementsByClassName("focus");
    while (elements.length > 0) {
      elements[0].classList.remove("focus");
    }
  } else if (currentElem) {
    ae = currentElem;
  }

  if (key === "Escape") {
    reset();
  } else if (!resultsAvailable || !inbox) {
    return;
  } else if (key === "ArrowDown") {
    e.preventDefault();
    if (ae == sInput) {
      activeToggle(resList.firstChild.lastChild);
    } else if (ae.parentElement != last) {
      activeToggle(ae.parentElement.nextSibling.lastChild);
    }
  } else if (key === "ArrowUp") {
    e.preventDefault();
    if (ae.parentElement == first) {
      activeToggle(sInput);
    } else if (ae != sInput) {
      activeToggle(ae.parentElement.previousSibling.lastChild);
    }
  } else if (key === "ArrowRight") {
    ae.click();
  }
}
