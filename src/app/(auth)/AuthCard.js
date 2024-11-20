const AuthCard = ({ logo, children }) => (
  <div className="min-h-screen flex flex-col sm:justify-center items-center p-4 sm:pt-0 custom-bg-nyk">
    <div className="mb-4 sm:mb-6">{logo}</div>

    <div className="w-full sm:max-w-md px-4 sm:px-6 py-6 sm:py-8 bg-white shadow-md overflow-hidden rounded-xl sm:rounded-lg mx-auto">
      {children}
    </div>
  </div>
);

export default AuthCard;
