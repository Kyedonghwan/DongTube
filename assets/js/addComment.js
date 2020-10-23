import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
const deleteBtn = document.querySelectorAll(".jsDeleteBtn");

const increaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
}

const decreaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
}

const addComment = (comment, newCommentId) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const deleteBtn = document.createElement("button");
    li.id = newCommentId;
    deleteBtn.innerHTML = "❌";
    deleteBtn.addEventListener("click", handleDelete);
    span.innerHTML = comment;
    li.appendChild(span);
    li.appendChild(deleteBtn);
    commentList.prepend(li);
    increaseNumber();
}


const sendComment = async (comment) => {
    const videoId = window.location.href.split("/videos/")[1];
    const response = await axios({
        url: `/api/${videoId}/comment`,
        method: "POST",
        data: {
            comment
        }
    });
    const newCommentId = response.data.newCommentId;
    if (response.status === 200) {
        addComment(comment, newCommentId);
    }

}

const handleSubmit = (event) => {
    event.preventDefault();
    const commentInput = addCommentForm.querySelector("input");
    const comment = commentInput.value;
    sendComment(comment);
    commentInput.value = "";
}

const deleteComment = async (deleteCommentId, li) => {
    const videoId = window.location.href.split("/videos/")[1];
    const response = await axios({
        url: `/api/${videoId}/del-comment`,
        method: "POST",
        data: {
            deleteCommentId
        }
    });
    if (response.status === 200) {
        commentList.removeChild(li);
        decreaseNumber();
    }
}

const handleDelete = (event) => {
    const li = event.target.parentNode;
    const deleteCommentId = li.id;
    deleteComment(deleteCommentId, li);
}


function init() {
    addCommentForm.addEventListener("submit", handleSubmit);
    deleteBtn.forEach(btn => {
        btn.addEventListener("click", handleDelete);
    });
}



if (addCommentForm) {
    init();
}