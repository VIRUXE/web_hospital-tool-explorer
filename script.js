document.addEventListener('DOMContentLoaded', () => {
    displayItems();

    document.getElementById('close-modal').onclick = () => { closeModal(); };
    document.getElementById('image-modal').onclick = () => { closeModal(); };
    document.getElementById('modal-image').onclick = (event) => { event.stopPropagation(); };
});

// Check if root path exists in localStorage
let rootPath = localStorage.getItem('medImagesRootPath');

// If root path doesn't exist, prompt user to set it
if (!rootPath) {
    rootPath = prompt('Por favor, introduza o caminho raiz para as imagens:\n\
    Exemplo: "." para imagens na mesma pasta que o ficheiro HTML,\n\
    ou "C:/Users/Utilizador/Pictures" para imagens numa pasta específica)');

    // Don't allow empty root path
    if (rootPath === '') {
        alert('O caminho raiz não pode estar vazio!');
        location.reload(); 
    }

    localStorage.setItem('medImagesRootPath', rootPath);
} else
    console.log(`Caminho para as Imagens: ${rootPath}`);

function getFileStructureFromPath(folderPath) {
    let folder = file_structure;
    for (const pathPart of folderPath) {
        folder = folder?.[pathPart];
    }
    return folder;
}

function displayItems(folderPath = []) {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';

    const folder = getFileStructureFromPath(folderPath);

    displayBreadcrumbs(folderPath);

    if (folder.files) {
        // This is just a legacy check to support the old format of the file structure, where we had an array of filenames instead of an object
        const files = Array.isArray(folder.files) ? folder.files : Object.keys(folder.files);

        for (const imageName of files) {
            const fileElement = document.createElement('div');
            fileElement.classList.add('file');

            const thumbnail = document.createElement('img');
            thumbnail.src = `${rootPath}/${folderPath.join('/')}/${imageName}`;
            thumbnail.alt = imageName;
            fileElement.appendChild(thumbnail);

            // Again, legacy check to support the old format of the file structure
            const displayName = !Array.isArray(folder.files) ? folder.files[imageName] : removeFileExtension(imageName);
            const legend      = document.createElement('div');
            legend.textContent = displayName;
            legend.classList.add('legend');
            fileElement.appendChild(legend);

            fileElement.onclick = () => {
                openImageModal(`${rootPath}/${folderPath.join('/')}/${imageName}`, displayName);
            };
            fileList.appendChild(fileElement);
        }
    }

    for (const itemName in folder) {
        if (itemName === 'files' || itemName === 'title') continue; // Skip the files and title properties. Makes no sense to display them as folders, right?

        const itemElement = document.createElement('div');

        // Display a Title if it exists, otherwise use the folder name, converted to Title Case
        itemElement.innerHTML = folder[itemName].title || itemName.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        itemElement.classList.add('folder');
        itemElement.onclick = () => {
            displayItems([...folderPath, itemName]);
        };
        fileList.appendChild(itemElement);
    }
}

function displayBreadcrumbs(folderPath) {
    const breadcrumbs = document.getElementById('breadcrumbs');
    breadcrumbs.innerHTML = '';

    const pathElements = [
        { name: 'Início', path: [] },
        ...folderPath.map((name, idx) => ({ name, path: folderPath.slice(0, idx + 1) })),
    ];

    pathElements.forEach(({ name, path }, idx) => {
        const pathElement = document.createElement('span');
        const folderTitle = getFileStructureFromPath(path)?.title || name; // Display the folder title if it exists, otherwise use the folder name

        pathElement.innerHTML = folderTitle;
        pathElement.onclick = () => { displayItems(path); };

        // Add an arrow between breadcrumbs, except for the last one
        if (idx < pathElements.length - 1) pathElement.innerHTML += ' → ';

        breadcrumbs.appendChild(pathElement);
    });

    const backButton = document.getElementById('back-button');

    if (pathElements.length > 1) {
        backButton.style.display = 'block';
        backButton.onclick = () => {
            displayItems(pathElements[pathElements.length - 2].path);
        };
    } else {
        backButton.style.display = 'none';
    }
}

function removeFileExtension(filename) {
    const lastIndex = filename.lastIndexOf('.');
    if (lastIndex === -1) return filename;
    return filename.slice(0, lastIndex);
}

function openImageModal(imageSrc, displayName) {
    document.getElementById('modal-image').src = imageSrc;
    document.getElementById('modal-caption').textContent = displayName || removeFileExtension(imageSrc.split('/').pop());
    document.getElementById('image-modal').style.display = 'flex';
    
    // Allow the opacity transition to start
    setTimeout(() => {
        document.getElementById('image-modal').style.opacity = 1;
    });
}

function closeModal() {
    document.getElementById('image-modal').style.opacity = 0;

    // Wait for the opacity transition to finish before hiding the modal
    setTimeout(() => {
        document.getElementById('image-modal').style.display = 'none';
    }, 300);
}

document.getElementById('close-modal').onclick = () => {
    closeModal();
};

// A way to reset the local storage might be useful if the user changes the root path of the images
let clickCounter = 0;
document.addEventListener('click', () => {
    clickCounter++;

    if (clickCounter === 3) {
        localStorage.removeItem('medImagesRootPath');
        location.reload();
    } else {
        // Reset click counter after 1 second to prevent accidental localStorage clearing
        setTimeout(() => {
            clickCounter = 0;
        }, 1000);
    }
});
