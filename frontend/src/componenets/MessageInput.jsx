import { Image, Send, X } from 'lucide-react';
import React from 'react'
import { useRef } from 'react';
import { useState } from 'react';
import { useChatStore } from '../store/usechatstore';
import toast from 'react-hot-toast';

const MessageInput = () => {
  const [text, settext] = useState('');
  const [imagePreview, setimagePreview] = useState(null)
  const fileInputref = useRef(null);
  const {sendmessage} = useChatStore();


  const handleImageChange = async (e)=>{
    const file = e.target.files[0];
    if(!file.type.startsWith('image/')){
      toast.error("Please select a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = ()=>{
      setimagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }


  const removeImage = ()=>{
    setimagePreview(null);
    if(fileInputref.current){
      fileInputref.current.value = '';
    }
  }

  const handleSendMessage = async (e)=>{
    e.preventDefault();
    if(!text.trim() && !imagePreview) return;

    try{
      await sendmessage({text:text.trim(),image:imagePreview});
      settext('');
      setimagePreview(null);
      if(fileInputref.current) fileInputref.current.value = '';
    }catch(err){
      console.log('Failed to send message:',err);
      
    }
  }



  return (
    <div className='p-4 w-full'>
      {imagePreview && (
  <div className="mb-3 flex items-center gap-2">
    <div className="relative">
      <img
        src={imagePreview}
        alt="Preview"
        className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
      />
      <button
        onClick={removeImage}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
        type="button"
      >
        <X className="size-3" />
      </button>
    </div>
  </div>
)}  

    
    <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
      <div className='flex-1 flex gap-2'>
        <input 
        type="text"
        className='w-full input input-borderd rounded-lg input-sm sm:input-md'
        placeholder='Type a Message'
        value={text}
        onChange={(e)=>settext(e.target.value)}
        />
        <input 
        type="file"
        accept='image/*'
        className='hidden'
        ref={fileInputref}
        onChange={handleImageChange}
        />
        <button 
        type="button"
        className={`hidden sm:flex btn btn-circle ${imagePreview ? 'text-emerald-500' : 'text-zinc-400'}`}
        onClick={()=>{fileInputref.current.click()}}
        >
          <Image size={20} />
        </button>

        <button
        type='submit'
        className='btn btn-sm btn-circle'
        disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>


      </div>
    </form>



    </div>
  )
}

export default MessageInput