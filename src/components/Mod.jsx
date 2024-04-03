import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Modal, TextField } from '@mui/material';
import { addDoc, collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define your modal style
const modalStyle = {
  backgroundColor: 'whitesmoke',
  width: 400,
  border: '2px solid #000',
  p: 4,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
};

function Mod({ open, setOpen }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const collectionRef = collection(firestore, 'docsData');
  const [docsData, setDocsData] = useState([]);
  const isMounted = useRef();

  const handleClose = () => setOpen(false);

  // Function to add data to Firestore
  const addData = () => {
    if (!title) {
      toast.error('Title cannot be empty');
      return;
    }

    addDoc(collectionRef, {
      title: title,
      docsDesc: "",
    })
      .then(() => {
        toast.success(`${title} added`);
        handleClose();
        setTitle('');
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        toast.error('Cannot add data');
      });
  };

  // Function to delete data from Firestore
  const deleteId = (id, title) => {
    const docRef = doc(firestore, 'docsData', id);
    deleteDoc(docRef)
      .then(() => {
        toast.success(`${title} deleted`);
      })
      .catch((err) => {
        console.log(`${err}`);
        toast.error(`Failed to delete ${title}`);
      });
  };

  const getId = (id) => {
    console.log(id);
    navigate(`/editDocs/${id}`);
  };

  const getData = () => {
    onSnapshot(collectionRef, (data) => {
      setDocsData(data.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      }));
    });
  };

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      getData();
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <h2>Add Title</h2>
          <TextField
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            id="outlined-basic"
            label="Title"
            variant="outlined"
          />
          <Button onClick={addData} className='btn m-2' variant="contained" color="primary">
            Add
          </Button>
        </Box>
      </Modal>
      {/* Rendering the data */}
      <div className='mt-2 w-50' style={{ display: 'flex',justifyContent:'center', flexWrap: 'wrap' }}>
        {
          docsData.map((doc) => (
            <div className='p-3 mt-3' key={doc.id} style={{
              border: '1px solid #ccc',
              backgroundImage: 'white'
            }}>
              <div className='d-flex justify-content-around'>
                <i className='fa-solid fa-pen-to-square text-success' onClick={() => getId(doc.id)} style={{ marginRight: '10px' }}></i>
                <i style={{ color: 'red' }} className='fa-solid fa-trash' onClick={(e) => { e.stopPropagation(); deleteId(doc.id, doc.title); }}></i>
              </div>
              <h3 className='p-3' style={{  textDecoration:'underline',margin: 0 }}>{doc.title}</h3>
              <div dangerouslySetInnerHTML={{ __html: doc.docsDesc }}></div>
            </div>
          ))
        }
      </div>
      <ToastContainer />
    </div>
  );
}

export default Mod;
