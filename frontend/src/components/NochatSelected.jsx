import { MessageSquare } from 'lucide-react';

const NochatSelected = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 sm:p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-4 sm:space-y-6">
        {/* Animated Icon */}
        <div className="flex justify-center gap-4 mb-2 sm:mb-4">
          <div className="relative">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
              <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-xl sm:text-2xl font-bold">Welcome to Chatty!</h2>
        <p className="text-sm sm:text-base text-base-content/60">
          Select a conversation to start chatting
        </p>
      </div>
    </div>
  );
};

export default NochatSelected;