let editPostId = null;
let postToDeleteId = null; 

function togglePostForm() {
    const area = document.getElementById('createPostArea');
    if (area) {
        area.style.display = (area.style.display === 'none' || area.style.display === '') ? 'block' : 'none';
        if (area.style.display === 'none' && editPostId !== null) {
            cancelEdit();
        }
    }
}

function closePostForm() {
    const area = document.getElementById('createPostArea');
    if (area) area.style.display = 'none';
}

function toggleDropdown(postId, event) {
    event.stopPropagation(); 
    document.querySelectorAll('.forum-dropdown-menu').forEach(menu => {
        if (menu.id !== `dropdown-${postId}`) {
            menu.style.display = 'none';
        }
    });

    const currentMenu = document.getElementById(`dropdown-${postId}`);
    if (currentMenu) {
        currentMenu.style.display = (currentMenu.style.display === 'block') ? 'none' : 'block';
    }
}

window.addEventListener('click', function() {
    document.querySelectorAll('.forum-dropdown-menu').forEach(menu => {
        menu.style.display = 'none';
    });
});

function editPost(postId) {
    let posts = JSON.parse(localStorage.getItem('mirai_posts')) || [];
    const postToEdit = posts.find(p => p.id === postId);

    if (!postToEdit) return;

    editPostId = postId;

    const titleEl = document.getElementById('postTitle');
    const contentEl = document.getElementById('postContent');
    const formTitleEl = document.querySelector('.forum-create-card h2');

    titleEl.value = postToEdit.title;
    contentEl.value = postToEdit.content;
    
    if (formTitleEl) formTitleEl.textContent = "Edit Post";

    const area = document.getElementById('createPostArea');
    if (area) area.style.display = 'block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadPosts();
}

function cancelEdit() {
    editPostId = null;
    const formTitleEl = document.querySelector('.forum-create-card h2');
    if (formTitleEl) formTitleEl.textContent = "Create New Post";

    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    
    const titleError = document.getElementById('titleError');
    const contentError = document.getElementById('contentError');
    if (titleError) { titleError.textContent = ''; titleError.style.display = 'none'; }
    if (contentError) { contentError.textContent = ''; contentError.style.display = 'none'; }
    
    document.getElementById('postTitle').style.borderColor = "#edf2f7";
    document.getElementById('postContent').style.borderColor = "#edf2f7";

    closePostForm();
    loadPosts();
}

function savePost() {
    const titleEl = document.getElementById('postTitle');
    const contentEl = document.getElementById('postContent');
    const titleError = document.getElementById('titleError');
    const contentError = document.getElementById('contentError');

    const titleValue = titleEl.value.trim();
    const contentValue = contentEl.value.trim();

    let isValid = true;

    if (!titleValue) {
        titleError.textContent = "Title cannot be empty";
        titleError.style.display = "block";
        titleEl.style.borderColor = "#e53e3e";
        isValid = false;
    } else {
        titleError.textContent = "";
        titleError.style.display = "none";
        titleEl.style.borderColor = "#edf2f7";
    }

    if (!contentValue) {
        contentError.textContent = "Content cannot be empty";
        contentError.style.display = "block";
        contentEl.style.borderColor = "#e53e3e";
        isValid = false;
    } else {
        contentError.textContent = "";
        contentError.style.display = "none";
        contentEl.style.borderColor = "#edf2f7";
    }

    if (!isValid) return;

    let posts = JSON.parse(localStorage.getItem('mirai_posts')) || [];

    if (editPostId !== null) {
        const postIndex = posts.findIndex(p => p.id === editPostId);
        if (postIndex !== -1) {
            posts[postIndex].title = titleEl.value;
            posts[postIndex].content = contentEl.value;
            posts[postIndex].time = new Date().toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' }) + " (Edited)";
        }
        editPostId = null;
        const formTitleEl = document.querySelector('.forum-create-card h2');
        if (formTitleEl) formTitleEl.textContent = "Create New Post";
        showToast("Successfully edited post!");
    } else {
        const newPost = {
            id: Date.now(),
            title: titleEl.value,
            content: contentEl.value,
            author: "UserGuest",
            time: new Date().toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            replies: []
        };
        posts.unshift(newPost);
        showToast("Successfully created post!");
    }

    localStorage.setItem('mirai_posts', JSON.stringify(posts));

    titleEl.value = '';
    contentEl.value = '';
    closePostForm();
    loadPosts();
}

function deletePost(postId) {
    postToDeleteId = postId; 
    
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.classList.add('active'); 
    }

    const confirmBtn = document.getElementById('btnConfirmDelete');
    if (confirmBtn) {
        confirmBtn.onclick = function() {
            executeDelete();
        };
    }
}

function executeDelete() {
    if (postToDeleteId === null) return;

    let posts = JSON.parse(localStorage.getItem('mirai_posts')) || [];
    posts = posts.filter(post => post.id !== postToDeleteId);
    localStorage.setItem('mirai_posts', JSON.stringify(posts));

    postToDeleteId = null;
    showToast("Post deleted");
    closeDeleteModal();
    loadPosts();
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.classList.remove('active');
    }
    postToDeleteId = null;
}

