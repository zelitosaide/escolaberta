export default function EscolAbertaLogo() {
  return (
    <div className="w-24 h-24 grid place-items-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-full h-full">
        {/* Top face */}
        <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03z" fill="#FCD34D" />
        {/* Right face */}
        <path d="M21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93z" fill="#60A5FA" />
        {/* Left face */}
        <path d="M11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" fill="#F87171" />
      </svg>
    </div>
  );
}