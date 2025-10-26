import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router-dom";

const ShortcutHandler = () => {
  const navigate = useNavigate();

  // "mod+k" = ctrl+k di Windows / command+k di Mac
  useHotkeys("mod+p", (e) => {
    e.preventDefault();
    navigate("/profile");
  });

  useHotkeys("mod+l", (e) => {
    e.preventDefault();
    navigate("/notifikasi");
  });

  return null;
};

export default ShortcutHandler;
