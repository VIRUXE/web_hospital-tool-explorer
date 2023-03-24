document.addEventListener('DOMContentLoaded', () => {
	displayItems();

	document.getElementById('close-modal').onclick = () => { closeModal(); };
	// document.getElementById('image-modal').onclick = () => { closeModal(); }; // Close the modal when clicking outside the image
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
	for (const pathPart of folderPath) { folder = folder?.[pathPart]; }
	
	return folder;
}

function displayItems(folderPath = []) {
	const warning = document.getElementById('warning');
	// Hide the warning if it was displayed
	if(warning.style.display !== 'none') {
		warning.style.display = 'none';
	}

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
			thumbnail.onerror = () => {
				// Some random circle cross image
				thumbnail.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAKAAgMAAABxoyGwAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAxQTFRFu7q6393dmZmZ9PLyaRQf7AAACcRJREFUeNrt3TGO2zgUBmAlQJBF+iDlbK1LOJgyVbDYaXIEXcIZLBYpfYRJYATj4RR7hAG2VBUYqXQEl4KhwpDMLWKPJZkSHx/lR2Lxq5wZJB/In4+0LJGJjvxKAAQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEMCgwI+/KaXU51eRAn++UYfr67sYge9V6/o7PuC16ly3sQF7PqW+xwVcq7PrS0zArTJcV/EAm9QEXM2jAX5SxuuvWIBbNXBdRQLMhoAPcQBLNXgtogCmw8AJxok/cK3UJZswuWQDKrUKDyyVumgTJhcbwhMN5ORSNXCqWugLzG3AZVhgo6zXPCiwV2NevL25uXmZTrnsSiasMbeHxmquJxwmfsC6LXl9+vmP9s9nAYGF2af1z9Yv7gMC0wFfpw1X4YDbkcXpp4lKYTJNDz+cFZMmm6aPk2l6+GqseVehgPV4GxWTjONkih42r0tPn/XuAwEzy2SxnqJWewAb28L+1ITzIMDSOtuuJ1i2egBz6yej5yZcBgGm9iFQ+BeaxL/IzPz+5mLANaX7Phz+6J8AwGME78b+qDr80bcAQFq8Ut8QJr4RvKe180wcWNLWUlvfSph4RnBFLEZLcWBKXAcUniHkAhvqannrOR1zgRW1YY7T3Z0wkN5zud+akAvckMvHoa0fhYEpuXw0fqOECawdbl5lXqU68RojpIYpvEZJ4jVGXEJ4LwrcONyEbrzmksRvjDiEcCUJbJxuDRU+cwkPuHe6/XcI4ZMgsHT6JqTxWXHxgLnbbfzMY5TwgJlihPBREJi63YMuPYZx4jGI31CzVXsM48RjEJfUEB7WhE9iwF+yh5ocwow/jFnA4jC5ptQQFvzZOOFXmcWx2iyITb4UA2aHhiOHsObfaGUBj4OSHMLDsJcCntqDHMKMvahO2FVmeZryFsTUPgkBy+dbfuQQ7th1JmFXmbvTFGEPYcW+jZmwq8xMO4SwZteZhF1l5tohhA27znCA6albySFMuesZDrC1uiOHcMMthAxg3Z5YqSEsuIWQAdy3Y0cNYckthAxg1b6TQQ1hxb39wQDu2r1FDWHNLYQMYNFZvxND2HBXhAxg3mkyaghTZqVmADedmksNYcb85MkAdtuCGsKcWakZwF6aiCEsmJXaHdj0MkcMYcn8aOwOrHsVjRjCijmVuAP3vTmBGMI9cypxB1b9vqKFsGFOJe7Asp92YgiZi3534K7focQQpry5zh1Y9NfGxBBmvLnOHZifTQm0EG54c507cHPWErQQFry5zh143lW0EBa8j01M4EI7h7CUAqbn3UkKYclbLbgDDTMCKYR73mrBGdgYgKQQ1rzVgjOwNvQmKYQ1b7XABM61cwgbIaAxSqQQ8pYzzsDK1JmkEKas5cw0QFIIhYDmeksJYcZabzkDd8YplRLCDWu9xQMuNSOEuQywMEIoIcxZC0Ie8F4zQljIAAc6ihDCHWvFOhWQEEJJ4EIzQljKADcDPWkPYcla8/OAd5oRwkoGmA0A7SGsWGt+HvBJM0K4lwGmQ4smawj3rA8lPOBMM0JYBwZaQxgaaA1haKA1hELAYYQthDXrgzEPONeMEDahgbYQBgfaQhgeaAlheKAlhOGBlhCGB1pCKANsxoDjIYygBcdDGAFwPIQRAMdDGANwNIQxAEdDGANwNIQxAEdDKAmcaUYIhdaD6ShwLITBl/y2EEYBHAthHMCREEoCnzQjhPsogCMhFAJmli+0hkO4F7y7dacZIRS6/baxAIdDWAneYR25jzocQqFbwLnt24bBEJZBv4YghHAXCXAwhEJA6xdagyEsBL+rW2pGCIW+TNzRvnY1hFDo61h7sRgK4UbmG3f7I1hDIcxiAQ6FUAhY2dckAyEUeuqD8IzYQAiFHuwhPCNmDmEj+uzWzD2EUg+XURrCGEKpx/M04YlyYwgroQccKYPRGMJK6hFRyhPlphDupIAZAWgKodhjypQnyk0hFHvQOycATSEUe1Se1FWGEIq9bEAKuyGEYq9rlJR6Zgih2AsvFWVGOA+h3CtDtLenzkIo99JVTWqKsxDKvbbWOLzn1wqh3It/mvQi7lkI5V6d/FXQrBW3H8KcuY+B9+u71BAKvr5LexG3H0LBF6ALUtx7IZR8hXxHKxjdEEq+hE/ckaAbQsltDPYuWz8cYye5EURNi1M3hJJbaWjiVnOdEEpuRkLdmqUTQtHtXDa0abUTQvYGf55bClFDKLulUEEsGa0QVuzN3/y2tSKHUHZbqz2xv1ohlN0YrCbuc9QKYSq6tZqm7hh5CqHs5nTkreaeQyi9vV/utC+iWopvkEjdMfI5hNJbTJbUHjuGUHqTzr3jjvILj92KfTaKnVFD+FV6o9hD15G3sPXZV95ns+J7cgg9TmviAQvq/5h7n1vntWH2nPqH4htm76lb7bdD+CQIbBQjhHNB4OH/dQqh6Lb3x/OXXEL4KAos3EMoe/RC5R7CO1FgrZxDOBMFHhuGHkLhA1SOx2vQQ/hNGFiQjzVIvcbI5Y9B0oGOQSIfJFUFOkgq+qO44j/MLPrj4Gra8SRFsAP1iIcNhjuS8PlAyTvKGH4MANxRpogP3mez/o8PFo3+aNb4D7eN/nhg6wHLOvABy6fTmhaWBgx0RPUJYDvk+0sg4J56TPpVIGD0B8232ujhrJObzPcT8QTAUyOp7/3f/asm6WE/YPvW0Ovub36oaXrYE1i07q69G/D59bAnsHMP+rXZ57FQ8Ad2TtZTt4eR0lz73zufCrhWHcvnm5ubP993fuZVpf2BjbJe86DAzm1847XUYYFbG/AqMLA7TM6vBx0aWI4DF8GB3SMy+9dKhweuL9qAEwCb9JINOAFwLIWLKIDDA/lBxwHcXqoGTgVsL07b13cdC9A8TlbzaIDmTr7S8QBNxfCLjgmoP/V9tzouoL6+jG86oP6j7Xuh4wPqn2+OvK/vdIxArT++VEqp319N+W9OCrzEBSCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAA6X/8BA1dWnVyRCnkAAAAASUVORK5CYII=';

				// Don't let the user open the modal. So we remove the onclick event
				fileElement.onclick = null;

				// Change pointer style to indicate that the file is not clickable
				fileElement.style.cursor = 'not-allowed';

				if(!warning.style.display !== 'block') {
					document.getElementById('warning').style.display = 'block';
				}
			};

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

	// Create a circle for each tool
	if(tools.length > 0) {
		const circleMap = document.createElement('div');
		circleMap.id = `circle-map`;

		// Utility to get the location relative to the image so we can add the circles
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
					console.log(tool.info);
					tooltip.style.display = 'block';
					tooltip.style.left    = `${event.clientX + 10}px`;
					tooltip.style.top     = `${event.clientY + 10}px`;
					
					tooltip.innerHTML = `<span>${tool.info.titulo}</span>:&nbsp;${tool.info.descricao}<br><b>Localização</b>:&nbsp;${tool.info.localizacao}`;
				});
				
				circle.addEventListener('mouseout', () => { tooltip.style.display = 'none'; });

				modalTools.appendChild(circleMap);
			}
		});
	}

	// Allow the opacity transition to start
	setTimeout(() => { modal.style.opacity = 1; });
}

function closeModal() {
	imageModal = document.getElementById('image-modal').style.opacity = 0;

	// Wait for the opacity transition to finish before hiding the modal
	setTimeout(() => { document.getElementById('image-modal').style.display = 'none'; }, 300);
}

// A way to reset the local storage might be useful if the user changes the root path of the images
let clickCounter = 0;
document.addEventListener('click', () => {
	clickCounter++;

	if (clickCounter === 3) {
		localStorage.removeItem('medImagesRootPath');
		location.reload();
	} else {
		// Reset click counter after 500 miliseconds to prevent accidental localStorage clearing
		setTimeout(() => { clickCounter = 0; }, 500);
	}
});
