document.addEventListener('DOMContentLoaded', () => {
	displayItems();

	document.getElementById('close-modal').onclick = () => { closeModal(); };
	document.getElementById('image-modal').onclick = () => { closeModal(); };
	// Don't close the modal when clicking on the image or the caption
	document.getElementById('modal-tools').onclick = (event) => { event.stopPropagation(); };
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
	let folder = file_structure; // In case folderPath is empty, return the whole file structure, so that we can display the root folder
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
		for (const imageName in folder.files) {
			const fileElement = document.createElement('div');
			fileElement.classList.add('file');

			const thumbnail = document.createElement('img');
			thumbnail.src = `${rootPath}/${folderPath.join('/')}/${imageName}`;
			thumbnail.alt = imageName;
			fileElement.appendChild(thumbnail);

			const displayName = folder.files[imageName].title;
			const legend      = document.createElement('div');
			legend.textContent = displayName;
			legend.classList.add('legend');
			fileElement.appendChild(legend);

			fileElement.onclick = () => { openImageModal(`${rootPath}/${folderPath.join('/')}/${imageName}`, displayName, folder.files[imageName].tools); };
			fileList.appendChild(fileElement);
		}
	}

	for (const itemName in folder) {
		if (itemName === 'files' || itemName === 'title') continue; // Skip the files and title properties. Makes no sense to display them as folders, right?

		const itemElement = document.createElement('div');

		// Display a Title if it exists, otherwise use the folder name, converted to Title Case
		itemElement.innerHTML = folder[itemName].title || itemName.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
		itemElement.classList.add('folder');
		itemElement.onclick = () => { displayItems([...folderPath, itemName]); };
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
		pathElement.onclick   = () => { displayItems(path); };

		// Add an arrow between breadcrumbs, except for the last one
		if (idx < pathElements.length - 1) pathElement.innerHTML += ' → ';

		breadcrumbs.appendChild(pathElement);
	});

	const backButton = document.getElementById('back-button');

	if (pathElements.length > 1) {
		backButton.style.display = 'block';
		backButton.onclick = () => { displayItems(pathElements[pathElements.length - 2].path); };
	} else {
		backButton.style.display = 'none';
	}
}

function removeFileExtension(filename) {
	const lastIndex = filename.lastIndexOf('.');
	
	return lastIndex === -1 ? filename : filename.substring(0, lastIndex);
}

function openImageModal(imageSrc, displayName, tools) {
	const modal        = document.getElementById('image-modal');
	const modalImage   = document.getElementById('modal-image');
	const modalCaption = document.getElementById('modal-caption');
	const modalTools   = document.getElementById('modal-tools');

	modalImage.src = imageSrc;
	modalCaption.textContent = displayName || removeFileExtension(imageSrc.split('/').pop());

	modal.style.display = 'flex';

	// Create the circle maps for each tool associated with the image
	modalTools.innerHTML = '';

	// Create a circle map for each tool
	if(tools.length > 0) {
		const circleMap = document.createElement('div');
		circleMap.id = `circle-map`;

		// Utility to get the location relative to the image
		circleMap.addEventListener('click', (event) => {
			const rect = circleMap.getBoundingClientRect();
			const x    = event.clientX - rect.left;
			const y    = event.clientY - rect.top;
			console.log(`x: ${Math.round(x)}, y: ${Math.round(y)}`);
		});
		  

		tools.forEach((tool) => {
			tool.info = tool_data[tool.name];
			
			if (tool.info) { // Only do something if the tool actually exists
				const circle = document.createElement('div');
				circle.classList.add('circle');

				// Fail safe in case radius is not defined
				if (!tool.location.radius) tool.location.radius = 10;

				// The circle's size is the diameter, so we need to multiply the radius by 2
				circle.style.width  = `${tool.location.radius * 2}px`;
				circle.style.height = `${tool.location.radius * 2}px`;
				// The circle's position is the top-left corner of the circle, so we need to subtract the radius from the x and y coordinates
				circle.style.top    = `${tool.location.y - tool.location.radius}px`;
				circle.style.left   = `${tool.location.x - tool.location.radius}px`;
				circleMap.appendChild(circle);

				circle.addEventListener('mouseover', () => {
					tooltip.style.display = 'block';
					tooltip.style.left    = `${event.clientX + 10}px`;
					tooltip.style.top     = `${event.clientY + 10}px`;
					
					tooltip.innerHTML = `<span>${tool.info.titulo}</span>:&nbsp;${tool.info.descricao}<br><b>Localização</b>:&nbsp;${tool.info.localizacao}`;
				});
				
				circle.addEventListener('mouseout', () => {
					tooltip.style.display = 'none';
				});

				modalTools.appendChild(circleMap);
			}
		});
	}

	// Allow the opacity transition to start
	setTimeout(() => {
		modal.style.opacity = 1;
	});
}

function closeModal() {
	document.getElementById('image-modal').style.opacity = 0;

	// Wait for the opacity transition to finish before hiding the modal
	setTimeout(() => {
		document.getElementById('image-modal').style.display = 'none';
	}, 300);
}

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
		}, 500);
	}
});
