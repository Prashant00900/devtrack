import { GoogleLogin } from "@react-oauth/google";

function GoogleButton({ onCredential, onError }) {
  // Client ID set na ho to button chhupa do
  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) return null;

  return (
    <div>
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={(res) => onCredential(res.credential)}
          onError={() => onError("Google login was cancelled or failed")}
          theme="filled_black"
          shape="rectangular"
          text="continue_with"
          width="320"
        />
      </div>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-slate-800" />
        <span className="text-xs text-slate-500">OR</span>
        <div className="flex-1 h-px bg-slate-800" />
      </div>
    </div>
  );
}

export default GoogleButton;