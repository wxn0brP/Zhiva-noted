import "@wxn0brp/flanker-ui/html";
import { fetchApi } from "@wxn0brp/zhiva-base-lib/front/api";

const notesList = qs("#notes-list");
const noteTitleInput = qi("#note-title-input");
const noteContentInput = qi("#note-content-input");
const addNoteBtn = qs("#add-note-btn");

const editModal = qs("#edit-modal");
const closeModalBtn = qs(".close-btn");
const editNoteTitle = qi("#edit-note-title");
const editNoteContent = qs<HTMLTextAreaElement>("#edit-note-content");
const saveEditBtn = qs("#save-edit-btn");

let currentEditingNoteId: string | null = null;

interface Note {
    _id: string;
    title: string;
    content: string;
}

async function fetchNotes() {
    const notes: Note[] = await fetchApi("notes").then(res => res.json());
    renderNotes(notes);
}

function renderNotes(notes: Note[]) {
    notesList.innerHTML = "";
    notes.forEach(note => {
        const noteElement = document.createElement("div");
        noteElement.classList.add("note");

        const noteText = document.createElement("div");
        noteText.classList.add("note-text");

        const titleElement = document.createElement("h3");
        titleElement.textContent = note.title;

        const contentElement = document.createElement("p");
        contentElement.textContent = note.content.substring(0, 100) + (note.content.length > 100 ? "..." : "");

        noteText.appendChild(titleElement);
        noteText.appendChild(contentElement);

        const noteActions = document.createElement("div");
        noteActions.classList.add("note-actions");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => openModal(note));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteNote(note._id));

        noteActions.appendChild(editButton);
        noteActions.appendChild(deleteButton);

        noteElement.appendChild(noteText);
        noteElement.appendChild(noteActions);
        notesList.appendChild(noteElement);
    });
}

function openModal(note: Note) {
    currentEditingNoteId = note._id;
    editNoteTitle.value = note.title;
    editNoteContent.value = note.content;
    editModal.style.display = "block";
}

function closeModal() {
    editModal.style.display = "none";
    currentEditingNoteId = null;
}

async function addNote() {
    const title = noteTitleInput.value;
    const content = noteContentInput.value;
    if (!title || !content) return;

    await fetchApi("notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
    });

    noteTitleInput.value = "";
    noteContentInput.value = "";
    fetchNotes();
}

async function updateNote(_id: string, title: string, content: string) {
    await fetchApi("notes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id, title, content }),
    });
    fetchNotes();
    closeModal();
}

async function deleteNote(_id: string) {
    await fetchApi("notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
    });
    fetchNotes();
}

addNoteBtn.addEventListener("click", addNote);
closeModalBtn.addEventListener("click", closeModal);
saveEditBtn.addEventListener("click", () => {
    if (currentEditingNoteId) {
        updateNote(currentEditingNoteId, editNoteTitle.value, editNoteContent.value);
    }
});

window.addEventListener("click", (event) => {
    if (event.target == editModal) {
        closeModal();
    }
});

fetchNotes();