function addReply(postId) {
    const replyInput = document.getElementById(`reply-input-${postId}`);
    const replyError = document.getElementById(`reply-error-${postId}`);
    const replyText = replyInput.value.trim();

    if (!replyText) {
        if (replyError) {
            replyError.textContent = "Reply cannot be empty!";
            replyError.style.display = "block";
        }
        replyInput.style.borderColor = "#e53e3e";
        return; 
    }

    if (replyError) {
        replyError.textContent = "";
        replyError.style.display = "none";
    }
    replyInput.style.borderColor = "#edf2f7";

    let posts = JSON.parse(localStorage.getItem('mirai_posts')) || [];
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex !== -1) {
        posts[postIndex].replies.push({
            author: "You",
            text: replyInput.value,
            time: "Just now"
        });
        localStorage.setItem('mirai_posts', JSON.stringify(posts));
        showToast("Successfully added reply!");
        loadPosts(); 
    }
}

function loadPosts() {
    const container = document.getElementById('forumContainer');
    if (!container) return;

    let posts = JSON.parse(localStorage.getItem('mirai_posts')) || [];

    if (posts.length === 0) {
        posts = [{
            id: 999999,
            title: "Welcome to Mirai Forum!",
            content: "Ini adalah contoh postingan untuk menguji tombol 3-titik di pojok kanan atas, serta efek hover tombol reply di bawah.",
            author: "UserGuest",
            time: "11.33",
            replies: []
        }];
        localStorage.setItem('mirai_posts', JSON.stringify(posts));
    }

    if (editPostId !== null) {
        posts = posts.filter(post => post.id !== editPostId);
    }

    container.innerHTML = posts.map(post => `
        <div class="forum-card">
            <div class="post-header-wrapper">
                <div class="post-header" style="display: flex; align-items: center; gap: 8px;">
                    <strong style="display: inline-flex; align-items: center; gap: 5px;">
                        <img src="/assets/ForumLogos/ThreadReply.png" alt="Author" style="width: 30px; height: 30px; object-fit: contain; vertical-align: middle;">
                        ${post.author}
                    </strong> 
                    • 
                    <span class="text-gray">${post.time}</span>
                </div>
                
                <div style="position: relative;">
                    <button class="btn-options-trigger" onclick="toggleDropdown(${post.id}, event)">⋮</button>
                    <div id="dropdown-${post.id}" class="forum-dropdown-menu">
                        <button class="dropdown-item edit-opt" onclick="editPost(${post.id})">Edit</button>
                        <button class="dropdown-item delete-opt" onclick="deletePost(${post.id})">Delete</button>
                    </div>
                </div>
            </div>

            <h3 style="margin: 10px 0; color: #2d3748;">${post.title}</h3>
            <p style="color: #4a5568; line-height: 1.6; font-size: 14px;">${post.content}</p>
            
            <div style="margin: 15px 0; font-size: 13px; color: #6495ED; font-weight: bold; display: flex; align-items: center; gap: 6px;">
                <img src="/assets/ForumLogos/Reply.png" alt="Replies" style="width: 12px; height: 12px; object-fit: contain; vertical-align: middle;">
                ${post.replies.length} replies
            </div>

            <div class="replies-list" style="margin-left: 10px; padding-left: 15px;">
                ${post.replies.map(r => `
                    <div class="reply-item">
                        <div style="font-size: 12px;"><strong>${r.author}</strong> • <span style="color:gray;">${r.time}</span></div>
                        <div style="font-size: 13px; color: #4a5568;">${r.text}</div>
                    </div>
                `).join('')}
            </div>

            <div class="reply-container" style="margin-top: 20px;">
                <div class="reply-box" style="display: flex; gap: 10px;">
                    <input type="text" id="reply-input-${post.id}" placeholder="Write a reply..." class="forum-reply-input"
                           style="flex-grow: 1; padding: 10px; border: 1px solid #edf2f7; border-radius: 20px; font-size: 13px; background: #f8fafc; box-sizing: border-box; transition: all 0.2s;">
                    <button onclick="addReply(${post.id})" class="btn-forum-reply">
                        Reply
                    </button>
                </div>
                <!-- Tempat khusus menampung pesan error text di bawah reply field -->
                <small id="reply-error-${post.id}" class="forum-error-msg"></small>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const cancelBtn = document.querySelector('.btn-forum-cancel');
    if (cancelBtn) {
        cancelBtn.setAttribute('onclick', 'cancelEdit()');
    }
});

window.addEventListener('load', loadPosts);

function showToast(message) {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        document.body.appendChild(toastContainer);
    }

    const toastCard = document.createElement('div');
    toastCard.className = 'toast-card';
    toastCard.textContent = message;

    toastContainer.appendChild(toastCard);

    setTimeout(() => {
        toastCard.classList.add('fade-out');
        toastCard.addEventListener('animationend', () => {
            toastCard.remove();
        });
    }, 2200);
}
