const tree = [
    {
        type: "folder",
        name: "src",
        children: [
            {
                type: "folder",
                name: "components",
                children: [
                    { type: "file", name: "Header.js" },
                    { type: "file", name: "Footer.js" },
                ],
            },
            { type: "file", name: "index.js" },
        ],
    },
    { type: "file", name: "README.md" },
];
$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);
let currentNode = null;

const container = $(`.container`);
const contextMenu = $(`.contextMenu`);
const btnDelete = $(`.btn-delete`);
const btnRename = $(`.btn-rename`);

const ulRoot = document.createElement("ul");
ulRoot.classList.add(`root`);
function rd(tree, ulRoot) {
    const liElement = document.createElement("li");
    if (tree.type === "folder") {
        const divElement = document.createElement("div");
        const imgElement = document.createElement("img");
        const spanElement = document.createElement("span");

        liElement.classList.add(`folder`);

        divElement.classList.add("title");

        imgElement.src = `./asset/img/folder.svg`;
        imgElement.classList.add("icon");

        spanElement.textContent = `${tree.name}`;

        liElement.appendChild(divElement);
        divElement.appendChild(imgElement);
        divElement.appendChild(spanElement);

        ulRoot.appendChild(liElement);
        if (tree.children) {
            const ulElement = document.createElement("ul");
            ulElement.classList.add(`folder`);

            liElement.appendChild(ulElement);

            const length = tree.children.length;
            for (let i = 0; i < length; i++) {
                rd(tree.children[i], ulElement);
            }
        }
    } else {
        liElement.innerHTML = `<div class="title">
                                <img
                                    src="./asset/img/file.svg"
                                    alt="icon"
                                    class="icon"
                                />
                                <span>${tree.name}</span>
                            </div>`;
        liElement.classList.add(`file`);
        ulRoot.appendChild(liElement);
    }
}
tree.forEach((item) => {
    rd(item, ulRoot);
});
function reMoveActive() {
    const active = document.querySelector(`.active`);
    if (active) {
        active.classList.remove(`active`);
    }
}
container.appendChild(ulRoot);
container.onclick = function (e) {
    e.stopPropagation();
    reMoveActive();
    const folder = e.target.closest(`.folder`);
    const file = e.target.closest(`.file`);
    const detail = e.target.closest(`.title`);
    if (folder && !file) {
        folder.childNodes.forEach((node) => {
            node.classList.toggle(`show`);
            node.childNodes.forEach((nodeChild) => {
                nodeChild.classList.toggle(`show`);
            });
        });
    }
    if (detail) {
        detail.classList.add(`active`);
    }
};

container.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    currentNode = e.target.parentNode.parentNode;
    const currentMaxX = e.clientX + contextMenu.offsetWidth;
    const currentMaxY = e.clientY + contextMenu.offsetHeight;
    contextMenu.style.left = e.clientX + "px";
    contextMenu.style.top = e.clientY + "px";
    contextMenu.classList.add("show");
});
document.addEventListener("mousedown", (e) => {
    reMoveActive();
    e.target.parentNode.classList.add(`active`);
    contextMenu.classList.remove("show");
});
btnRename.onclick = function () {
    if (!currentNode) return;
    const titleDiv = currentNode.querySelector(".title");
    const span = titleDiv.querySelector("span");
    const oldName = span.textContent;
    const input = document.createElement("input");
    input.type = "text";
    input.value = oldName;
    input.className = "rename-input";
    span.replaceWith(input);
    input.focus();
    input.select();
    function finishRename() {
        const newName = input.value.trim() || oldName;
        const newSpan = document.createElement("span");
        newSpan.textContent = newName;
        input.replaceWith(newSpan);
    }
    input.onblur = () => {
        finishRename();
    };
    input.onkeydown = (e) => {
        if (e.key === "Enter") {
            finishRename();
        }
    };
};

btnDelete.onclick = function () {
    if (confirm("Bạn chắc chắn muốn xóa?")) {
        currentNode.innerHTML = ``;
    }
};
