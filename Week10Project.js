let id = 0; //initialzing id as zero to keep track of gererated row ids
let dragSrcElement = null;  //initializing the drag variable as null to keep track of dragged elements

document.getElementById('add').addEventListener('click', () => {  //adding a click event listener targeting our HTML submit button with the add id
    let table = document.getElementById('list'); //targeting our HTML table with the list id
    let row = table.insertRow(1); //inserting a new table row at position 1 just below the header (position 0) and setting the variable
    let rowId =`item-${id}` //creating a unique identifier for the newly created row and storing it in rowId variable (this was needed for the drag feature)
    row.setAttribute('id', rowId) //setting the id of new row to rowId to ensure each row has a unique Id
    row.setAttribute('draggable', true); //enabling rows to be dragable by setting attribute to true
    row.insertCell(0).innerHTML = document.getElementById('new-game-title').value; //inserting a new cell at the correct position within the table and getting value from the corrisponding input field
    row.insertCell(1).innerHTML = document.getElementById('new-genre').value;
    row.insertCell(2).innerHTML = document.getElementById('new-release-date').value;
    row.insertCell(3).innerHTML = document.getElementById('new-metascore').value;
    let actions = row.insertCell(4); //inserting our later created delete button into the last cell
    actions.appendChild(createDeleteButton(rowId)); //appending a created delete button to the actions variable/cell. calling the createDeleteButton function with the unique rowId as it's arguement.
    clearInputFields(); //calling the clearInputFields functions to clear all input fields after the submit button is pressed
    setupDragAndDrop(row); //calling the setupDragAndDrop function to apply drag and drop functionality to the newly created row
});

document.getElementById('myForm').addEventListener('submit', function (event) {  //adding and event listener to our form for when the submit button is clicked
    event.preventDefault(); //preventing the page from refreshing when button is clicked
    clearInputFields(); //calling clearInputFields to Clear input fields between submissions
});

function clearInputFields() { //function to clear input fields
    let inputs = document.querySelectorAll('input'); //using querySelectorAll to target all the input elements since I used both text and date
    inputs.forEach(function (input) { //using forEach method to iterate over all the input elements in the node list
        if (input.type === 'text' || input.type === 'date') { //if statement to target only the text and date inputs (excluding buttons)
            input.value = ''; //setting the value to an empty string to "clear" the inputs
        }
    });
}

function createDeleteButton(rowId) { //function to create a deleted button with the rowId as the arguement
    let btn = document.createElement('button'); //creating a button class in the HTML document and storing it in the btn variable
    btn.className = 'btn btn-primary'; //applying bootstrap primary button styling
    btn.id = rowId; //assigning a unique button Id for dragging
    btn.innerHTML = 'Delete'; //assigning text content of the button to delete
    btn.onclick = () => { //assinging on click handler for the button to delete the row
        let idToDelete = rowId.replace('item-', ''); // removing the string portion of the row Id so that it's just a number
        console.log(`Deleting row with id: item-${idToDelete}`); // logging a msg to the console for testing purposes
        let elementToDelete = document.getElementById(rowId); // finding the HTML element with the corrisponding row Id
        elementToDelete.parentNode.removeChild(elementToDelete); // removing the table row from it's parent thus deleting the row
    };
    return btn; //adding the created delete button to the DOM
}

function setupDragAndDrop(row) {  //adding drag and drop event listeners for drag and drop functionality setting the third arguemnt as false to ensure the events are handled during the bubbling phase
    row.addEventListener('dragstart', handleDragStart, false);
    row.addEventListener('dragover', handleDragOver, false);
    row.addEventListener('dragenter', handleDragEnter, false);
    row.addEventListener('dragleave', handleDragLeave, false);
    row.addEventListener('drop', handleDrop, false);
    row.addEventListener('dragend', handleDragEnd, false);
}

function handleDragStart(e) { //function called when draging starts to help define data
    dragSrcElement = this; //variable to keep track of which element is being dragged
    e.dataTransfer.effectAllowed = 'move'; //allowing the element to be moved
    e.dataTransfer.setData('text/html', this.outerHTML); //setting which data will be transfered during the drag and drop.
}

function handleDragOver(e) { //function called when element is being dragged over a possible drop target
    if (e.preventDefault) { //preventing default behavior of the bowser to allow drag and drop to function
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move'; //setting drop effect to move
    return false; //preventing the browser from doing anything else with the event and signaling that the element can be dropped
}

function handleDragEnter(e) { //called when dragged element is over target element
    this.classList.add('over');// highlighting the drop target for user visibility
}

function handleDragLeave(e) { //called when dragged element leaves target element
    this.classList.remove('over'); //removes highlighting
}

function handleDrop(e) { // function called when dragged element is dropped
    if (e.stopPropagation) { //preventing further propagation to prevent errors
        e.stopPropagation();
    }
    
    if (dragSrcElement !== this) { //preventing element form being dropped on itself by checking to make sure its different
        const dropPosition = e.clientY < this.getBoundingClientRect().top + this.offsetHeight / 2; //calculating the drop position in relation to cursor position
        if (dropPosition) {
            this.parentNode.insertBefore(dragSrcElement, this); //inserting element above the target if cursor is above halfway
        } else {
            this.parentNode.insertBefore(dragSrcElement, this.nextSibling); //inserting element below the target if cursor is below halfway
        }
    }    
    return false; //prevents browser default actions for dropped element
}

function handleDragEnd() { //function called when elements is dropped
    this.classList.remove('over'); //removing over CSS class and its visual properties used during dropping
}