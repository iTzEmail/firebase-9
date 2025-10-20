import { update } from "firebase/database";
import { auth, db } from "../components/firebase.js";


// // Real time collection data
// import { collection, onSnapshot, doc, query, where, orderBy } from 'firebase/firestore';

// const colRef = collection(db, 'books');

// // Queries
// // const q = query(colRef, where("author", "==", "patrick rothfuss"), orderBy('createdAt', 'desc'));
// const q = query(colRef, orderBy('createdAt', 'desc'));
// const unsubCol = onSnapshot(q, (snapshot) => {
//     let books = [];
//     snapshot.docs.forEach((doc) => {
//         books.push({ ...doc.data(), id: doc.id });
//     });
    
//     console.log(books);
// });


// // Adding documents
// import { addDoc, serverTimestamp } from 'firebase/firestore';

// const addBook = document.querySelector('.add');
// if (addBook) {
//     addBook.addEventListener('submit', (e) => {
//         e.preventDefault();

//         addDoc(colRef, {
//             title: addBook.title.value,
//             author: addBook.author.value,
//             createdAt: serverTimestamp()
//         })
//         .then(() => {
//             alert('Book successfully added!');

//             addBook.reset();
//         })
//         .catch(err => { 
//             console.log(err.message);
//         });
//     });
// }


// // Deleting documents
// import { deleteDoc } from 'firebase/firestore';

// const deleteBook = document.querySelector('.delete');
// if (deleteBook) {
//     deleteBook.addEventListener('submit', (e) => {
//         e.preventDefault();

//         const docRef = doc(db, 'books', deleteBook.id.value);
//         deleteDoc(docRef)
//             .then(() => {
//                 alert('Book successfully deleted!'); 

//                 deleteBook.reset();
//             })
//             .catch(err => {
//                 console.log(err.message);
//             });
//     });
// }


// // Get a single document
// import { getDoc } from 'firebase/firestore';

// const docRef = doc(db, 'books', 'iKQDpDRXxlLbZJF15Vu8');
// // getDoc(docRef)
// //     .then((doc) => {
// //         console.log(doc.data(), doc.id);
// //     });

// const unsubDoc = onSnapshot(docRef, (doc) => {
//     console.log(doc.data(), doc.id);
// });


// // Update document
// import { updateDoc } from 'firebase/firestore';

// const updateBook = document.querySelector('.update');
// if (updateBook) {
//     updateBook.addEventListener('submit', (e) => {
//         e.preventDefault();

//         const docRef = doc(db, 'books', updateBook.id.value);
//         updateDoc(docRef, {
//             title: 'updated title',
//             author: 'updated author'
//         })
//         .then(() => {
//             alert('Book successfully updated!');
            
//             updateBook.reset();
//         })
//         .catch(err => {
//             console.log(err.message);
//         });
//     });
// }


// // Unsubscribe from changes (for testing purposes)
// const unsub = document.querySelector('.unsub');
// unsub.addEventListener('click', () => {
//     console.log('Unsubscribing from collection changes');

//     unsubCol();
//     unsubDoc();
// });