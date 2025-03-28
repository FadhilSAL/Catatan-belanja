import { useEffect, useState } from 'react'
import { ToastContainer,toast } from 'react-toastify';


 export default function App() {
  const [item,SetItem] = useState([]);

 useEffect(()=>{
   const kumpulanItem = JSON.parse(localStorage.getItem('data'))   || [];

   SetItem(kumpulanItem);
 },[])



 function hapusSemua(){
  localStorage.removeItem('data');
  SetItem([]);
 }
 
  return (
    <>
     <ToastContainer icon={false} position='top-center' pauseOnHover={false} autoClose={1500} />
    <h1 className='text-green-400 text-4xl mt-18 font-semibold' >Catatan</h1> 
    <p className='text-slate-400 font-semibold mt-1 text-xl'>Belanja</p>
    <div className='mt-7 w-full '>
     <Form item={item} setItem={SetItem}/>

          <Item item={item} setItem={SetItem}/>
        
    </div>

    <div className='fixed bottom-0 bg-green-400 w-full flex  py-2'>
        <button className='text-white text-2xl font-semibold bg-amber-200 rounded-lg px-2 w-full' onClick={hapusSemua}>Hapus semua catatan</button>
         <p className='text-white text-2xl p-3 w-full text-right'>Total : <Total item={item} /> </p>
    </div>
    </>
  )
}




function Item({item,setItem}){
  const formatTotal = new Intl.NumberFormat('id-ID',{
    currency:"IDR",
    style:"currency",
    minimumFractionDigits:0
  })

  
  function hapusItem(id){
const itemBaru = item.filter((itm)=> itm.id !== id);

localStorage.setItem('data',JSON.stringify(itemBaru));
setItem(itemBaru);

}


  return(<>
          <h1 className='mt-16'>Hari ini</h1>
    <div className='w-full mt-4 h-45 overflow-y-scroll'>

          <ul className='w-full flex-wrap flex'>
     {item.map((itm)=>{
return(

         <div key={itm.id} className='w-full flex-wrap flex'>
         
         <li className='font-semibold px-3 py-2 w-1/4 text-xl'>{itm.namabarang}</li>
         <span className='text-xl text-slate-500 px-3 py-2 w-1/4'>{itm.jumlah + 'x'}</span>
         <span className='w-1/4 px-3 py-2 text-xl mx-1/4'>{formatTotal.format(itm.harga)}</span>
         <div className='w-1/4 px-3  pl-27'>
             <button className='text-red-400 text-4xl hover:cursor-pointer' onClick={()=>hapusItem(itm.id)}>x</button>
         </div>
          <hr className='w-full'/>
          
         </div>
)

     })}

 </ul>
        </div></>
  )
}



function Form({item,setItem}){
  const [namabarang,setNamabarang] = useState('');
  const [jumlah,setJumlah] = useState(1);
  const [harga,setHarga] = useState('');

  
  function handleInput(e){
    
    setNamabarang(e.target.value);
    
    
  }
  function handleJumlah(e){
   
    setJumlah(e.target.value);
    console.log(e.target.value);
    
  }
  function handleHarga(e){
    const value = e.target.value = ''? '': e.target.value.replace(/\D/g,'');
    const formatTotal = new Intl.NumberFormat('id-ID').format(value)

  setHarga(value);
 e.target.value = formatTotal;

}

function tambahDansimpan(e){
  e.preventDefault();
  const isiInput = document.getElementById('namabarang');
  function containNumber(str){
    return /\d/.test(str)
  }
  if(namabarang && harga && jumlah){
    if(containNumber(isiInput.value) ){
      toast.error('Nama barang tidak boleh angka',{theme:'colored'})
    }else{



      const itemClub = {
          id:Date.now(),
          namabarang:namabarang,
          jumlah:Number(jumlah),
          harga:Number(harga)*Number(jumlah)      
      }
     
     const itemBaru = [...item,itemClub];
    
     localStorage.setItem('data',JSON.stringify(itemBaru));
     setItem(itemBaru)
     toast.success('Barang telah ditambahkan',{theme:'colored'});

   isiInput.value ='';
   document.getElementById('jumlah').value='1';
   document.getElementById('harga').value='';
   setHarga('');
   setJumlah(1);
   setNamabarang('');
    }
  }
  else{
    toast.warning('Nama barang,jumlah,harga tidak boleh kosong',{theme:'colored'});
  }
}
//useEffect(()=>{

//},[item])



  return(
    <form className='flex w-full  flex-wrap' >
    <div className="w-full flex  ">
    <label htmlFor="namabarang"className=' font-semibold w-full px-2'>Nama barang</label>
    <label htmlFor="jumlah" className=' font-semibold w-15 text-center ' >Jumlah</label>
    <label htmlFor="harga barang" className='font-semibold text-center w-full '>Harga satu barang</label>
    <div className='w-[170px] mx-2'></div>
    </div>
    <div className='w-full flex justify-center'>

    <input type="text" placeholder='Nama Barang' className='border-1 px-2 w-full' id='namabarang' onChange={handleInput}/>
    <input type="number" className='border-1  h-10  px-2 w-15' min={1} id='jumlah' placeholder='0' onChange={handleJumlah}  />
    <input  type='text' placeholder='Harga 1 barang ' className='border-1 w-full 'onChange={handleHarga}  id='harga'/>
    <button className='rounded-md font-semibold  mx-2 px-2 bg-green-300' onClick={tambahDansimpan}>Tambah</button>
    </div>
    </form>
  )
}



function Total({item}){
const total = item.reduce((acc,its)=>{ return acc + its.harga },0)

  const formatTotal = new Intl.NumberFormat('id-ID',{
    currency:"IDR",
    style:"currency",
    minimumFractionDigits:0
  }).format(total)
  return(
    <>
    
    <span>{formatTotal}</span>
    </>
  )
}