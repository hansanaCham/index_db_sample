const dbName = 'userDataDB';
const dbVersion = 1;
let db;

const openDB = () => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = (event) => {
        console.error('Database error:', event.target.errorCode);
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        fetchDataFromDB();
    };

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        const objectStore = db.createObjectStore('userData', { keyPath: 'id', autoIncrement: true });
    };
};

const addDataToDB = (data) => {
    const transaction = db.transaction(['userData'], 'readwrite');
    const objectStore = transaction.objectStore('userData');
    const request = objectStore.add(data);

    request.onsuccess = () => {
        fetchDataFromDB();
    };

    request.onerror = (event) => {
        console.error('Error adding data:', event.target.error);
    };
};

const fetchDataFromDB = () => {
    const transaction = db.transaction(['userData'], 'readonly');
    const objectStore = transaction.objectStore('userData');
    const request = objectStore.getAll();

    request.onsuccess = () => {
        const tableBody = document.querySelector('#data-table tbody');
        tableBody.innerHTML = '';

        request.result.forEach((data) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.name}</td>
                <td>${data.email}</td>
                <td>${data.age}</td>
            `;
            tableBody.appendChild(row);
        });
    };

    request.onerror = (event) => {
        console.error('Error fetching data:', event.target.error);
    };
};

const handleFormSubmit = (event) => {
    event.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        age: document.getElementById('age').value
    };

    addDataToDB(formData);

    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('age').value = '';
};

document.getElementById('data-form').addEventListener('submit', handleFormSubmit);

openDB();

window.onload = () => {
    openDB();
};
