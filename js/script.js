"use strict";
const url = "https://web-app-papatomatoe.herokuapp.com/posts";
const mainMenu = document.querySelector(".header__menu");
const burgerButton = document.querySelector(".header__button");
const postsError = document.querySelector(".posts__error");
const inputTitle = document.querySelector(".add-post__input");
const addPostButton = document.querySelector(".add-post__button");
const postContent = document.querySelector(".add-post__content");
const list = document.querySelector(".posts__list");

const openMenu = () => {
  if (burgerButton.classList.contains("header__button--active")) {
    mainMenu.style.display = "none";
    burgerButton.classList.remove("header__button--active");
    burgerButton.classList.add("header__button");
  } else {
    mainMenu.style.display = "block";
    burgerButton.classList.remove("header__button");
    burgerButton.classList.add("header__button--active");
  }
};
burgerButton.addEventListener("click", openMenu);

const checkForm = () => {
  if (inputTitle.value == "" || postContent.value == "") {
    if (addPostButton.hasAttribute("disabled")) {
    } else {
      addPostButton.setAttribute("disabled", "disabled");
    }
  } else {
    addPostButton.removeAttribute("disabled");
  }
};

const createPost = () => {
  const item = document.createElement("li");
  const title = document.createElement("h3");
  const content = document.createElement("p");
  const date = document.createElement("date");
  title.innerText = inputTitle.value;
  content.innerText = postContent.value;
  date.innerText = new Date();
  item.classList.add("posts__item");
  title.classList.add("posts__title");
  content.classList.add("posts__content");
  date.classList.add("posts__date");
  list.prepend(item);
  item.append(title, content, date);
  inputTitle.value = "";
  postContent.value = "";
  addPostButton.setAttribute("disabled", "disabled");
};
const generatePosts = (post) => {
  const time = new Date(post.createDate);
  const item = document.createElement("li");
  const title = document.createElement("h3");
  const content = document.createElement("p");
  const date = document.createElement("date");
  const loader = document.querySelector(".posts__loader");
  loader.classList.add("visually-hidden");
  list.classList.remove("visually-hidden");
  title.innerText = post.title;
  content.innerText = post.content;
  date.innerText = time;
  item.classList.add("posts__item");
  title.classList.add("posts__title");
  content.classList.add("posts__content");
  date.classList.add("posts__date");
  date.setAttribute("datetime", time);
  list.append(item);
  item.append(title, content, date);
};

const GetPosts = async (url) => {
  try {
    let response = await fetch(url);
    let posts = await response.json();
    console.log(posts);
    posts.forEach((posts) => {
      generatePosts(posts);
    });
  } catch (error) {
    postsError.classList.remove("visually-hidden");
    console.error(error);
  }
};

GetPosts(url);
inputTitle.addEventListener("keyup", checkForm);
postContent.addEventListener("keyup", checkForm);
inputTitle.addEventListener("keydown", checkForm);
postContent.addEventListener("keydown", checkForm);
addPostButton.addEventListener("click", createPost);
