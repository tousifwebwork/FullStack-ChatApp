import { useRef, useState } from 'react';
import { ClipboardClock, DoorClosed, Image, Languages, Send, X } from 'lucide-react';
import { useChatStore } from '../store/usechatstore';
import toast from 'react-hot-toast';
import Translator from './Translator';
import Schedule from './Schedule';
import ScheduledMessages from './ScheduledMessages';

const MessageInput = () => {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [showTranslator, setShowTranslator] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false)
  const fileInputRef = useRef(null);
  const { sendmessage } = useChatStore();

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Remove selected image
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendmessage({ text: text.trim(), image: imagePreview });
      setText('');
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="p-2 sm:p-4 w-full bg-base-100 border-t border-base-200">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-2 sm:mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-zinc-700"
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

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2 w-full">
       
        {/* Image upload button */}
        <label
          className={`shrink-0 btn btn-circle btn-sm sm:btn-md cursor-pointer ${
            imagePreview ? 'text-emerald-500' : 'text-zinc-400'
          }`}
        >
          <Image size={18} />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </label>



        {/* Translator button */}
        <label
          className={`shrink-0 btn btn-circle btn-sm sm:btn-md cursor-pointer text-zinc-400`}
          onClick={() => setShowTranslator(true)} >
          <Languages size={18} />
        </label>
       {/* Translator Modal */}
        {showTranslator && <Translator onClose={() => setShowTranslator(false)} />}



        
        {/* Sceduler button */}
        <label
          className={`shrink-0 btn btn-circle btn-sm sm:btn-md cursor-pointer text-zinc-400`}
          onClick={() =>setShowScheduler(true) } >
          <ClipboardClock size={18} />
        </label>
       {/* Scheduler Modal */}
        {showScheduler && <Schedule onClose={() => setShowScheduler(false)} />}
        



        {/* Text input */}
        <input
          type="text"
          className="flex-1 min-w-0 w-full bg-base-200 sm:bg-transparent outline-none text-sm sm:text-base py-2.5 px-4 rounded-full sm:input sm:input-bordered sm:rounded-lg sm:input-md"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Send button */}
        <button
          type="submit"
          className="shrink-0 btn btn-circle btn-sm sm:btn-md btn-primary"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;