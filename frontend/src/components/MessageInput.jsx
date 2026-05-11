import { useRef, useState } from "react";

import {
  ArrowBigUp,
  ClipboardClock,
  Image,
  Languages,
  Send,
  X
} from "lucide-react";

import toast from "react-hot-toast";

import { useChatStore } from "../store/usechatstore";

import useAutoreply from "../store/useAutoreplyStore";

import Translator from "./Translator";
import Schedule from "./Schedule";

const MessageInput = () => {

  const [text, setText] = useState("");

  const [imagePreview, setImagePreview] = useState(null);

  const [showTranslator, setShowTranslator] = useState(false);

  const [showScheduler, setShowScheduler] = useState(false);

  const fileInputRef = useRef(null);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const { sendmessage, messages } = useChatStore();

  const {
    suggestions,
    getSmartReplies,
    clearSuggestions
  } = useAutoreply();

  // Image Handler
  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file?.type.startsWith("image/")) {

      toast.error("Please select a valid image");

      return;
    }

    const reader = new FileReader();

    reader.onload = () => setImagePreview(reader.result);

    reader.readAsDataURL(file);
  };

  // Remove image
  const removeImage = () => {

    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Send Message
  const handleSendMessage = async (e) => {

    e.preventDefault();

    if (!text.trim() && !imagePreview) return;

    try {

      await sendmessage({
        text: text.trim(),
        image: imagePreview
      });

      setText("");

      setImagePreview(null);

      clearSuggestions();

      setShowSuggestions(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (err) {

      toast.error("Failed to send message");
    }
  };

  // Generate Smart Replies
  const handleSmartReplies = async () => {
    await getSmartReplies(messages);
    setShowSuggestions(true);
  };

  return (

    <div className="p-2 sm:p-4 w-full bg-base-100 border-t border-base-200">

      {/* Suggestions */}

      {suggestions.length > 0 && showSuggestions && (

        <div className="flex flex-wrap items-center gap-2 mb-3">

          {suggestions.map((reply, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setText(reply);
                clearSuggestions();
                setShowSuggestions(false);
              }}
              className="px-3 py-1 rounded-full bg-base-200 hover:bg-base-300 text-sm"
            >
              {reply}
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              clearSuggestions();
              setShowSuggestions(false);
            }}
            className="ml-auto btn btn-ghost btn-xs btn-circle"
          >
            <X size={16} />
          </button>

        </div>

      )}

      {/* Image Preview */}

      {imagePreview && (

        <div className="mb-3 flex items-center gap-2">

          <div className="relative">

            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />

            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
            >
              <X className="size-3" />
            </button>

          </div>

        </div>

      )}

      {/* Form */}

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2"
      >

        {/* Upload Image */}

        <label
          className={`btn btn-circle btn-sm sm:btn-md cursor-pointer ${
            imagePreview
              ? "text-emerald-500"
              : "text-zinc-400"
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

        {/* Translator */}

        <button
          type="button"
          className="btn btn-circle btn-sm sm:btn-md text-zinc-400"
          onClick={() => setShowTranslator(true)}
        >
          <Languages size={18} />
        </button>

        {showTranslator && (
          <Translator onClose={() => setShowTranslator(false)} />
        )}

        {/* Scheduler */}

        <button
          type="button"
          className="btn btn-circle btn-sm sm:btn-md text-zinc-400"
          onClick={() => setShowScheduler(true)}
        >
          <ClipboardClock size={18} />
        </button>

        {showScheduler && (
          <Schedule onClose={() => setShowScheduler(false)} />
        )}

        {/* Smart Reply */}

        <button
          type="button"
          className="btn btn-circle btn-sm sm:btn-md text-zinc-400"
          onClick={handleSmartReplies}
        >
          <ArrowBigUp size={22} />
        </button>

        {/* Input */}

        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 input input-bordered rounded-full"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Send */}

        <button
          type="submit"
          className="btn btn-circle btn-primary"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={18} />
        </button>

      </form>

    </div>
  );
};

export default MessageInput;