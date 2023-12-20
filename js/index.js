let countPosts = 0;

let localStorageData = localStorage.getItem("postsStorage");
let postsStorage = [];

if(localStorageData!=="" && localStorageData!== null)
{
    postsStorage = JSON.parse(localStorageData);
    for (let postObj of postsStorage)
    {
        postObj.id = ++countPosts;
        document.getElementById("body-posts").append(CreatePost(postObj));
    }
    localStorage.setItem("postsStorage", JSON.stringify(postsStorage));
}

//Получить данные с сервера по id пользователя
async function GetUserName(userId)
{
    let response = await fetch("https://jsonplaceholder.typicode.com/users/"+ userId);

    if(response.ok)
    {
        let data = await response.json();
        return data.username;
    }
    else
    {
        console.log(`ERROR: ${response.status}`);
    }
}

function EditPost(postBlock)
{
    document.getElementById("modal-edit-window").classList.add("open");

    // Форма редактирования поста
    let editForm = document.forms.editForm;

    let postUser = postBlock.querySelector(".post__name");
    let postTitle = postBlock.querySelector(".post__title");
    let postText = postBlock.querySelector(".post__text");

    editForm.id.value = postBlock.id;
    editForm.userId.value = postUser.id;
    editForm.title.value = postTitle.textContent;
    editForm.text.value = postText.textContent;
}

async function HandleEditFormSubmit(e)
{
    e.preventDefault();

    ToggleLoader(2);

    let editFormData = new FormData(e.target);

    let postBlock = document.getElementById(editFormData.get("id"));
    let postId = editFormData.get("id").replace(/[^0-9]+/, "");
    let postUserName = await GetUserName(editFormData.get("userId"));

    let postObj = {
        id:postId,
        userId:editFormData.get("userId"),
        userName: postUserName,
        title:editFormData.get("title"),
        text:editFormData.get("text"),
    };

    postBlock.querySelector(".post__name").id = postObj.userId;
    postBlock.querySelector(".post__name").textContent = postUserName;
    postBlock.querySelector(".post__title").textContent = postObj.title;
    postBlock.querySelector(".post__text").textContent = postObj.text;

    let findObj = postsStorage.find((elem)=>elem.id == postId);
    let index = postsStorage.indexOf(findObj);

    postsStorage[index].userId = postObj.userId;
    postsStorage[index].userName = postObj.userName;
    postsStorage[index].title = postObj.title;
    postsStorage[index].text = postObj.text;

    localStorage.setItem("postsStorage", JSON.stringify(postsStorage));

    ToggleLoader(2);

    document.getElementById("modal-edit-window").classList.remove("open");
    e.target.reset();
}

document.forms.editForm.addEventListener("submit", HandleEditFormSubmit);

function DeletePost(postBlock)
{
    let postId = postBlock.id.replace(/[^0-9]+/, "");
    postsStorage = postsStorage.filter((elem)=>elem.id != postId);
    localStorage.setItem("postsStorage", JSON.stringify(postsStorage));
}

function CreatePost(postObj)
{
    // Создание узла в DOM дереве (блок с постом)
    const postBlock = document.createElement("div");
    postBlock.classList.add("post-block");
    postBlock.id = "post-block-" + postObj.id;

    const user = document.createElement("div");
    user.classList.add("post__name");
    user.id = postObj.userId;
    user.textContent = postObj.userName;

    const title = document.createElement("div");
    title.classList.add("post__title");
    title.textContent = postObj.title;

    const text = document.createElement("div");
    text.classList.add("post__text");
    text.textContent = postObj.text;

    // Добавление кнопок редактирования и удаления в блок с постом
    const flex = document.createElement("div");
    flex.classList.add("post__flex-row");

    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.textContent = "Редактировать";

    // Подписка на событие нажатия кнопки редактирования поста
    editButton.addEventListener("click", async function(){
        EditPost(postBlock);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "✖";

    // Подписка на событие нажатия кнопки удаления поста
    deleteButton.addEventListener("click", function(){
        DeletePost(postBlock);
        postBlock.remove();
    });

    flex.append(editButton, deleteButton);
    postBlock.append(user, title, text, flex);

    return postBlock;
}

async function HandleAddFormSubmit(e)
{
    e.preventDefault();

    ToggleLoader(1);

    let addFormData = new FormData(e.target);

    let postUserName = await GetUserName(addFormData.get("userId"));

    let postObj = {
        id:++countPosts,
        userId:addFormData.get("userId"),
        userName: postUserName,
        title:addFormData.get("title"),
        text:addFormData.get("text")
    };

    postsStorage.push(postObj);
    localStorage.setItem("postsStorage", JSON.stringify(postsStorage));

    ToggleLoader(1);

    document.getElementById("modal-add-window").classList.remove("open");
    document.getElementById("body-posts").append(CreatePost(postObj));
    e.target.reset();
}

document.forms.addForm.addEventListener("submit", HandleAddFormSubmit);

// Открыть форму добавления поста
document.getElementById("body-add-button").addEventListener("click", function(){
    document.getElementById("modal-add-window").classList.add("open");
});

// Закрыть форму добавления поста
document.getElementById("modal-add-close-button").addEventListener("click", function(){
    document.getElementById("modal-add-window").classList.remove("open");
});

// Закрыть форму редактирования поста
document.getElementById("modal-edit-close-button").addEventListener("click", function(){
    document.getElementById("modal-edit-window").classList.remove("open");
    document.forms.editForm.reset();
});

function ToggleLoader(loaderId)
{
    document.getElementById("loader-"+loaderId).classList.toggle("hide-loader");
}
