"use client"
import dynamic from "next/dynamic"
import { Box, Typography,Modal,Stack,TextField,Button, Input } from "@mui/material"
import { useState,useEffect, use } from "react"
import { firestore, } from "@/firebase"
import {collection,doc,getDocs,query,setDoc, deleteDoc, getDoc} from 'firebase/firestore'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function Home(){
const [search,setSearch]=useState('')
const [inventory,setInventory]=useState([])
const [load_inv,setLoad_inv]=useState([])
const [open,setOpen]=useState(false)
const [itemName,setItemName]=useState('')

useEffect(()=>{
  updateInventory()
},[])


useEffect(()=>{

  let temp=[]
  for (let i =0;i<load_inv.length;i++){
    if (load_inv[i].name.toLowerCase().includes(search.toLowerCase())){
      temp.push(load_inv[i]);
    }
  }
  setInventory(temp)
},[search]);


const updateSearch=(event)=>{
  setSearch(event.target.value);
}
const updateInventory= async() =>{
  const snapshot= query(collection(firestore,'inventory'));
  const docs= await getDocs(snapshot);
  const inventoryList=[];
  docs.forEach(doc=> {
    inventoryList.push({name:doc.id, ...doc.data()})
  });
  setInventory(inventoryList)
  setLoad_inv(inventoryList)

};
const addItem = async(item) =>{
  const docRef= doc(collection(firestore,'inventory'),item);
  const docSnap=await getDoc(docRef)
  if (docSnap.exists()){
    const {quantity}=docSnap.data();
    await setDoc(docRef,{quantity:quantity+1});
  }
  else{
      await setDoc(docRef,{quantity:1});
  }
  await updateInventory();
  
}
const removeItem = async(item) =>{
  const docRef= doc(collection(firestore,'inventory'),item);
  const docSnap=await getDoc(docRef)
  if (docSnap.exists()){
    const {quantity}=docSnap.data();
    if (quantity===1){
      await deleteDoc(docRef);
    }
    else{
      await setDoc(docRef,{quantity:quantity-1});
    }
    await updateInventory();
  }
};
const handleOpen = () => setOpen(true)
const handleClose = () => setOpen(false)
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

  return (
    <Box
    width="100vw"
    height="100vh"
    display={'flex'}
    justifyContent={'center'}
    flexDirection={'column'}
    alignItems={'center'}
    gap={2}
  >
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" color="Black">
          Add Item
        </Typography>
        <Stack width="100%" direction={'row'} spacing={2}>
          <TextField
            id="outlined-basic"
            label="Item"
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Button
            variant="outlined"
            onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}
          >
            Add
          </Button>
        </Stack>
      </Box>
    </Modal>
    <Button variant="contained" onClick={handleOpen}>
      Add New Item
    </Button>
    <Box border={'1px solid #333'}>
      <Box
        width="800px"
        height="100px"
        bgcolor={'#ADD8E6'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Typography variant={'h2'} color={'#333'} textAlign={'top'}>
          Inventory Items
        </Typography>
      </Box>
      <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
      <input
        type="text"
        placeholder="Search Item"
        value={search}
        onChange={updateSearch}
        ></input>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Add</TableCell>
            <TableCell align="right">Remove</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          
        {inventory.map(({name, quantity}) => (
          <TableRow
          key={name}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {name}
          </TableCell>
          <TableCell align="right">{quantity}</TableCell>
          <TableCell align="right"><Button variant="contained" onClick={() => addItem(name)}>Add</Button></TableCell>
          <TableCell align="right"><Button variant="contained" onClick={()=> removeItem(name)}>Remove</Button></TableCell>
        </TableRow>
         
        ))}
        </TableBody>
        </Table>
        </TableContainer>
      </Stack>
    </Box>
  </Box>

    
  )
}