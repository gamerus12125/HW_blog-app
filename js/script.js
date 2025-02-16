"use strict";

const URL = "https://web-app-papatomatoe.herokuapp.com";

const menuButton = document.querySelector(".header__button");
const menu = document.querySelector(".header__menu");
const postsSection = document.querySelector(".posts");
const loader = postsSection.querySelector(".posts__loader");
const form = document.querySelector(".add-post__form");
const postTitle = form.querySelector(".add-post__input");
const postContent = form.querySelector(".add-post__content");
const submitButton = form.querySelector(".add-post__button");
const postsError = document.querySelector(".posts__error");
const addPostError = document.querySelector(".add-post__error");

const fragment = new DocumentFragment();

menuButton.addEventListener("click", () => {
  menuButton.classList.toggle("header__button--active");
  menu.classList.toggle("header__menu--active");
});

const getPostMarkup = ({ title, content, createDate }) => {
  const li = document.createElement("li");
  const h3 = document.createElement("h3");
  const p = document.createElement("p");
  const time = document.createElement("time");

  h3.innerText = title;
  h3.classList.add("posts__title");
  p.innerText = content;
  p.classList.add("posts__content");

  time.innerText = new Date(createDate).toLocaleDateString();
  time.classList.add("posts__date");
  time.setAttribute("datetime", createDate);

  li.classList.add("posts__item");

  li.append(h3);
  li.append(p);
  li.append(time);

  return li;
};

const getPostsFromServer = async () => {
  const postList = document.querySelector(".posts__list");
  if (postList) {
    postList.remove();
    postsSection.append(loader);
  }

  try {
    const response = await fetch(`${URL}/posts`);
    const posts = await response.json();

    posts.reverse().forEach((post) => {
      const postMarkup = getPostMarkup(post);
      fragment.append(postMarkup);
    });

    const ul = document.createElement("ul");
    ul.classList.add("posts__list");
    ul.append(fragment);

    postsSection.append(ul);
  } catch (error) {
    postsError.classList.remove("visually-hidden");
    console.error(error);
  } finally {
    loader.remove();
  }
};

getPostsFromServer();

const checkFormFields = () => {
  submitButton.disabled = !postTitle.value || !postContent.value;
};

postTitle.addEventListener("input", checkFormFields);
postContent.addEventListener("input", checkFormFields);

const hideError = () =>
  addPostError.classList.remove("add-post__error--active");

const sendPostToServer = async (e) => {
  e.preventDefault();
  submitButton.innerText = "saving";
  submitButton.disabled;

  if (!postTitle.value || !postContent.value) return;

  const body = {
    title: postTitle.value,
    content: postContent.value,
    sectionId: 1,
  };

  try {
    const response = await fetch(`${URL}/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      const postMarkup = getPostMarkup(post);
      const postList = document.querySelector(".posts__list");
      postList.prepend(postMarkup);
      window.scrollTo({ top: 0 });

      postTitle.value = "";
      postContent.value = "";
      checkFormFields();
      submitButton.innerText = "Add post";
      submitButton.disabled;
    } else {
      addPostError.classList.add("add-post__error--active");
      setTimeout(hideError, 3000);
      submitButton.innerText = "Add post";
    }
  } catch (error) {
    console.log(error);
  }

  const post = await response.json();
};

form.addEventListener("submit", sendPostToServer);
