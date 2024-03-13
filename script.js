let count = 0;
const allPostContainer = document.getElementById("all-post");
const selectedPostContainer = document.getElementById("selected-author");
const selectPost = document.getElementById("select-post");

// Get ALl Posts
const getAllPost = async (searchText) => {
  // checking search button has a value or not
  if (!searchText) {
    selectPost.classList.add("hidden");
  }
  if (searchText === "") {
    selectPost.classList.remove("hidden");
  }
  // spinner for 2 sec
  setLoadingSpinner(true);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  allPostContainer.textContent = "";
  // Show message when search doesn't match
  const reformedText = searchText?.toLowerCase();
  if (reformedText) {
    if (!["music", "comedy", "coding"].includes(reformedText)) {
      setLoadingSpinner(false);
      allPostContainer.innerHTML = `
    <div class="min-w-full lg:min-w-[750px]">
    <h3 class="text-3xl text-center font-extrabold text-red-500"> Nothing Found!</h3>
    </div>
    `;
    }
  }
  // Get Posts according to search
  const response = await fetch(
    searchText
      ? `https://openapi.programming-hero.com/api/retro-forum/posts?category=${searchText}`
      : "https://openapi.programming-hero.com/api/retro-forum/posts"
  );
  const responseData = await response.json();
  const data = responseData.posts;

  //   Display Posts
  data.forEach((element) => {
    const postDiv = document.createElement("div");
    postDiv.innerHTML = `
        <div
        class="mb-5 flex flex-col lg:flex-row gap-6 p-10 bg-[#F3F3F5] hover:bg-[#797DFC1A] rounded-xl max-w-[770px]"
      >
        <div class="flex justify-center">
          <div>
            <img
              class="h-[72px] w-[82px] lg:w-[96px] bg-red-300 rounded-lg"
              src= ${element.image}
              alt=""
            />
          </div>
          <div class="flex justify-end">
            <i  class="fa-solid fa-circle  ${
              element.isActive === true ? "text-green-500" : "text-red-500"
            }  absolute"></i>
          </div>
        </div>
        <div class="text-center lg:text-left">
          <div class="flex justify-between lg:justify-start gap-5 font-inter text-sm font-semibold mb-3">
            <p>#${element.category}</p>
            <p>Author : ${element.author.name}</p>
          </div>
          <h2 class="font-mulish text-xl font-bold mb-4">
            ${element.title}
          </h2>
          <p class="para-text text-[16px]">${element.description}
          </p>
          <hr class=" border-2 my-5" />
          <div
            class="flex flex-col lg:flex-row justify-between items-center min-w-full lg:min-w-[600px]"
          >
            <div class="flex gap-5">
              <p class="para-text">
                <i class="me-4 fa-regular fa-comment-dots"></i> ${
                  element.comment_count
                }
              </p>
              <p class="para-text">
                <i class="me-4 fa-regular fa-eye"></i> ${element.view_count}
              </p>
              <p class="para-text">
                <i class="me-4 fa-regular fa-clock"></i> ${element.posted_time}
              </p>
            </div>
            <div class="see-message">
              <i
                class="fa-solid fa-envelope-open text-lg bg-green-500 px-2 py-1 rounded-full cursor-pointer text-white mt-5 lg:mt-0"
              ></i>
            </div>
          </div>
        </div>
      </div>
        `;
    allPostContainer.appendChild(postDiv);
    // hide spinner
    setLoadingSpinner(false);

    // Get Selected posts
    const seenMessages = postDiv.querySelectorAll(".see-message");
    for (const singleMessage of seenMessages) {
      singleMessage.addEventListener("click", () => {
        // Get Count
        count = count + 1;
        const countContainer = document.getElementById("count");
        countContainer.innerText = count;
        // Display selected post
        const selectedDiv = document.createElement("div");
        selectedDiv.innerHTML = `
      <div
      class="flex items-center justify-between p-4 bg-white rounded-xl my-4"
    >
      <h2 class="max-w-[200px]">
        ${element.title}
      </h2>
      <p><i class="fa-regular fa-eye me-2"></i> ${element.view_count}</p>
    </div>
      `;
        selectedPostContainer.appendChild(selectedDiv);
      });
    }
  });
  selectPost.classList.remove("hidden");
};

// HAndle Search Operations
const handleSearch = () => {
  // showing loader
  setLoadingSpinner(true);
  const searchText = document.getElementById("search");
  const text = searchText.value;
  getAllPost(text);
  searchText.value = "";
};

// Get All latest post
const latestPostContainer = document.getElementById("latest-post");
const getLatestPost = async () => {
  const res = await fetch(
    "https://openapi.programming-hero.com/api/retro-forum/latest-posts"
  );
  const data = await res.json();
  data.forEach((element) => {
    const latestDiv = document.createElement("div");
    latestDiv.innerHTML = `
    <div
    class="p-6 border-2 border-[#12132D26] rounded-xl space-y-4 max-w-full lg:max-w-[370px] min-h-[530px]"
  >
    <img
      class="w-full max-h-[200px]"
      src=${element.cover_image}
      alt=""
    />
    <p class="para-text">
      <i class="fa-solid fa-calendar-days me-3"></i>
      <span>${
        element.author.posted_date
          ? element.author.posted_date
          : "No Publish Date"
      }</span>
    </p>
    <h3 class="font-mulish text-2xl font-extrabold">
      ${element.title}
    </h3>
    <p class="para-text">
     ${element.description}
    </p>
    <div class="flex gap-5">
      <img
        class="h-10 w-10 rounded-full"
        src=${element.profile_image}
        alt=""
      />
      <div>
        <h3 class="font-mulish text-xl font-extrabold">
          ${element.author.name}
        </h3>
        <p>${
          element.author.designation ? element.author.designation : "Unknown"
        }</p>
      </div>
    </div>
  </div>
    
    `;
    latestPostContainer.appendChild(latestDiv);
  });
};
// Loading Spinner
const loadingSpinner = document.getElementById("loading-spinner");
const setLoadingSpinner = (isLoading) => {
  if (isLoading) {
    loadingSpinner.classList.remove("hidden");
  } else {
    loadingSpinner.classList.add("hidden");
  }
};
getAllPost();
getLatestPost();
