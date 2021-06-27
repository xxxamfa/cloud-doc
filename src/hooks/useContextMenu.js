import { useEffect, useRef } from "react";
const { remote } = window.require("electron");
const { Menu, MenuItem } = remote;

// targetSelector:限制右鍵有效範圍
const useContextMenu = (itemArr, targetSelector,deps) => {
  let clickedElement = useRef(null);
  useEffect(() => {
    const menu = new Menu();
    itemArr.forEach((item) => {
      menu.append(new MenuItem(item));
    });
    const handleContextMenu = (e) => {
      // 右鍵功能只在特定區域顯示
      if (document.querySelector(targetSelector).contains(e.target)) {
        // 把目標給ref保存不受渲染影響
        clickedElement.current = e.target;
        menu.popup({ window: remote.getCurrentWindow() });
      }
    };
    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, deps);
  return clickedElement;
};

export default useContextMenu;
